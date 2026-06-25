# ESP32 小智私有化部署实录：架构、路径与踩坑清单

> **适用人群**：非工程背景、希望把 xiaozhi 从公版云迁到本地 Mac 的开发者/产品人。  
> **硬件示例**：正成 zhengchen 1.54 TFT WiFi（ESP32-S3）  
> **软件栈**：[xinnan-tech/xiaozhi-esp32-server](https://github.com/xinnan-tech/xiaozhi-esp32-server) Docker 全模块 + 可选声纹服务 + MCP 读本地文件  
> **作者背景**：文科出身，零代码基础；部署与脚本编写主要借助 Cursor 协作完成。

---

## 一、先建立正确心智模型

```
┌─────────────┐     WiFi      ┌──────────────────────────────┐
│  ESP32 板子  │ ────────────→ │  Mac 私有化服务（Docker）       │
│  听 + 说 + 屏 │               │  ASR / LLM / TTS / 智控台      │
└─────────────┘               │  声纹 API · MCP 接入点          │
                              └──────────────┬───────────────┘
                                             │
                              ┌──────────────▼───────────────┐
                              │  Mac 本地数据（白名单目录）      │
                              │  weekly / daily / 业务泳道    │
                              └──────────────────────────────┘
```

**三个关键事实：**

1. **板子不读文件、不上 GitHub**——它只负责语音交互；「大脑」和「读资料」都在 Mac。
2. **私有化 ≠ 完全离线**——若 LLM 用阿里云 DashScope，对话内容仍会发往云端 API（用你的 Key）；完全本地需另换模型（进阶）。
3. **推荐顺序**：先 Mac 服务跑通 → 再烧录/改 OTA 指本机 → 最后声纹 / MCP。

---

## 二、推荐部署路径（四阶段）

### 阶段 0 · 摸底

| 项 | 说明 |
|----|------|
| Docker Desktop | Mac 已安装且 Running |
| DashScope API Key | 通义千问（全 API 模式，不在本机跑大模型） |
| 局域网 IP | 板子与 Mac 须同一网络；记下 IP 供 OTA/WebSocket |

**验收**：`docker run hello-world` 成功。

### 阶段 1 · 私有化对话跑通（核心）

1. 按官方 [Deployment_all.md](https://github.com/xinnan-tech/xiaozhi-esp32-server/blob/main/docs/Deployment_all.md) 拉取 `docker-compose_all.yml`。
2. Apple Silicon 若镜像报错，容器加 `platform: linux/amd64`。
3. 配置 `data/.config.yaml`：`manager-api.url`、`manager-api.secret`（来自智控台 `server.secret`）。
4. `docker compose up -d` 启动：智控台（约 8002）、对话服务（约 8000）、MySQL、Redis。
5. 智控台创建智能体，配置 LLM、人设、记忆模式。
6. 板子烧录 **1.6.2 OTA 固件**（支持私有 OTA），配网后在智控台绑定设备。

**参数字典关键项：**

| 参数 | 说明 |
|------|------|
| `server.websocket` | `ws://<Mac局域网IP>:8000/xiaozhi/v1/` |
| `server.ota` | `http://<Mac局域网IP>:8002/xiaozhi/ota/` |
| `server.voice_print` | 见下文声纹节 |

**验收**：断网 xiaozhi.me 仍可对话；智控台设备在线。

### 阶段 2 · MCP 读本地资料

1. 部署 [mcp-endpoint-server](https://github.com/xinnan-tech/xiaozhi-esp32-server)（约 8004 端口）。
2. Mac 上常驻运行 MCP 桥接脚本（stdio ↔ WebSocket），连接智控台 **MCP 接入点**。
3. 智控台 → 智能体 → **编辑功能** → MCP 区域 **↻ 刷新**，确认工具列表出现。
4. Python 脚本只读 **白名单路径**，注册工具供 LLM 调用。

**典型工具能力（示例）：**

| 工具 | 用途 |
|------|------|
| `get_meetings_on_date` | 从 weekly/daily 读会议（非系统日历） |
| `get_weekly_business_progress` | 读 §每周业务进展（机票/酒店/火车 × 各小节） |
| `get_weekly_detail` | 读 §进展明细（moles、fitwow 等项目） |
| `get_daily_plan` | 读 daily 今日定位 / 会议 / 进展 |
| `list_progress_outline` | 列出可查章节索引 |

**验收**：问「明天有什么会」「机票体验指标多少」，回答与本地 markdown 一致，非模型编造。

### 阶段 3 · 声纹认人（可选）

1. 单独部署 [voiceprint-api](https://github.com/xinnan-tech/voiceprint-api)（约 8005），连 MySQL。
2. 智控台 → **系统功能配置** → 勾选「声纹识别」。
3. `server.voice_print` 填容器内地址（见踩坑 #3）。
4. 智能体开启 **上报文字+语音** → 先语音聊几句 → **声纹识别 → 新增** 注册说话人。
5. 重启对话服务 / 板子后，日志应出现声纹已启用（非「声纹识别功能未启用」）。

**验收**：注册者问「你知道我是谁吗」能认出；未注册者不被误称为主人（需人设配合）。

### 阶段 4 · 加固（可选）

- Mac 合盖不休眠，或迁 NAS / 常开主机
- 备份 `private-server/data/`
- 扩展 MCP 白名单（GitHub 只读、日历等）

---

## 三、踩坑清单（真实遇到过）

### 网络与 OTA

| # | 现象 | 原因 | 处理 |
|---|------|------|------|
| 1 | OTA 保存后板子连不上 | Mac 换 WiFi，IP 变了，参数字典与 OTA 仍是旧 IP | Mac 与板子同网；同步改 `server.websocket`、`server.ota` |
| 2 | 配网高级设置 `/advanced` 404 | 路径错误或未连 Xiaozhi 热点 | 连热点后访问 `http://192.168.4.1`，用 **高级** 标签 |
| 3 | Guest WiFi / 中文 SSID 连不上 | 隔离网、兼容性 | 英文 SSID + iPhone 热点「最大兼容性」 |
| 4 | 公司 WiFi 设备互访被禁 | 企业 AP 隔离 | 改手机热点或家庭网络 |

### 声纹

| # | 现象 | 原因 | 处理 |
|---|------|------|------|
| 5 | 声纹地址保存转圈 | 智控台校验 URL 时访问 `172.x` 热点 IP 超时 | 改用 `http://voiceprint-api:8005/voiceprint/health?key=...`（Docker 容器名） |
| 6 | 智控台无「声纹识别」按钮 | `system-web.menu` 未开 + 浏览器缓存旧配置 | DB/系统功能配置开启；`Cmd+Shift+R` 强刷；重启 web 容器 |
| 7 | 日志「声纹识别功能未启用」 | 未注册声纹 / 功能未开 / URL 未配 | 完成注册；确认 `ai_agent_voice_print` 有记录 |
| 8 | 同一人无法新增第二条声纹 | 系统设计：同 Agent 下同一声音相似度 > 0.5 拒绝 | 用 **编辑** 换录音，不要重复新增 |
| 9 | 人人都被叫「老板」 | 人设写死主人名，非声纹生效 | 声纹注册 + 人设约束「未知说话人用泛称」 |

### MCP 与 LLM

| # | 现象 | 原因 | 处理 |
|---|------|------|------|
| 10 | 问资料答非所问 | MCP 桥接未运行（`mcp_pipe` 窗口关） | Mac 常驻运行桥接；编辑功能里刷新 MCP |
| 11 | 会议/业务「加戏」编造 | LLM 在工具结果上幻觉 | 工具返回加「禁止编造」前缀；人设约束；调低 temperature |
| 12 | 把「硬节点」说成会议 | 模型混淆 DDL 与会议表 | 会议工具只输出会议表；硬节点单独标注「不是会议」 |
| 13 | 业务进展答成「今日黄历」 | 旧工具只读文件前 5000 字 | 按 markdown 章节精确读取（§每周业务进展 / daily 子节） |
| 14 | 查不到「明天」的会 | 只有「今日会议」daily 节，未来日在 §日历明细 | 用按日期解析 weekly 的工具，非 `read_today` |

### 烧录

| # | 现象 | 原因 | 处理 |
|---|------|------|------|
| 15 | Mac 识别不到串口 | CH341 驱动未授权 | 系统设置 → 隐私 → 允许驱动；装 `CH341SER_MAC` |
| 16 | esptool 连不上 | 未进下载模式 | 按住 **BOOT** + 拔插 USB / 开关重启 |
| 17 | 先烧录后搭服务 | 顺序反了 | **先**智控台能打开，**再**烧录绑本机 |

---

## 四、智控台关键入口速查

| 要做的事 | 入口 |
|----------|------|
| 改 WebSocket / OTA | 参数字典 |
| 开声纹 / MCP | 参数字典 → **系统功能配置** |
| 刷 MCP 工具列表 | 智能体 → 配置角色 → **编辑功能** → MCP **↻ 刷新** |
| 注册声纹 | 智能体卡片 → **声纹识别** → 新增（非配置角色里） |
| 开语音上报 | 配置角色 → 记忆 → **上报文字+语音** |

---

## 五、隐私与安全

**不会提交到 git 的内容：**

- `.env`、`server.secret`、DashScope Key、声纹 key
- 个人 weekly/daily 原文（MCP 白名单在本地，不进公开仓库）

**仍会上云的部分（全 API 模式）：**

- 语音识别、合成、LLM 推理 → 对应云厂商 API

---

## 六、回滚

| 场景 | 操作 |
|------|------|
| 私有化搞不定 | 烧录回 1.55 固件 → xiaozhi.me 重新绑定 |
| 停 Mac 服务 | `docker compose down`，板子可继续用公版云 |
| MCP 异常 | 关桥接脚本即可，不影响基础对话 |

---

## 七、参考链接

| 资源 | URL |
|------|-----|
| xiaozhi-esp32-server | https://github.com/xinnan-tech/xiaozhi-esp32-server |
| 全模块部署文档 | https://github.com/xinnan-tech/xiaozhi-esp32-server/blob/main/docs/Deployment_all.md |
| voiceprint-api | https://github.com/xinnan-tech/voiceprint-api |
| 虾哥 ESP32 固件 | https://github.com/78/xiaozhi-esp32 |

---

## 八、协作建议（非工程背景）

1. **一个阶段一个 Cursor 对话**，附上本文与当前卡在哪一步。
2. **你负责**：Docker 开关、API Key 粘贴、浏览器验收、板子配网。
3. **Cursor 负责**：命令、配置、脚本、查日志。
4. 每阶段 **验收清单打勾** 再进下一步，避免同时踩网络 + 烧录 + 声纹。

---

*建档：2026-06-25 · 基于 Mac + 正成 1.54 WiFi + xiaozhi-esp32-server 0.9.x 私有化实践整理*
