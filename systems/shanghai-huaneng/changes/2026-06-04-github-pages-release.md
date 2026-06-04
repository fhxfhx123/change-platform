# 变更平台支持 GitHub Pages 免费域名发布

- 日期：2026-06-04
- 记录类型：协同说明
- 适用范围：变更平台发布流程

## 本次改动内容

### 1. 新增 GitHub Pages 发布说明

平台根目录新增《GitHub Pages发布说明》，说明如何把变更平台发布到 GitHub 的免费 `github.io` 域名。

说明里明确了两类访问地址：

- 项目站点：`https://你的GitHub用户名.github.io/change-platform/`
- 个人主页站点：`https://你的GitHub用户名.github.io/`

### 2. 新增 GitHub Pages 专用发布包

新增 `tools/build-github-pages-release.ps1`，用于生成适合上传到 GitHub 仓库的静态网页包。

执行后会生成：

- `output/github-pages-release/`
- `output/github-pages-release.zip`

### 3. 发布包适配 GitHub Pages

发布包会自动包含：

- 平台首页。
- 系统 Demo。
- 变更记录。
- 样式和脚本资源。
- `.nojekyll` 文件，避免 GitHub Pages 使用 Jekyll 处理静态资源。
- GitHub Pages 发布说明。

### 4. 增加公网发布风险提示

GitHub Pages 默认是公网访问，不是公司内网访问。

如果 Demo 里包含真实客户、真实交易、内部经营、未公开业务流程或公司敏感数据，不建议直接放到公开 GitHub 仓库。

## 推荐使用方式

如果只是给外部演示或跨团队看样，可以创建公开仓库 `change-platform`，上传 `output/github-pages-release/` 里的内容，并在 GitHub 仓库设置里开启 Pages。

如果是公司内部协作，仍优先使用内网服务器发布方式。
