# 分镜脚本生成 · domain-learn Video

从 `timeline-milestones.json` 的 `hero` + `lifeTreeBranches[]` 生成 `narrative-videos.json` 中的 `voiceoverScript` 与 `scenes[]`。

## 输出约束

- 每条成片 `durationTargetSec`: **90**
- 固定 **6 镜**，每镜 `durationSec`: **15**（API 单次上限；成片由 ffmpeg 拼接）
- `voiceoverScript`：中文 **350–400 字**，口播约 90s（约 4 字/秒）
- 每镜 `narrationLine`：一句，与 `prompt` 画面一致

## prompt 写法（英文为主，模型兼容更好）

每条 `prompt` 必须包含：

1. **纪名 / 年代**（与 branch.time 一致）
2. **主体生物或事件**（博物馆纪录片、scientific illustration）
3. **镜头**：slow drift / underwater / documentary lighting
4. **禁止**：`negativePrompt` 写现代城市、错纪恐龙（如寒武纪霸王龙）

## negativePrompt 模板

```
dinosaurs in wrong era, humans anachronistic, modern city, skyscrapers, text watermark, cartoon style
```

按纪替换：寒武纪镜禁止 `T-Rex`；前寒武武禁止 `trilobites`。

## 条目结构

```json
{
  "overview": { "title", "voiceoverScript", "scenes": [6], "video": { "status": "pending", "localPath": "assets/videos/overview.mp4" } },
  "segments": [{ "branchId", "title", "voiceoverScript", "scenes": [6], "video": { ... } }]
}
```

## 生成后门禁（人工一眼）

- [ ] 6 镜年代顺序与 branch 一致
- [ ] 无跨纪混镜（K-Pg 仅出现在新生代/白垩纪末镜）
- [ ] 再运行 `generate-narrative-video.py`

## 命令

```bash
# 占位试点（无 API Key）
python3 learn/paleontology/scripts/generate-narrative-video.py --dry-run --target overview

# 全量（需 .env 中 KLING_ACCESS_KEY + KLING_SECRET_KEY）
python3 learn/paleontology/scripts/generate-narrative-video.py --provider kling --target all
```
