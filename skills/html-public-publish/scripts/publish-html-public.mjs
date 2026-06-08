#!/usr/bin/env node
/**
 * 单文件 HTML → Surge 公网站点（根路径即该页）。
 * 需环境变量：SURGE_LOGIN、SURGE_TOKEN（见 https://surge.sh/help/using-surge-with-ci ）
 */

import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

function parseArgs(argv) {
  const args = argv.slice(2);
  let file = "";
  let subdomain = "";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--file" && args[i + 1]) file = args[++i];
    else if (args[i] === "--subdomain" && args[i + 1]) subdomain = args[++i];
    else if (!args[i].startsWith("-") && !file) file = args[i];
  }
  return { file, subdomain };
}

function fail(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

function sanitizeSubdomain(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function randomSubdomain() {
  const id = randomBytes(4).toString("hex");
  return `pub-${id}`;
}

const { file: fileArg, subdomain: userSub } = parseArgs(process.argv);
if (!fileArg) {
  fail(
    "用法:\n" +
      "  node publish-html-public.mjs --file <path/to/page.html> [--subdomain 可选]\n" +
      "  node publish-html-public.mjs <path/to/page.html>\n\n" +
      "需设置环境变量 SURGE_LOGIN（邮箱）、SURGE_TOKEN（surge token）。"
  );
}

const filePath = resolve(fileArg);
try {
  const st = statSync(filePath);
  if (!st.isFile()) fail(`不是文件: ${filePath}`);
} catch {
  fail(`文件不存在: ${filePath}`);
}
if (!filePath.toLowerCase().endsWith(".html")) {
  fail(`须为 .html 文件: ${filePath}`);
}

if (!process.env.SURGE_LOGIN || !process.env.SURGE_TOKEN) {
  fail(
    "缺少 Surge 凭证。请先执行:\n" +
      "  export SURGE_LOGIN='你的邮箱'\n" +
      "  export SURGE_TOKEN='npx surge token 获取的 token'\n" +
      "详见: https://surge.sh/help/using-surge-with-ci"
  );
}

let baseSub = userSub ? sanitizeSubdomain(userSub) : randomSubdomain();
if (userSub && !baseSub) fail("--subdomain 仅允许字母数字与连字符");

const tmpRoot = mkdtempSync(join(tmpdir(), "html-pub-"));
const tmpDir = join(tmpRoot, "site");
mkdirSync(tmpDir, { recursive: true });
const indexPath = join(tmpDir, "index.html");
copyFileSync(filePath, indexPath);

const maxAttempts = userSub ? 1 : 6;
let lastErr = "";

for (let attempt = 0; attempt < maxAttempts; attempt++) {
  const sub =
    attempt === 0 ? baseSub : `${baseSub}-${randomBytes(2).toString("hex")}`;
  const domain = `${sub}.surge.sh`;

  const result = spawnSync(
    "npx",
    ["--yes", "surge@latest", tmpDir, domain],
    {
      encoding: "utf8",
      env: { ...process.env },
      stdio: ["pipe", "pipe", "pipe"],
      maxBuffer: 10 * 1024 * 1024,
    }
  );

  const out = `${result.stdout || ""}\n${result.stderr || ""}`;
  lastErr = out;

  if (result.status === 0) {
    const m = out.match(/https:\/\/[^\s)]+surge\.sh[^\s)]*/i);
    const url = m ? m[0].replace(/\/$/, "") : `https://${domain}`;
    console.log(url.endsWith("/") ? url.slice(0, -1) : url);
    try {
      rmSync(tmpRoot, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
    process.exit(0);
  }

  const lower = out.toLowerCase();
  const maybeTaken =
    lower.includes("already") ||
    lower.includes("taken") ||
    lower.includes("in use") ||
    lower.includes("exists");
  if (userSub || !maybeTaken) break;
}

try {
  rmSync(tmpRoot, { recursive: true, force: true });
} catch {
  /* ignore */
}

fail(`Surge 发布失败。最后输出:\n${lastErr.slice(-4000)}`, 1);
