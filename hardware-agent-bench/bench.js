'use strict';

const { levels, stages, sources, platforms } = bench;
const matrix = document.querySelector('#compare');
const legend = document.querySelector('#legend');
const filter = document.querySelector('#filter');
const stageView = document.querySelector('#stage-view');
const accessView = document.querySelector('#access-view');
const dialog = document.querySelector('#details');
const detailBody = document.querySelector('#detail-body');
const routeContent = document.querySelector('#route-content').content;
const huaqiuContent = document.querySelector('#huaqiu-route').content;
const mixedContent = document.querySelector('#mixed-route').content;
const routeSteps = [routeContent, huaqiuContent, mixedContent].flatMap(content => [...content.querySelectorAll('[data-step]')]);
const routeControls = document.querySelector('.route-controls');
const routeNames = { jlc: '嘉立创', hq: '华秋', mixed: '混合', shared: '三条路线共用' };
const directLink = new URLSearchParams(location.search);
let view = 'stage';
let highlight = ['jlc', 'hq', 'mixed', 'all', 'none'].find(value => value === directLink.get('focus')) ?? 'mixed';

const filters = {
  all: () => true,
  mcp: platform => ['本地', '托管', '托管 · 免密钥'].includes(platform.mcp),
  approval: platform => ['审批开放', '合作伙伴'].includes(platform.api),
  self: platform => ['扩展 API', 'IPC API · CLI', '自助密钥', '独立 REST'].includes(platform.api)
};

function visiblePlatforms() {
  return platforms.filter(filters[filter.value]);
}

function platformHeading(platform) {
  return `<th scope="row"><button class="platform" type="button" data-platform="${platform.id}">
    <span class="platform-mark ${platform.color}" aria-hidden="true"></span>
    <span><span class="platform-name">${platform.name}</span><span class="platform-scope">${platform.scope}</span></span>
  </button></th>`;
}

function stageCell(platform, stage) {
  const [level, action, channel] = platform.cells[stage.id] ?? ['na', '范围外', ''];
  const step = routeStep(platform.id, stage.id);
  const body = step && highlightVisible(step)
    ? routeLabel(step)
    : level === 'na'
    ? '<span aria-hidden="true">—</span>'
    : `<strong><span class="dot" aria-hidden="true"></span>${action}</strong><small>${channel}</small>`;
  const featured = step && highlightVisible(step);
  const label = featured ? `${routeTag(step)}，${step.dataset.tools}，${step.dataset.mode}` : `${levels[level].label}${level === 'na' ? '' : '，' + action}`;
  return `<td><button type="button" class="cell ${featured ? 'route-highlight ' + displayRoute(step) : level + (highlight === 'none' ? '' : ' route-muted')}" data-platform="${platform.id}" data-stage="${stage.id}"
    aria-label="${platform.name}，${stage.name}，${label}">${body}</button></td>`;
}

function accessCells(platform) {
  const mcpLevel = platform.mcp === '未找到' ? 'unknown' : platform.mcp.includes('待验') ? 'partial' : 'core';
  return `<td><span class="gate ${mcpLevel}">${platform.mcp}</span></td>
    <td><span class="gate partial">${platform.api}</span></td>
    <td>${platform.access}</td><td>${platform.test}</td><td>${platform.human}</td>`;
}

function routeStep(platform, stage) {
  return routeSteps.find(step => step.dataset.platform === platform && step.dataset.step === stage);
}

function routeKind(step) {
  if (step.dataset.platform === 'shared') return 'shared';
  const root = step.getRootNode();
  if (root === huaqiuContent) return 'hq';
  return root === mixedContent ? 'mixed' : 'jlc';
}

function displayRoute(step) {
  const kind = routeKind(step);
  return highlight === 'mixed' && kind === 'jlc' ? 'mixed' : kind;
}

function highlightVisible(step) {
  return highlight === 'all' || routeKind(step) === 'shared' || displayRoute(step) === highlight;
}

function routeTag(step) {
  const kind = displayRoute(step);
  return highlight === 'all' && kind === 'jlc' ? '嘉立创 / 混合' : routeNames[kind];
}

function routeLabel(step) {
  const transfer = highlight === 'mixed' && step.dataset.transfer
    ? `<small class="route-transfer">${step.dataset.transfer}</small>`
    : '';
  return `<span class="route-tag">${routeTag(step)}</span>
    <strong>${step.dataset.tools}</strong><small>${step.dataset.mode}</small>${transfer}`;
}

function stageHeading(stage, index) {
  const step = highlight === 'none' ? null : routeStep('shared', stage.id);
  return `<th scope="col"><button type="button" data-stage="${stage.id}"><span class="stage-number">${String(index + 1).padStart(2, '0')}</span>${stage.name}</button>
    ${step ? `<button type="button" class="route-highlight shared" data-route="${stage.id}" aria-label="${stage.name}，三条路线共用，${step.dataset.tools}，${step.dataset.mode}">${routeLabel(step)}</button>` : ''}</th>`;
}

