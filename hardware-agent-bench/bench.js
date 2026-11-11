'use strict';

const { levels, groups, stages, sources, platforms, handoffAudit, handoffLabels } = bench;
const matrix = document.querySelector('#compare');
const legend = document.querySelector('#legend');
const filter = document.querySelector('#filter');
const stageGroup = document.querySelector('#stage-group');
const stageView = document.querySelector('#stage-view');
const accessView = document.querySelector('#access-view');
const dialog = document.querySelector('#details');
const detailBody = document.querySelector('#detail-body');
const routeControls = document.querySelector('.route-controls');
const directLink = new URLSearchParams(location.search);
const handoffLegend = document.querySelector('#handoff-legend');
let view = 'stage';
let highlight = directLink.get('focus') === 'viable' ? 'viable' : 'none';

const filters = {
  all: () => true,
  mcp: platform => ['本地', '托管', '托管 · 免密钥', '托管 / 本地', '本地 · 实验性'].includes(platform.mcp),
  approval: platform => ['审批开放', '合作伙伴'].includes(platform.api),
  self: platform => ['扩展 API', 'IPC API · CLI', '自助密钥', '独立 REST', '本地 Python', '本地 CLI', 'CLI', 'REST', 'OAuth REST'].includes(platform.api)
};

function visiblePlatforms() {
  return platforms.filter(filters[filter.value]);
}

function platformHeading(platform) {
  const [source, url] = sources[platform.refs[0]];
  return `<th scope="row"><button class="platform" type="button" data-platform="${platform.id}">
    <span class="platform-mark ${platform.color}" aria-hidden="true"></span>
    <span><span class="platform-name">${platform.name}</span><span class="platform-scope">${platform.scope}</span></span>
  </button><a class="platform-source" href="${url}" title="${source}" aria-label="${source}" target="_blank" rel="noopener noreferrer">官方资料 ↗</a></th>`;
}

function stageCell(platform, stage) {
  const [level, action, channel] = platform.cells[stage.id] ?? ['na', '范围外', ''];
  const audit = handoffAudit[`${platform.id}/${stage.id}`];
  const focused = highlight === 'viable';
  const body = level === 'na'
    ? '<span aria-hidden="true">—</span>'
    : `<strong><span class="dot" aria-hidden="true"></span>${action}</strong><small>${channel}</small>`;
  const focusClass = focused ? (audit ? ' route-highlight' : ' route-muted') : '';
  const auditLabel = focused && audit ? '，' + audit.flags.map(flag => handoffLabels[flag]).join('，') : '';
  return `<td><button type="button" class="cell ${level}${focusClass}" data-platform="${platform.id}" data-stage="${stage.id}"
    aria-label="${platform.name}，${stage.name}，${levels[level].label}${level === 'na' ? '' : '，' + action}${auditLabel}">${body}
    ${focused && audit ? handoffFlags(audit.flags) : ''}</button></td>`;
}

function handoffFlags(flags) {
  return `<span class="handoff-flags">${flags.map(flag =>
    `<span class="handoff-flag ${flag}">${handoffLabels[flag]}</span>`).join('')}</span>`;
}

function accessCells(platform) {
  const mcpLevel = platform.mcp === '未找到' ? 'unknown' : /待验|实验性/.test(platform.mcp) ? 'partial' : 'core';
  return `<td><span class="gate ${mcpLevel}">${platform.mcp}</span></td>
    <td><span class="gate partial">${platform.api}</span></td>
    <td>${platform.access}</td><td>${platform.test}</td><td>${platform.human}</td>`;
}

function stageHeading(stage) {
  const number = String(stages.indexOf(stage) + 1).padStart(2, '0');
  return `<th scope="col"><button type="button" data-stage="${stage.id}"><span class="stage-number">${number}</span>${stage.name}</button></th>`;
}

function render() {
  const stageMode = view === 'stage';
  const visible = visiblePlatforms();
  const columns = stageGroup.value === 'all' ? stages : stages.filter(stage => stage.group === stageGroup.value);
  matrix.classList.toggle('access-table', !stageMode);
  matrix.style.setProperty('--columns', columns.length);
  matrix.caption.textContent = stageMode ? '硬件平台分阶段接口覆盖' : '硬件平台接入条件';
  stageView.setAttribute('aria-pressed', stageMode);
  accessView.setAttribute('aria-pressed', !stageMode);
  routeControls.hidden = !stageMode;
  handoffLegend.hidden = !stageMode || highlight !== 'viable';
  stageGroup.hidden = !stageMode;
  routeControls.querySelectorAll('[data-highlight]').forEach(button =>
    button.setAttribute('aria-pressed', button.dataset.highlight === highlight));
  legend.innerHTML = stageMode
    ? Object.entries(levels).map(([id, { label, description }]) =>
        `<span class="legend-item ${id}" title="${description}"><span class="dot" aria-hidden="true"></span>${label}</span>`).join('')
    : '点平台名称查看接入说明与来源';
  document.querySelector('.mobile-note').firstChild.textContent = stageMode ? '左右滑动查看各阶段，或选择阶段组 ' : '左右滑动查看接入条件 ';
  const groupHeaders = groups.map(([id, label]) => {
    const count = columns.filter(stage => stage.group === id).length;
    return count ? `<th colspan="${count}">${label}</th>` : '';
  }).join('');
  const headings = stageMode
    ? columns.map(stageHeading)
    : ['官方 MCP', 'API 类型', '接入与文档', '测试环境', '人工确认 / 费用'].map(label => `<th scope="col">${label}</th>`);
  matrix.tHead.innerHTML = stageMode
    ? `<tr class="group-head"><th scope="col" rowspan="2" class="provider-col">平台 / 产品</th>${groupHeaders}</tr><tr>${headings.join('')}</tr>`
    : `<tr><th scope="col" class="provider-col">平台 / 产品</th>${headings.join('')}</tr>`;
  const platformRows = visible.map(platform =>
    `<tr>${platformHeading(platform)}${stageMode ? columns.map(stage => stageCell(platform, stage)).join('') : accessCells(platform)}</tr>`).join('');
  matrix.tBodies[0].innerHTML = platformRows;
  document.querySelector('#row-count').textContent = `显示 ${visible.length} / ${platforms.length} 个产品入口`;
  document.querySelector('.matrix-footer span:last-child').textContent =
    stageMode ? `显示 ${columns.length} / ${stages.length} 个开发阶段` : '业务调用条件以平台授权为准';
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
  if (stage) {
    query.set('stage', stage.id);
    query.set('stages', '17');
  }
  query.set('focus', highlight);
  return `<a class="detail-link" href="?${query}#matrix">此项链接</a>`;
}

