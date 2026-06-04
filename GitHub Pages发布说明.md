# GitHub Pages 免费域名发布说明

可以发布，但要先确认一个关键点：GitHub Pages 默认是公网访问，不是公司内网访问。

如果 Demo 里没有敏感业务数据，可以用 GitHub 免费域名发布；如果涉及真实客户、真实交易、内部经营或未公开业务信息，不建议放到公开 GitHub 仓库。

## 发布后的地址长什么样

如果仓库名叫 `change-platform`，地址一般是：

```text
https://你的GitHub用户名.github.io/change-platform/
```

如果仓库名叫 `你的GitHub用户名.github.io`，地址一般是：

```text
https://你的GitHub用户名.github.io/
```

## 推荐方式

建议新建一个公开仓库：

```text
change-platform
```

这个仓库只放发布后的静态网页，不放源码工程目录。

## 第一次发布

### 1. 生成 GitHub Pages 发布包

在项目根目录执行：

```powershell
.\tools\build-github-pages-release.ps1
```

执行后会生成：

```text
output/github-pages-release/
output/github-pages-release.zip
```

### 2. 创建 GitHub 仓库

在 GitHub 新建公开仓库：

```text
change-platform
```

### 3. 上传发布包内容

把 `output/github-pages-release/` 里的所有内容上传到 GitHub 仓库根目录。

注意：上传的是文件夹里面的内容，不是上传 `github-pages-release` 这个文件夹本身。

### 4. 打开 GitHub Pages

进入仓库：

```text
Settings -> Pages
```

选择：

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

保存后等待 1 到 3 分钟，GitHub 会生成访问地址。

## 后续每次更新

每次 Codex 改完 Demo 后：

1. 执行 `.\tools\build-github-pages-release.ps1`。
2. 把新的 `output/github-pages-release/` 内容覆盖到 GitHub 仓库。
3. 提交到 GitHub。
4. 等 GitHub Pages 自动刷新。

## 我可以继续帮你做什么

如果你把 GitHub 仓库地址发给我，例如：

```text
https://github.com/你的用户名/change-platform.git
```

我可以继续帮你把发布包推到这个仓库里。

如果你希望我直接创建仓库，需要你这台电脑先登录 GitHub，或者提供一个你确认可用的仓库地址。
