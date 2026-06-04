window.PLATFORM_DATA = {
  platform: {
    name: "变更平台",
    subtitle: "适合产品经理统一管理多个系统的 Demo、研发协同信息和 Markdown 变更记录。",
    guide: [
      "把新系统放到 systems/<system-id>/ 目录下。",
      "把 Reddy 导出的前端 Demo 放到 systems/<system-id>/demo/。",
      "每次修改新增一个 md 文件，放到 systems/<system-id>/changes/。",
      "在 data.js 里补充系统名称、状态、Demo 地址和变更文件列表。"
    ]
  },
  systems: [
    {
      id: "shanghai-huaneng",
      shortName: "华",
      name: "上海华能电力交易平台",
      description: "一个完整的电力交易业务 Demo，包含现货交易、系统管理、需求响应、辅助服务和售电等多个业务入口。",
      owner: "产品经理 / 电力业务研发",
      stage: "Demo 已接入平台",
      status: "待评审",
      rootPath: "上海华能（源码） / systems/shanghai-huaneng（平台接入）",
      demoUrl: "systems/shanghai-huaneng/demo/index.html#/dashboard",
      tags: ["React", "Vite", "电力交易", "多业务系统"],
      records: [
        {
          date: "2026-06-04",
          timestamp: "2026-06-04T17:51:34+08:00",
          recordType: "发布说明",
          title: "变更平台已发布到 GitHub Pages",
          summary: "已创建 GitHub 仓库 fhxfhx123/change-platform，并将平台发布到 GitHub Pages 免费域名，当前访问地址为 https://fhxfhx123.github.io/change-platform/。",
          file: "systems/shanghai-huaneng/changes/2026-06-04-github-pages-published.md"
        },
        {
          date: "2026-06-04",
          timestamp: "2026-06-04T17:37:22+08:00",
          recordType: "协同说明",
          title: "变更平台支持 GitHub Pages 免费域名发布",
          summary: "新增 GitHub Pages 发布说明和专用发布包工具，平台可以发布到 GitHub 免费域名，用于公网演示和跨团队访问。",
          file: "systems/shanghai-huaneng/changes/2026-06-04-github-pages-release.md"
        },
        {
          date: "2026-06-04",
          timestamp: "2026-06-04T17:24:23+08:00",
          recordType: "协同说明",
          title: "变更平台支持内网发布包",
          summary: "新增内网发布说明和一键发布包工具，发布包只包含平台入口、系统 Demo、变更记录和静态资源，适合直接交给公司内网服务器部署。",
          file: "systems/shanghai-huaneng/changes/2026-06-04-intranet-release-package.md"
        },
        {
          date: "2026-06-04",
          timestamp: "2026-06-04T17:17:23+08:00",
          recordType: "业务说明",
          title: "上海华能首页按日前实时发布口径重写",
          summary: "首页全部重写为现货发布口径工作台，明确实时数据按D+2发布D日、日前数据按D发布D+1日，并将两类数据拆开展示。",
          file: "systems/shanghai-huaneng/changes/2026-06-04-market-home-release-calendar.md"
        },
        {
          date: "2026-06-04",
          timestamp: "2026-06-04T17:07:58+08:00",
          recordType: "业务说明",
          title: "上海华能首页删掉辅助说明区",
          summary: "删除今日市场判断、市场信号、申报价与出清价复盘、数据时效和说明，只保留市场指标、核心数据卡和价格与竞价空间联动图。",
          file: "systems/shanghai-huaneng/changes/2026-06-04-market-home-simplify.md"
        },
        {
          date: "2026-06-04",
          timestamp: "2026-06-04T16:56:35+08:00",
          recordType: "业务说明",
          title: "上海华能首页改成市场看盘页",
          summary: "将首页从经营摘要调整为市场看盘页，去掉结算和经营口径，改为竞价空间、电价、负荷、新能源、滚动净敞口等市场数据，并同步补充了帮助中心的文字说明。",
          file: "systems/shanghai-huaneng/changes/2026-06-04-market-home-redesign.md"
        },
        {
          date: "2026-06-04",
          recordType: "业务说明",
          title: "上海华能 Demo 接入平台",
          summary: "已将上海华能前端 Demo 打包并接入变更平台，后续可以继续补充迭代记录和业务拆分。",
          file: "systems/shanghai-huaneng/changes/2026-06-04-demo-access.md"
        }
      ]
    },
    {
      id: "system-a",
      shortName: "风",
      name: "交易风控系统",
      description: "实时交易风险监控与预警平台，适合演示风险规则、预警看板和人工复核流程。",
      owner: "产品经理 / 风控研发",
      stage: "Reddy 原型已确认",
      status: "迭代中",
      rootPath: "systems/system-a",
      demoUrl: "systems/system-a/demo/index.html",
      tags: ["Reddy 原型", "Codex 迭代", "风控"],
      records: [
        {
          date: "2026-06-01",
          recordType: "业务说明",
          title: "风险规则引擎 v1 发布",
          summary: "完成基础风险规则引擎搭建，形成第一版实时监控与告警闭环。",
          file: "systems/system-a/changes/2026-06-01-risk-engine-v1.md"
        },
        {
          date: "2026-05-28",
          recordType: "业务说明",
          title: "Reddy 原型评审确认",
          summary: "完成原型评审，确认首页指标、告警流和人工复核入口的展示方式。",
          file: "systems/system-a/changes/2026-05-28-reddy-prototype-review.md"
        }
      ]
    },
    {
      id: "system-b",
      shortName: "权",
      name: "用户权限中心",
      description: "统一认证与角色权限管理平台，适合沉淀权限树、角色模型和审计流程演进。",
      owner: "产品经理 / 平台研发",
      stage: "Codex 正在持续优化",
      status: "待联调",
      rootPath: "systems/system-b",
      demoUrl: "systems/system-b/demo/index.html",
      tags: ["权限管理", "树形权限", "联调准备"],
      records: [
        {
          date: "2026-06-03",
          recordType: "业务说明",
          title: "权限树结构重构",
          summary: "将原来的扁平权限模型升级为树形结构，支持资源级权限继承。",
          file: "systems/system-b/changes/2026-06-03-permission-tree-refactor.md"
        },
        {
          date: "2026-05-30",
          recordType: "业务说明",
          title: "权限分配流程调整",
          summary: "根据评审意见，优化了角色分配和批量授权的交互路径。",
          file: "systems/system-b/changes/2026-05-30-prototype-adjustment.md"
        },
        {
          date: "2026-05-25",
          recordType: "业务说明",
          title: "RBAC 基础版上线",
          summary: "完成用户、角色、权限三层基础模型，为后续审计和资源授权打底。",
          file: "systems/system-b/changes/2026-05-25-rbac-v1.md"
        }
      ]
    }
  ]
};