function render() {
  const stageMode = view === 'stage';
  const visible = visiblePlatforms();
  matrix.classList.toggle('access-table', !stageMode);
  matrix.caption.textContent = stageMode ? '硬件平台分阶段接口覆盖' : '硬件平台接入条件';
  stageView.setAttribute('aria-pressed', stageMode);
  accessView.setAttribute('aria-pressed', !stageMode);
  routeControls.hidden = !stageMode;
  routeControls.querySelectorAll('[data-highlight]').forEach(button =>
    button.setAttribute('aria-pressed', button.dataset.highlight === highlight));
  legend.innerHTML = stageMode
    ? Object.entries(levels).map(([id, { label, description }]) =>
        `<span class="legend-item ${id}" title="${description}"><span class="dot" aria-hidden="true"></span>${label}</span>`).join('')
    : '点平台名称查看接入说明与来源';
  document.querySelector('.mobile-note').firstChild.textContent = stageMode ? '左右滑动查看各阶段 ' : '左右滑动查看接入条件 ';
  const headings = stageMode
    ? stages.map(stageHeading)
    : ['官方 MCP', 'API 类型', '接入与文档', '测试环境', '人工确认 / 费用'].map(label => `<th scope="col">${label}</th>`);
  matrix.tHead.innerHTML = `<tr><th scope="col">平台 / 产品</th>${headings.join('')}</tr>`;
  const platformRows = visible.map(platform =>
    `<tr>${platformHeading(platform)}${stageMode ? stages.map(stage => stageCell(platform, stage)).join('') : accessCells(platform)}</tr>`).join('');
  matrix.tBodies[0].innerHTML = platformRows;
  document.querySelector('#row-count').textContent = `显示 ${visible.length} / ${platforms.length} 个产品入口`;
  document.querySelector('.matrix-footer span:last-child').textContent =
    stageMode ? '覆盖等级按单个产品与阶段判定' : '业务调用条件以平台授权为准';
}

