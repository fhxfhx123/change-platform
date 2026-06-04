// ===========================
// 多系统变更协同平台
// ===========================

const state = {
  systems: [],
  keyword: "",
  status: "all",
  activeSystemId: "",
  activeRecordId: "",
  recordsVersion: ""
};

function init() {
  const payload = window.PLATFORM_DATA;
  if (!payload || !Array.isArray(payload.systems)) {
    renderError("未找到平台数据", "请确认 data.js 已正确配置。");
    return;
  }

  hydrateSystems(payload);
  syncSelection();
  render(payload.platform || {});
  bindEvents();
  setupGeneratedRecordsPolling();
}

function hydrateSystems(payload) {
  const generatedBundle = getGeneratedRecordsBundle();
  state.systems = normalizeSystems(payload.systems, generatedBundle.systems || {});
  state.recordsVersion = generatedBundle.generatedAt || "";
}

function getGeneratedRecordsBundle() {
  const bundle = window.GENERATED_RECORDS_BUNDLE || {};
  return {
    generatedAt: bundle.generatedAt || "",
    systems: bundle.systems || {}
  };
}

function normalizeSystems(systems, generatedRecords) {
  return systems
    .map(system => {
      const recordMap = new Map();
      const mergedRecords = [
        ...(system.records || []),
        ...((generatedRecords && generatedRecords[system.id]) || [])
      ];

      mergedRecords.forEach(record => {
        if (!record || !record.file) return;
        recordMap.set(record.file, {
          ...record,
          recordId: `${system.id}::${record.file}`
        });
      });

      const records = [...recordMap.values()].sort(compareRecords);

      return {
        ...system,
        tags: system.tags || [],
        records,
        featuredRecord: getFeaturedRecord(records),
        latestRecord: records[0] || null
      };
    })
    .sort((a, b) => getRecordSortValue(b.latestRecord) - getRecordSortValue(a.latestRecord));
}

function compareRecords(a, b) {
  return getRecordSortValue(b) - getRecordSortValue(a);
}

