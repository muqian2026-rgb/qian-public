# Skill 激活测试（Equip 必过）

> Equip 阶段产出 `skills/<slug>/` 后、标记 `equipped` 前**必须完成**。  
> 记录写入 `learn/<slug>/skill-activation-test.md`；通过后更新 `meta.json` → `skillTestedAt`。

---

## 1. 触发测试（5 种说法 → 均应激活）

| # | 用户说法 | 应激活 Skill | 结果 ✅/❌ | 备注 |
|---|----------|--------------|-----------|------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

## 2. 误触发测试（3 种相邻场景 → 均不应激活）

| # | 用户说法 | 应路由到 | 结果 ✅/❌ | 备注 |
|---|----------|----------|-----------|------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

## 3. 自问

- **问 Agent**：「你什么时候会用这个 skill？」
- **预期回答**：
- **实际回答**：
- **结果**：✅ / ❌

## 4. 元数据

- [ ] `description` 含明确 trigger 词
- [ ] 负约束已写入 SKILL.md
- [ ] 与相近 Skill 边界已写明

## 5. 结论

- [ ] **通过** → `meta.json` 写入 `skillTestedAt`（ISO 日期）
- [ ] **未通过** → 回炉 SKILL.md，记录原因：

---

## 双 Skill 拆分（diagnose / apply）时

对 `skills/<slug>/diagnose/` 与 `skills/<slug>/apply/` **分别**填一份本表，或在本文件分 § diagnose / § apply 两节。