function externalLink(name, url) {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${name} <span aria-hidden="true">↗</span></a>`;
}

function sourceList(refs) {
  return `<ul class="detail-sources">${refs.map(id => `<li>${externalLink(...sources[id])}</li>`).join('')}</ul>`;
}

function detailLink(platform, stage) {
  const query = new URLSearchParams();
  if (platform) query.set('platform', platform.id);
  if (stage) query.set('stage', stage.id);
  query.set('focus', highlight);
  return `<a class="detail-link" href="?${query}#matrix">此项链接</a>`;
}

function renderSourceIndex() {
  document.querySelector('#source-groups').innerHTML = `
    <details><summary>评测方法</summary>
      ${sourceList(['deepdive', 'deepdiveMethod'])}
    </details>
    ${platforms.map(platform => {
      const refs = new Set([...platform.refs, ...Object.values(platform.cells).flatMap(cell => cell[4]), ...platform.orderRefs ?? []]);
      return `<details><summary>${platform.name}</summary>${sourceList([...refs])}</details>`;
    }).join('')}`;
}

function showDetail(context, body) {
  document.querySelector('#detail-context').textContent = context;
  detailBody.innerHTML = body;
  if (dialog.open) dialog.querySelector('.close').focus();
  else dialog.showModal();
  dialog.scrollTop = 0;
}

function showPlatform(platform) {
  showDetail(platform.scope, `<h2 id="detail-title">${platform.name}</h2>
    ${detailLink(platform)}
    <dl class="detail-list">
      <dt>官方 MCP</dt><dd>${platform.mcp}</dd>
      <dt>API 类型</dt><dd>${platform.api}</dd>
      <dt>接入与文档</dt><dd>${platform.access}</dd>
      <dt>测试环境</dt><dd>${platform.test}</dd>
      <dt>人工确认</dt><dd>${platform.human}</dd>
    </dl><h3>证据来源</h3>${sourceList(platform.refs)}`);
}

function showCell(platform, stage) {
  const step = routeStep(platform.id, stage.id);
  const [level, action, channel, summary, refs, note] = platform.cells[stage.id] ?? [
    'na', '范围外', '—', `本行评估 ${platform.scope}。该阶段超出此产品在本评测中的范围。`, platform.refs
  ];
  showDetail(`${platform.name} / ${stage.name}`, `<h2 id="detail-title">${action}</h2>
    ${detailLink(platform, stage)}
    ${step && highlight !== 'none' ? `<section class="route-detail ${displayRoute(step)}">
      <h3>${routeTag(step)}路线 · ${stage.name}</h3>
      <p><strong>${step.dataset.tools}</strong> · ${step.dataset.mode}</p>
      ${step.innerHTML}${handoff(step)}</section>` : ''}
    <p><span class="detail-status ${level}"><span class="dot" aria-hidden="true"></span>${levels[level].label}</span></p>
    <p>${summary}</p>
    ${note ? `<p class="detail-note">${note}</p>` : ''}
    <dl class="detail-list">
      <dt>阶段任务</dt><dd>${stage.task}</dd>
      <dt>已知入口</dt><dd>${channel}</dd>
      <dt>判定口径</dt><dd>${levels[level].description}</dd>
    </dl>${stage.id === 'order' && platform.order ? `<h3>下单动作核对</h3>
      <dl class="detail-list">${bench.orderChecks.map((check, index) =>
        `<dt>${check}</dt><dd>${platform.order[index]} <span class="action-source">${externalLink('依据', sources[platform.orderRefs[index]][1])}</span></dd>`).join('')}</dl>` : ''}
    <h3>证据来源</h3>${sourceList(refs)}`);
}

function showStage(stage) {
  const number = stages.indexOf(stage) + 1;
  const rows = visiblePlatforms().map(platform => {
    const [level, action] = platform.cells[stage.id] ?? ['na', '范围外'];
    return `<li><button type="button" data-stage="${stage.id}" data-platform="${platform.id}">
      <strong>${platform.name}</strong><span>${action} · ${levels[level].label}</span>
    </button></li>`;
  });
  showDetail(`硬件开发 / 第 ${number} 站`, `<h2 id="detail-title">${stage.name}</h2>
    ${detailLink(null, stage)}
    <p>${stage.task}</p><ul class="stage-platforms">${rows.join('')}</ul>`);
}

function showRoute(id) {
  if (id === 'overview') {
    const notes = [...routeContent.querySelectorAll('.route-note')].map(note => note.outerHTML).join('');
    showDetail('开发路线', `<h2 id="detail-title">ESP32 温湿度记录器</h2>
      ${routeContent.querySelector('.route-intro').outerHTML}${notes}`);
    return;
  }
  const stage = stages.find(item => item.id === id);
  if (!stage) return;
  const step = routeStep('shared', id);
  if (!step) {
    const original = routeSteps.find(item => item.dataset.step === id);
    return showCell(platforms.find(item => item.id === original.dataset.platform), stage);
  }
  showDetail('三条路线共用 / ESP32 温湿度记录器', `<h2 id="detail-title">${stage.name}</h2>
    <a class="detail-link" href="?route=${stage.id}&amp;focus=${highlight}#route">此项链接</a>
    <p><strong>${step.dataset.tools}</strong> · ${step.dataset.mode}</p>
    ${step.innerHTML}${handoff(step)}`);
}

function handoff(step) {
  const mixed = highlight === 'mixed' || highlight === 'all' || routeKind(step) === 'mixed';
  return mixed && step.dataset.handoff
    ? `<p class="detail-note"><strong>混合路线交接</strong> · ${step.dataset.handoff}</p>`
    : '';
}

function openFromButton(event) {
  const trigger = event.target.closest('button[data-platform], button[data-stage], button[data-route]');
  if (!trigger) return;
  if (trigger.dataset.route) return showRoute(trigger.dataset.route);
  const platform = platforms.find(item => item.id === trigger.dataset.platform);
  const stage = stages.find(item => item.id === trigger.dataset.stage);
  if (platform && stage) showCell(platform, stage);
  else if (platform) showPlatform(platform);
  else if (stage) showStage(stage);
}

stageView.addEventListener('click', () => {
  view = 'stage';
  matrix.parentElement.scrollLeft = 0;
  render();
});
accessView.addEventListener('click', () => {
  view = 'access';
  matrix.parentElement.scrollLeft = 0;
  render();
});
filter.addEventListener('change', render);
routeControls.addEventListener('click', event => {
  const button = event.target.closest('[data-highlight]');
  if (!button) return;
  highlight = button.dataset.highlight;
  filter.value = 'all';
  render();
});
document.querySelectorAll('a[href="#route"]').forEach(link => link.addEventListener('click', () => {
  if (view === 'access') stageView.click();
}));
matrix.addEventListener('click', openFromButton);
routeControls.addEventListener('click', openFromButton);
detailBody.addEventListener('click', openFromButton);
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && event.clientX < bounds.left) dialog.close();
});
document.querySelector('#platform-count').textContent = String(platforms.length).padStart(2, '0');
render();
renderSourceIndex();
const directPlatform = platforms.find(platform => platform.id === directLink.get('platform'));
const directStage = stages.find(stage => stage.id === directLink.get('stage'));
if (directLink.has('route')) showRoute(directLink.get('route'));
else if (directPlatform && directStage) showCell(directPlatform, directStage);
else if (directPlatform) showPlatform(directPlatform);
else if (directStage) showStage(directStage);