function getRecordSortValue(record) {
  if (!record) return 0;
  const raw = record.timestamp || record.date || "";
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function isAutoRecord(record) {
  if (!record) return false;
  return record.recordType === "自动同步日志" || /-auto-sync\.md$/i.test(record.file || "");
}

function getRecordTypeLabel(record) {
  if (!record) return "变更说明";
  return isAutoRecord(record) ? "自动同步日志" : (record.recordType || "变更说明");
}

function getFeaturedRecord(records) {
  return records.find(record => !isAutoRecord(record)) || records[0] || null;
}

function getUniqueStatuses() {
  return [...new Set(state.systems.map(system => system.status).filter(Boolean))];
}

function getFilteredSystems() {
  const keyword = state.keyword.trim().toLowerCase();

  return state.systems.filter(system => {
    const matchesStatus = state.status === "all" || system.status === state.status;
    const haystack = [
      system.name,
      system.description,
      system.owner,
      system.stage,
      ...(system.tags || [])
    ]
      .join(" ")
      .toLowerCase();
    const matchesKeyword = !keyword || haystack.includes(keyword);
    return matchesStatus && matchesKeyword;
  });
}

function getAllRecords() {
  return state.systems
    .flatMap(system =>
      system.records.map(record => ({
        ...record,
        systemId: system.id,
        systemName: system.name,
        demoUrl: system.demoUrl
      }))
    )
    .sort(compareRecords);
}

function syncSelection() {
  const filteredSystems = getFilteredSystems();
  if (!filteredSystems.length) {
    state.activeSystemId = "";
    state.activeRecordId = "";
    return;
  }

  const activeSystemExists = filteredSystems.some(system => system.id === state.activeSystemId);
  if (!activeSystemExists) {
    state.activeSystemId = filteredSystems[0].id;
  }

  const activeSystem = filteredSystems.find(system => system.id === state.activeSystemId) || filteredSystems[0];
  const activeRecordExists = activeSystem.records.some(record => record.recordId === state.activeRecordId);
  if (!activeRecordExists) {
    state.activeRecordId = activeSystem.featuredRecord?.recordId || activeSystem.records[0]?.recordId || "";
  }
}

function getActiveSystem(filteredSystems) {
  return filteredSystems.find(system => system.id === state.activeSystemId) || null;
}

function getActiveRecord(system) {
  if (!system) return null;
  return system.records.find(record => record.recordId === state.activeRecordId) || system.featuredRecord || system.records[0] || null;
}

function countSystemsWithDemo() {
  return state.systems.filter(system => system.demoUrl).length;
}

function render(platform) {
  const filteredSystems = getFilteredSystems();
  syncSelection();
  const activeSystem = getActiveSystem(filteredSystems);
  const activeRecord = getActiveRecord(activeSystem);
  const allRecords = getAllRecords();

  renderHeroSummary(platform, allRecords);

  document.getElementById("app").innerHTML = `
    ${renderToolbar(filteredSystems)}
    ${filteredSystems.length ? renderWorkspace(filteredSystems, activeSystem, activeRecord, allRecords, platform) : renderEmptyState()}
  `;
}

function renderHeroSummary(platform, allRecords) {
  const summaryEl = document.getElementById("heroSummary");
  const latestRecord = allRecords[0];

  summaryEl.innerHTML = `
    <div class="summary-panel">
      <div>
        <div class="summary-label">平台概览</div>
        <div class="summary-grid">
          <div class="summary-card">
            <strong>${state.systems.length}</strong>
            <span>已纳入系统</span>
          </div>
          <div class="summary-card">
            <strong>${allRecords.length}</strong>
            <span>Markdown 记录</span>
          </div>
          <div class="summary-card">
            <strong>${countSystemsWithDemo()}</strong>
            <span>已接入 Demo</span>
          </div>
          <div class="summary-card">
            <strong>${latestRecord ? latestRecord.date : "-"}</strong>
            <span>最近更新日期</span>
          </div>
        </div>
      </div>
      <div class="summary-feature">
        <h2>${escapeHtml(platform?.name || "多系统协同视图")}</h2>
        <p>${escapeHtml(platform?.subtitle || "适合持续汇总 Reddy 原型、Codex 修改和研发协同记录。")}</p>
      </div>
    </div>
  `;
}

function renderToolbar(filteredSystems) {
  const statusFilters = ["all", ...getUniqueStatuses()];

  return `
    <section class="panel toolbar">
      <div class="toolbar-copy">
        <h2>系统总览</h2>
        <p>按系统查看 Demo、切换到对应说明文档，并快速定位最近一次业务改动。</p>
      </div>
      <div class="toolbar-actions">
        <label class="search-box">
          <input
            id="searchInput"
            type="search"
            value="${escapeAttr(state.keyword)}"
            placeholder="搜索系统名、描述或标签"
          >
        </label>
        <div class="status-filters">
          ${statusFilters.map(status => `
            <button
              class="filter-chip ${state.status === status ? "active" : ""}"
              data-status-filter="${escapeAttr(status)}"
              type="button"
            >
              ${status === "all" ? `全部 (${filteredSystems.length})` : escapeHtml(status)}
            </button>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderWorkspace(filteredSystems, activeSystem, activeRecord, allRecords, platform) {
  return `
    <section class="workspace-grid">
      <aside class="panel systems-panel" id="systemsPanel">
        <div class="panel-title">
          <h2>系统清单</h2>
          <span>${filteredSystems.length} 个结果</span>
        </div>
        <div class="system-list">
          ${filteredSystems.map(renderSystemCard).join("")}
        </div>
      </aside>

      <section class="panel detail-panel">
        ${activeSystem ? renderDetail(activeSystem, activeRecord) : ""}
      </section>
    </section>

    <section class="panel feed-panel">
      <div class="section-head">
        <h2>全部变更文件</h2>
        <p>这里聚合展示所有系统的说明文档和同步日志，方便你快速查看最近一次改动。</p>
      </div>
      <div class="feed-grid">
        ${allRecords.map(renderFeedItem).join("")}
      </div>
    </section>

    <section class="panel guide-panel" id="guidePanel">
      <div class="section-head">
        <h2>后续接入方式</h2>
        <p>你后面只需要往目录里放 Demo 和 Markdown 文件，再补一条系统配置即可。</p>
      </div>
      ${renderGuide(platform)}
    </section>
  `;
}

function renderSystemCard(system) {
  const primaryRecord = system.featuredRecord || system.latestRecord;

  return `
    <article class="system-card ${state.activeSystemId === system.id ? "active" : ""}" data-system-card="${escapeAttr(system.id)}">
      <div class="system-card-top">
        <div class="system-badge">${escapeHtml((system.shortName || system.name || "?").slice(0, 1))}</div>
        <div class="system-heading">
          <h3>${escapeHtml(system.name)}</h3>
          <p>${escapeHtml(system.description)}</p>
        </div>
      </div>
      <div class="system-meta">
        <span class="pill status">${escapeHtml(system.status || "未标记状态")}</span>
        ${system.stage ? `<span class="pill warning">${escapeHtml(system.stage)}</span>` : ""}
        ${system.owner ? `<span class="pill">${escapeHtml(system.owner)}</span>` : ""}
      </div>
      <div class="system-footer">
        <div>
          <strong>${system.records.length} 个变更文件</strong>
          <span>默认展示 ${primaryRecord ? `${escapeHtml(primaryRecord.date)} / ${escapeHtml(getRecordTypeLabel(primaryRecord))}` : "-"}</span>
        </div>
        ${system.demoUrl ? `<a href="${escapeAttr(system.demoUrl)}" class="btn btn-ghost" target="_blank">进入 Demo</a>` : ""}
      </div>
    </article>
  `;
}

function renderDetail(system, activeRecord) {
  const primaryRecord = system.featuredRecord || system.latestRecord;

  return `
    <div class="detail-header">
      <div class="detail-copy">
        <div class="system-meta">
          <span class="pill status">${escapeHtml(system.status || "未标记状态")}</span>
          ${system.tags.map(tag => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <h2>${escapeHtml(system.name)}</h2>
        <p>${escapeHtml(system.description)}</p>
      </div>
      <div class="detail-actions">
        ${system.demoUrl ? `<a class="btn btn-primary" href="${escapeAttr(system.demoUrl)}" target="_blank">打开 Demo</a>` : ""}
        ${activeRecord ? `<a class="btn btn-ghost" href="${escapeAttr(activeRecord.file)}" target="_blank">打开 Markdown</a>` : ""}
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-card">
        <p>系统目录</p>
        <strong>${escapeHtml(system.rootPath || "-")}</strong>
      </div>
      <div class="meta-card">
        <p>协作角色</p>
        <strong>${escapeHtml(system.owner || "-")}</strong>
      </div>
      <div class="meta-card">
        <p>当前阶段</p>
        <strong>${escapeHtml(system.stage || "-")}</strong>
      </div>
      <div class="meta-card">
        <p>默认说明</p>
        <strong>${primaryRecord ? `${escapeHtml(primaryRecord.date)} / ${escapeHtml(primaryRecord.title)}` : "-"}</strong>
      </div>
    </div>

    <div class="detail-body">
      <div class="records-column">
        <div class="records-header">
          <h3>变更文件列表</h3>
          <p>说明类文档优先用于看业务变化，自动同步日志保留用于追踪底层留痕。</p>
        </div>
        <div class="record-list">
          ${system.records.map(renderRecordCard).join("")}
        </div>
      </div>

      <div class="preview-column">
        ${activeRecord ? renderPreview(activeRecord, system) : ""}
      </div>
    </div>
  `;
}

function renderRecordCard(record) {
  return `
    <button
      class="record-card ${state.activeRecordId === record.recordId ? "active" : ""}"
      type="button"
      data-record-card="${escapeAttr(record.recordId)}"
    >
      <span class="record-date">${escapeHtml(record.date)} · ${escapeHtml(getRecordTypeLabel(record))}</span>
      <h4>${escapeHtml(record.title)}</h4>
      <p>${escapeHtml(record.summary)}</p>
      <span class="record-file">${escapeHtml(record.file)}</span>
    </button>
  `;
}

function renderPreview(record, system) {
  return `
    <div class="preview-header">
      <h3>Markdown 预览</h3>
      <p>下面直接展示当前选中的变更文件；如果浏览器限制本地预览，可以点击右上角直接打开文件。</p>
    </div>
    <div class="preview-card">
      <div class="preview-toolbar">
        <div>
          <strong>${escapeHtml(record.title)}</strong>
          <span>${escapeHtml(system.name)} / ${escapeHtml(record.date)} / ${escapeHtml(getRecordTypeLabel(record))}</span>
        </div>
        <div class="preview-actions">
          <a class="btn btn-ghost" href="${escapeAttr(record.file)}" target="_blank">查看原文件</a>
          ${system.demoUrl ? `<a class="btn btn-primary" href="${escapeAttr(system.demoUrl)}" target="_blank">查看 Demo</a>` : ""}
        </div>
      </div>
      <div class="preview-note">文件路径：${escapeHtml(record.file)}</div>
      <iframe class="markdown-frame" src="${escapeAttr(record.file)}" title="${escapeAttr(record.title)}"></iframe>
    </div>
  `;
}

function renderFeedItem(record) {
  return `
    <article class="feed-item">
      <div>
        <h3>${escapeHtml(record.title)}</h3>
        <p>${escapeHtml(record.summary)}</p>
        <div class="feed-meta">
          <span class="pill status">${escapeHtml(record.systemName)}</span>
          <span class="pill">${escapeHtml(getRecordTypeLabel(record))}</span>
          <span class="pill">${escapeHtml(record.date)}</span>
          <span class="pill">${escapeHtml(record.file)}</span>
        </div>
      </div>
      <div class="feed-actions">
        <button class="btn btn-ghost" type="button" data-feed-record="${escapeAttr(record.recordId)}" data-feed-system="${escapeAttr(record.systemId)}">在右侧查看</button>
        <a class="btn btn-primary" href="${escapeAttr(record.file)}" target="_blank">打开 Markdown</a>
      </div>
    </article>
  `;
}

function renderGuide(platform) {
  const guideItems = platform?.guide || [];

  return `
    <div class="guide-grid">
      <article class="guide-card">
        <h3>目录约定</h3>
        <p>每个系统建议单独一个目录，Demo 和变更文件分开存放。</p>
        <div class="code-block">systems/\n  your-system/\n    demo/\n      index.html\n    changes/\n      2026-06-04-first-change.md</div>
      </article>
      <article class="guide-card">
        <h3>接入步骤</h3>
        <ul>
          ${guideItems.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </article>
      <article class="guide-card">
        <h3>协同建议</h3>
        <ul>
          <li>Reddy 输出的前端 Demo 放在对应系统的 <code>demo</code> 目录。</li>
          <li>每次让 Codex 做功能改动后，补一份新的 <code>md</code> 说明文档。</li>
          <li>自动同步日志用于留痕，业务说明文档用于和研发对齐改动内容。</li>
          <li><a href="接入说明.md" target="_blank">打开完整接入说明</a></li>
        </ul>
      </article>
    </div>
  `;
}

function renderEmptyState() {
  return `
    <section class="panel empty-state">
      <h2>没有符合条件的系统</h2>
      <p>可以清空筛选条件，或者在 data.js 里继续补充新的系统配置。</p>
    </section>
  `;
}

function renderError(title, message) {
  document.getElementById("heroSummary").innerHTML = `<div class="loading-card">${escapeHtml(title)}</div>`;
  document.getElementById("app").innerHTML = `
    <section class="panel empty-state">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(message)}</p>
    </section>
  `;
}

function bindEvents() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", event => {
      state.keyword = event.target.value;
      refresh();
    });
  }

  document.querySelectorAll("[data-status-filter]").forEach(button => {
    button.addEventListener("click", () => {
      state.status = button.dataset.statusFilter;
      refresh();
    });
  });

  document.querySelectorAll("[data-system-card]").forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest("a")) return;
      state.activeSystemId = card.dataset.systemCard;
      const system = state.systems.find(item => item.id === state.activeSystemId);
      state.activeRecordId = system?.featuredRecord?.recordId || system?.records[0]?.recordId || "";
      refresh();
    });
  });

  document.querySelectorAll("[data-record-card]").forEach(button => {
    button.addEventListener("click", () => {
      state.activeRecordId = button.dataset.recordCard;
      refresh();
    });
  });

  document.querySelectorAll("[data-feed-record]").forEach(button => {
    button.addEventListener("click", () => {
      state.activeSystemId = button.dataset.feedSystem;
      state.activeRecordId = button.dataset.feedRecord;
      refresh();
      document.getElementById("systemsPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function refresh() {
  hydrateSystems(window.PLATFORM_DATA);
  syncSelection();
  render(window.PLATFORM_DATA.platform || {});
  bindEvents();
}

function setupGeneratedRecordsPolling() {
  if (window.__generatedRecordsPollingStarted) return;
  window.__generatedRecordsPollingStarted = true;

  window.setInterval(() => {
    const script = document.createElement("script");
    script.src = `generated-records.js?ts=${Date.now()}`;
    script.async = true;
    script.onload = () => {
      const generatedBundle = getGeneratedRecordsBundle();
      if (generatedBundle.generatedAt && generatedBundle.generatedAt !== state.recordsVersion) {
        refresh();
      }
      script.remove();
    };
    script.onerror = () => {
      script.remove();
    };
    document.body.appendChild(script);
  }, 10000);
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

init();