function renderSourceIndex() {
  document.querySelector('#source-groups').innerHTML = `
    <details><summary>评测方法</summary>
      ${sourceList(['nasaDesign', 'nasaRealization', 'deepdive', 'deepdiveMethod'])}
    </details>
    ${platforms.map(platform => {
      const auditRefs = Object.entries(platform.cells).flatMap(([stage]) => handoffAudit[`${platform.id}/${stage}`]?.refs ?? []);
      const refs = new Set([...platform.refs, ...Object.values(platform.cells).flatMap(cell => cell[4]), ...platform.orderRefs ?? [], ...auditRefs]);
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
  const audit = handoffAudit[`${platform.id}/${stage.id}`];
  const [level, action, channel, summary, refs, note] = platform.cells[stage.id] ?? [
    'na', '范围外', '—', `本行评估 ${platform.scope}。该阶段超出此产品在本评测中的范围。`, platform.refs
  ];
  showDetail(`${platform.name} / ${stage.name}`, `<h2 id="detail-title">${action}</h2>
    ${detailLink(platform, stage)}
    <p><span class="detail-status ${level}"><span class="dot" aria-hidden="true"></span>${levels[level].label}</span></p>
    <p>${summary}</p>
    ${note ? `<p class="detail-note">${note}</p>` : ''}
    ${audit ? `<section class="handoff-audit" aria-label="可行路线交接复核">
      <h3>可行路线 · 交接复核</h3>${handoffFlags(audit.flags)}
      <dl class="detail-list">
        <dt>本步交付</dt><dd>${audit.output}</dd>
        <dt>交给下一步</dt><dd>${audit.next}</dd>
        <dt>接入条件</dt><dd>${audit.check}</dd>
      </dl><h3>交接依据</h3>${sourceList(audit.refs)}</section>` : ''}
    <dl class="detail-list">
      <dt>阶段任务</dt><dd>${stage.task}</dd>
      <dt>阶段交付物</dt><dd>${stage.handoff}</dd>
      <dt>已知入口</dt><dd>${channel}</dd>
      <dt>判定口径</dt><dd>${levels[level].description}</dd>
    </dl>${stage.id === 'order' && platform.order ? `<h3>下单动作核对</h3>
      <dl class="detail-list">${bench.orderChecks.map((check, index) =>
        `<dt>${check}</dt><dd>${platform.order[index]} <span class="action-source">${externalLink('依据', sources[platform.orderRefs[index]][1])}</span></dd>`).join('')}</dl>` : ''}
    <h3>接口证据来源</h3>${sourceList(refs)}`);
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
    <p>${stage.task}</p><p><strong>阶段交付物</strong> · ${stage.handoff}</p><ul class="stage-platforms">${rows.join('')}</ul>`);
}

function openFromButton(event) {
  const trigger = event.target.closest('button[data-platform], button[data-stage]');
  if (!trigger) return;
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
stageGroup.addEventListener('change', () => {
  matrix.parentElement.scrollLeft = 0;
  render();
});
routeControls.addEventListener('click', event => {
  const button = event.target.closest('[data-highlight]');
  if (!button) return;
  highlight = button.dataset.highlight;
  render();
});
matrix.addEventListener('click', openFromButton);
detailBody.addEventListener('click', openFromButton);
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && event.clientX < bounds.left) dialog.close();
});
document.querySelector('#platform-count').textContent = String(platforms.length).padStart(2, '0');
document.querySelector('#stage-count').textContent = String(stages.length).padStart(2, '0');
groups.forEach(([id, label]) => stageGroup.add(new Option(label, id)));
render();
renderSourceIndex();
const directPlatform = platforms.find(platform => platform.id === directLink.get('platform'));
const oldStage = directLink.get('stage');
const relocated = {
  design: directPlatform?.id === 'hi3d' ? 'concept' : 'schematic',
  verify: ['easyeda', 'jlc', 'hi3d', 'huaqiu-kicad', 'huaqiu', 'slant'].includes(directPlatform?.id) ? 'preflight' : 'verify'
};
const directStage = stages.find(stage => stage.id === (directLink.get('stages') === '17' ? oldStage : relocated[oldStage] ?? oldStage));
if (directPlatform && directStage) showCell(directPlatform, directStage);
else if (directPlatform) showPlatform(directPlatform);
else if (directStage) showStage(directStage);
