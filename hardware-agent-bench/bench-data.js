'use strict';

const bench = {
  date: '2026-11-11',
  levels: {
    core: { label: '主要动作可调', description: '指定子流程的主要动作有机器接口，输出可供后续步骤使用。' },
    partial: { label: '部分动作可调', description: '已有部分读写接口，关键动作、状态或交接仍缺证据。' },
    ui: { label: '人工可做', description: '有网页、桌面工具或人工服务，未找到该动作的可调用入口。' },
    unknown: { label: '待核实', description: '业务相关，但公开证据不足以判定接口覆盖。' },
    na: { label: '范围外', description: '超出本行产品的评测范围。' }
  },
  groups: [
    ['definition', '产品定义'],
    ['engineering', '设计与工程'],
    ['prototype', '打样与验证'],
    ['production', '试产与上市']
  ],
  stages: [
    { id: 'intent', group: 'definition', name: '需求规格', task: '确定用户场景、功能、预算、约束和可测的验收指标。', handoff: '需求编号、规格表与验收用例。' },
    { id: 'concept', group: 'definition', name: '概念外观', task: '探索外观、使用方式与尺寸包络，确认接口和不可变约束。', handoff: '参考图、选定外观和尺寸包络。网格可供结构设计参考。' },
    { id: 'schematic', group: 'engineering', name: '电路原理图', task: '选择系统架构、电源、信号与接口，绘制原理图。', handoff: '原理图源文件、网表和接口约束。' },
    { id: 'layout', group: 'engineering', name: 'PCB 布局布线', task: '按叠层、板框、封装与走线约束布局布线，保留测试点。', handoff: 'PCB 源工程、板框和 3D 板卡模型。' },
    { id: 'mechanical', group: 'engineering', name: '机械结构', task: '设计外壳、固定件与接口开孔，校核公差、散热和装配空间。', handoff: '可编辑 CAD、制造 STEP 和关键尺寸图。' },
    { id: 'firmware', group: 'engineering', name: '固件开发', task: '实现驱动、通信与业务逻辑，构建可重复的固件版本。', handoff: '源码、编译配置、固件二进制与版本号。' },
    { id: 'parts', group: 'engineering', name: '选件与 BOM', task: '核对厂商料号、库存、价格、封装和替代件。', handoff: '含准确料号、用量、封装和已批准替代件的 BOM。' },
    { id: 'simulation', group: 'engineering', name: '仿真与回归', task: '在虚拟电路或目标模型上运行用例，核对预期信号和串口输出。', handoff: '仿真配置、用例和回归日志。实板验收在后续执行。' },
    { id: 'preflight', group: 'engineering', name: '投产前审查', task: '做 ERC、DRC、DFM 及贴片复核，确认制板和装配资料一致。', handoff: '审查结果、Gerber、钻孔、BOM、贴片坐标和适用的结构文件。' },
    { id: 'order', group: 'prototype', name: '报价与下单', task: '提交制造包，计价、建单、确认付款并核对取消条件。', handoff: '报价、确认记录、供应商订单号和对应版本。' },
    { id: 'fabrication', group: 'prototype', name: '制板与加工', task: '跟踪裸板、打印件或机加工件的工艺、生产与到货。', handoff: '来料、供应商批次和加工或运输状态。' },
    { id: 'assembly', group: 'prototype', name: '贴片与装配', task: '核对贴片物料、位置、极性和工艺，完成板卡或整机装配。', handoff: '带样机编号的实物与装配记录。' },
    { id: 'bringup', group: 'prototype', name: '上电与烧录', task: '检查电源和短路，首次上电，烧录并观察串口及关键总线。', handoff: '带样机编号的烧录版本、启动日志与波形。' },
    { id: 'verify', group: 'prototype', name: '整机验证', task: '按需求执行功能、性能与可靠性用例，并记录缺陷。', handoff: '带实测结果、环境、版本、批次和签字的测试记录。' },
    { id: 'scale', group: 'production', name: '小批量试产', task: '冻结工程包，创建试产工单，按批次追踪投料、良率与返修。', handoff: '工单、批次追溯、良率和返修记录。' },
    { id: 'compliance', group: 'production', name: '送检与认证', task: '按目标市场与最终配置确认适用项目，安排样品和检测。', handoff: '送检配置、实验室报告与适用的认证资料。' },
    { id: 'release', group: 'production', name: '量产放行', task: '核对试产、问题关闭和适用报告，批准生产基线并留存变更记录。', handoff: '签字放行记录、生产版本和可追溯的发布包。' }
  ],
  handoffLabels: {
    direct: '格式可直交',
    mapping: '需转换或关联',
    manual: '人工确认',
    gap: '接口缺口'
  },
  handoffAudit: {
    'github/intent': {
      flags: ['mapping', 'manual'],
      output: '需求 Issue、规格版本、验收项编号及阈值。',
      next: 'Hi3D 接收外观参考图和尺寸包络，电路与结构设计同时读取冻结规格。',
      check: 'Issues API 能交付标题、正文和编号。平台需把自由文本整理成结构化规格，并关联验收项。负责人确认约束、预算和放行阈值后再发给设计工具。',
      refs: ['githubIssues', 'hiApi', 'nasaDesign']
    },
    'hi3d/concept': {
      flags: ['mapping', 'manual'],
      output: '选定参考图、任务 ID、网格下载链接和预览图。',
      next: 'FreeCAD 读取网格作为参考，并同时接收 PCB STEP 和尺寸约束。',
      check: 'MCP 或 REST 可返回网格资产。工程人员要选稿，并按公差、板框和接口位置重建参数化 CAD。记录输入图和下载结果版本。',
      refs: ['hiMcp', 'hiQuery', 'freecad']
    },
    'easyeda/schematic': {
      flags: ['direct', 'manual'],
      output: '同一 EDA 工程的原理图、网络、位号与封装关联。',
      next: '用嘉立创 EDA「更新/转换原理图到 PCB」，将引脚定义交给固件。',
      check: '同工程可以直接更新 PCB。工程师确认供电、引脚和符号到封装的映射，审查 ECO 差异后再应用。',
      refs: ['edaUpdate', 'eda']
    },
    'easyeda/layout': {
      flags: ['direct', 'manual'],
      output: 'PCB 源文件、板框、装配基准和板卡 STEP。',
      next: 'FreeCAD 导入 STEP；PCB 工程与装配坐标保留给投产前审查。',
      check: 'STEP 格式可接收。检查板框原点、单位、孔位及连接器高度；未绑定 STEP 的元件可能缺少三维模型，需补尺寸包络。',
      refs: ['edaStep', 'freecad']
    },
    'freecad/mechanical': {
      flags: ['direct', 'manual'],
      output: '可编辑 FCStd、每个独立零件的 STEP、关键尺寸与配合公差。',
      next: 'STEP 交嘉立创 3D 打印，关键尺寸随装配说明和验收表交给装测。',
      check: '打印端接受 STEP。人确认材料、壁厚、工艺和公差，并按零件分别导出；板框或接口改版时重新核对外壳。',
      refs: ['freecad', 'jlcPrint']
    },
    'esp-idf/firmware': {
      flags: ['direct', 'mapping'],
      output: '固定芯片目标和版本的 flasher_args.json、引用的全部镜像及 ELF。',
      next: '同一套构建产物交 Wokwi 仿真，也保留给后续实板烧录。',
      check: 'Wokwi 支持 ESP-IDF 原始烧录清单，但要有 wokwi.toml 与目标芯片匹配的 diagram.json。CLI 可生成初始配置，传感器连线和用例仍需项目配置。',
      refs: ['idfMcp', 'wokwiIdf', 'wokwiCli']
    },
    'lcsc/parts': {
      flags: ['mapping', 'manual', 'gap'],
      output: '带厂商料号、封装、位号、用量和备选件的配单结果。',
      next: '映射为嘉立创 SMT 的物料编号和装配 BOM，交给 DFM 与审单。',
      check: '商城配单能查库存和价格。未找到公开接口证明商城库存、编号与实际可贴料一键同步。人在 SMT 侧核对可贴库存、型号、封装和替代料，保留位号对应表。',
      refs: ['lcscBom', 'edaParts', 'jlcSmtFlow']
    },
    'wokwi/simulation': {
      flags: ['mapping', 'manual'],
      output: '仿真配置、用例、固件版本及串口日志。',
      next: '回归结果并入投产前审查；同一固件版本进入台架。',
      check: 'CLI 和实验 MCP 可执行仿真。平台需把结果关联到需求编号和固件版本。由人确认传感器模型覆盖范围，电源、信号完整性和实际公差安排实测。',
      refs: ['wokwiCi', 'wokwiMcp', 'nasaRealization']
    },
    'easyeda/preflight': {
      flags: ['mapping', 'manual', 'gap'],
      output: 'ERC/DRC/DFM 记录与同版 Gerber、钻孔、BOM、坐标；外壳文件单独打包。',
      next: 'PCB、SMT、3D 打印分别按各自文件要求提交，保留共同修订号。',
      check: '自动导出后核对位号、数量、板面、旋转、极性和工艺边。官方有客户端 SMT 检查，但公开下单 API 未核实能返回同等的 SMT 审查结果。材料或料号变化后重新审查。',
      refs: ['edaDfm', 'jlcSmtDfm', 'jlcBomFormat', 'jlc', 'deepdiveJlc']
    },
    'jlc/order': {
      flags: ['mapping', 'manual', 'gap'],
      output: '经确认的报价、制板/贴片/外壳订单号和修订号。',
      next: '按业务线查询进度，在项目档案把同一修订号下的订单归并。',
      check: 'PCB API 需申请，公开资料列有计价和建单。SMT 创建走网页，文件输入按已授权业务文档处理。付款、审单变更和贴片确认由人承担；国内 PCB 公开证据不足以确认完整校验与撤单闭环。',
      refs: ['jlc', 'jlcGuide', 'jlcSmtFlow', 'jlcPrintFlow', 'deepdiveJlc']
    },
    'jlc/fabrication': {
      flags: ['mapping', 'manual'],
      output: '生产和物流状态、供应商订单号、实际到货与批次记录。',
      next: '按版本把实物与来料清单交给贴片或整机装配，确认缺件和异常。',
      check: '获批 API 可查相关订单状态；状态回传后仍需现场收料、识别实物批次及核对版次，外壳与板卡分别查单。',
      refs: ['jlc', 'jlcPrintFlow', 'nasaRealization']
    },
    'jlc/assembly': {
      flags: ['mapping', 'manual', 'gap'],
      output: '已贴装板卡、已确认的贴片预览、同版外壳和样机编号。',
      next: '装配人员核对连接器、固定件和传感器通风，再向首次上电交付实物与装配记录。',
      check: 'SMT API 可查状态，贴片方向和替代料需在页面复核。公开资料未确认有接口把贴片和外壳订单合并为带序列号的整机装配记录，编号和关联由项目方维护。',
      refs: ['jlc', 'jlcSmtFlow', 'jlcBomFormat', 'nasaRealization']
    },
    'esp-idf/bringup': {
      flags: ['direct', 'manual'],
      output: '样机编号、已烧录版本、串口启动日志和电源/总线检查记录。',
      next: '带相同编号及固件版本的实物和日志交给整机验证。',
      check: 'ESP-IDF CLI 或支持该工具的 MCP 可烧录并监视串口。工程师先核对目标端口、电压、限流和接线，确认首次上电条件。',
      refs: ['idfMcp', 'idfFlash', 'nasaIntegration']
    },
    'esp-idf/verify': {
      flags: ['mapping', 'manual'],
      output: '按样机编号和固件版本记录的用例结果、原始日志及实测数据。',
      next: '把原始证据按工单或样机编号归档，向黑湖提交汇总状态。',
      check: 'pytest-embedded 可驱动实板并断言串口结果。整机指标仍需相应仪器或夹具，测试人员判定合格/不良。研发样机还没有试产工单时，先归档结果，待工厂建立编号后再关联。',
      refs: ['idfTest', 'blacklakeReport', 'nasaRealization']
    },
    'blacklake/verify': {
      flags: ['mapping', 'manual', 'gap'],
      output: '黑湖质量状态、不良原因、工单与批次关联。',
      next: '原始数据保留在项目档案，按相同编号汇入试产质量记录。',
      check: '需有租户权限及对应工单/工序。批量报工是异步操作，需查询结果；没有公开证据确认串口日志或测试 CSV 可以原样作为质检报告写入。检验员确认判定及需二次确认的记录。',
      refs: ['blacklakeMes', 'blacklakeReport', 'idfTest']
    },
    'blacklake/scale': {
      flags: ['mapping', 'manual', 'gap'],
      output: '冻结的工程版本、试产工单、来料批次、良率与返修记录。',
      next: '将工单、批次及最终配置对应到送检样品；同时保留量产候选版本。',
      check: '已授权工厂可用 API 建工单和报工，试产前先建单。嘉立创供应商订单号到黑湖工单的映射由平台或工厂建立，未核实有现成跨厂接口。由工厂确认排产和取样。',
      refs: ['blacklakeMes', 'blacklakeReport', 'jlc', 'sgsPortfolio']
    },
    'sgs/compliance': {
      flags: ['mapping', 'manual', 'gap'],
      output: '经确认的送检配置、样品编号、实验室报告和适用的认证材料。',
      next: '按产品和工程版本将报告原件、编号及签发方交给量产放行。',
      check: '实验室与项目方确定市场、项目及样品。未核实可直接创建送检任务并取结构化报告的公共 API；平台须支持人工送检、上传原件及报告适用范围确认。',
      refs: ['sgsPortfolio', 'nasaRealization']
    },
    'github/release': {
      flags: ['mapping', 'manual', 'gap'],
      output: '签字放行记录、带标签的固件、制造包、测试及检测报告。',
      next: '冻结版本交给批量生产和后续变更控制，保留对需求、批次和报告的引用。',
      check: 'GitHub REST 可发布版本及附件。实体批次获批由质量负责人签字。平台把发布标签、文件指纹、工单/批次和审批记录关联。',
      refs: ['githubRelease', 'blacklakeMes', 'nasaRealization']
    }
  },
  orderChecks: ['能力查询', '文件校验', '报价', '下单与付款', '跟踪', '取消'],
  sources: {
    edaUpdate: ['嘉立创 EDA · 更新/转换原理图到 PCB', 'https://prodocs.easyeda.com/cn/quick-start.html'],
    edaStep: ['嘉立创 EDA · STEP 导出与器件模型', 'https://prodocs.lceda.cn/cn/faq/pcb/'],
    edaParts: ['嘉立创 EDA · 元件购买与贴片导出', 'https://prodocs.easyeda.com/cn/schematic/export-order-parts/'],
    wokwiIdf: ['Wokwi · ESP-IDF 烧录清单、镜像和板型', 'https://docs.wokwi.com/vscode/esp-idf'],
    wokwiCli: ['Wokwi · CLI 配置与运行', 'https://docs.wokwi.com/wokwi-ci/cli-usage'],
    jlcSmtDfm: ['嘉立创 · DFM 客户端 SMT 检查', 'https://www.jlc.com/portal/server_guide_41516.html'],
    jlcBomFormat: ['嘉立创 · BOM 与贴片坐标格式', 'https://www.jlc.com/portal/server_guide_48022.html'],
    jlcSmtFlow: ['嘉立创 · SMT 下单、核料与审单', 'https://www.jlc.com/portal/server_guide_19858.html'],
    jlcPrint: ['嘉立创 3D 打印 · STEP 格式与工艺要求', 'https://www.jlc.com/portal/q7i40026.html'],
    jlcPrintFlow: ['嘉立创 3D 打印 · 报价、审核与进度', 'https://www.jlc.com/portal/q7i28571.html'],
    nasaIntegration: ['NASA · 产品集成与实物交接', 'https://www.nasa.gov/reference/5-2-product-integration/'],
    nasaDesign: ['NASA · 系统工程与需求分解', 'https://www.nasa.gov/reference/2-0-fundamentals-of-systems-engineering/'],
    nasaRealization: ['NASA · 实现、集成与验证', 'https://www.nasa.gov/reference/5-0-product-realization/'],
    githubMcp: ['GitHub · 官方 MCP 服务与 Issues 工具', 'https://github.com/github/github-mcp-server'],
    githubIssues: ['GitHub · Issues REST API', 'https://docs.github.com/en/rest/issues/issues#create-an-issue'],
    githubRelease: ['GitHub · Releases 与发布附件 API', 'https://docs.github.com/en/rest/releases'],
    kicadCli: ['KiCad 10 · CLI、规则检查与导出', 'https://docs.kicad.org/10.0/en/cli/cli.html'],
    kicadIpc: ['KiCad · IPC API 版本与编辑限制', 'https://dev-docs.kicad.org/en/apis-and-binding/ipc-api/for-addon-developers/'],
    kicadSpice: ['KiCad 10 · 原理图 SPICE 仿真', 'https://docs.kicad.org/10.0/zh/eeschema/eeschema.html#simulator'],
    freecad: ['FreeCAD · 参数化设计和 STEP 支持', 'https://www.freecad.org/features'],
    freecadScript: ['FreeCAD · 官方手册与 Python 脚本', 'https://www.freecad.org/manual/a-freecad-manual.pdf'],
    idfMcp: ['乐鑫 · ESP-IDF 命令行与 MCP', 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/tools/idf-py.html#esp-idf-mcp-server'],
    idfFlash: ['乐鑫 · 构建、烧录和串口监视', 'https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/start-project.html'],
    idfTest: ['乐鑫 · pytest-embedded 测试服务', 'https://docs.espressif.com/projects/pytest-embedded/en/latest/concepts/services.html'],
    wokwiCi: ['Wokwi · CI 仿真与测试场景', 'https://docs.wokwi.com/wokwi-ci/getting-started'],
    wokwiMcp: ['Wokwi · 实验性 MCP', 'https://docs.wokwi.com/wokwi-ci/mcp-support'],
    digikeySearch: ['DigiKey · 产品搜索 V4', 'https://developer.digikey.com/products/product-information-v4/productsearch/keywordsearch'],
    digikeyProducts: ['DigiKey · 报价、订单与状态 API', 'https://developer.digikey.com/products'],
    digikeyFaq: ['DigiKey · 实时库存、OAuth 与沙箱', 'https://developer.digikey.com/faq'],
    lcscBom: ['立创商城 · 新版 BOM 智能云表', 'https://www.szlcsc.com/news/16581.html'],
    saleaeApi: ['Saleae · Logic 2 Automation API', 'https://docs.saleae.com/'],
    saleaeOverview: ['Saleae · 自动采集、分析与导出', 'https://www.saleae.com/support/extensions-api/automation-api/automation'],
    sgsPortfolio: ['SGS · EMC、产品安全与认证服务', 'https://www.sgs-cqe.de/en/service-portfolio.html'],
    hqPrint: ['华秋 3D 打印 · 在线报价与文件格式', 'https://www.hq3dp.cn/quote'],
    deepdive: ['DeepDive · 哪家服务真正做到了 Agent native', 'https://xiaopingfeng.com/deepdive/agent-native-services/?v=2'],
    deepdiveMethod: ['DeepDive §01 · 六个动作与接入尺度', 'https://xiaopingfeng.com/deepdive/agent-native-services/?v=2#sec-01'],
    deepdiveJlc: ['DeepDive §03 · 嘉立创订单实测与接口清单', 'https://xiaopingfeng.com/deepdive/agent-native-services/?v=2#sec-03'],
    deepdiveSlant: ['DeepDive §05 · Slant 3D 计价实测', 'https://xiaopingfeng.com/deepdive/agent-native-services/?v=2#sec-05'],
    deepdiveAgent: ['DeepDive §08 · Agent 入口比较', 'https://xiaopingfeng.com/deepdive/agent-native-services/?v=2#sec-08'],
    eda: ['嘉立创 EDA · 命令行与 MCP', 'https://prodocs.easyeda.com/cn/api/guide/cli.html'],
    edaOrder: ['嘉立创 EDA · 下单方法（Beta）', 'https://prodocs.easyeda.com/en/api/reference/pro-api.pcb_manufacturedata.placepcborder.html'],
    edaDfm: ['嘉立创 EDA · 官方 DFM 扩展', 'https://github.com/easyeda/eext-jlc-order-dfm-checker'],
    jlc: ['嘉立创 · 开放平台业务范围', 'https://www.jlc.com/portal/q7i64392.html'],
    jlcGuide: ['嘉立创 · API 开发指南', 'https://open.jlc.com/develop-guide'],
    jlcSmt: ['嘉立创 · SMT 下单说明', 'https://www.jlc.com/portal/server_guide_19327.html'],
    blacklake: ['黑湖 · OpenAPI MCP 接入指南', 'https://v3-hw-openapi.blacklake.cn/document/mcp'],
    blacklakeMes: ['华为云 · 黑湖 MES 集成接口清单', 'https://support.huaweicloud.com/bestpractice-sparkpack/zh-cn_topic_0000001443502088.html'],
    blacklakeReport: ['黑湖 · 批量报工 API', 'https://v3-hw-openapi.blacklake.cn/document/api?catId=1650452818128086&detailId=1681109889053798&url=%2Fmfg%2Fopen%2Fv1%2Fprogress_report%2F_progress_report'],
    blacklakeProduct: ['黑湖 · 工业 Agent 产品页', 'https://blacklake.cn/'],
    hiMcp: ['Hi3D / Hitem3D · MCP 接入指南', 'https://docs.hi3d.ai/en/mcp-tools'],
    hiApi: ['Hi3D · 创建任务 API', 'https://docs.hi3d.ai/zh/api/api-reference/list/create-task'],
    hiQuery: ['Hi3D · 查询任务与模型结果', 'https://docs.hi3d.ai/zh/api/api-reference/list/query-task'],
    hiFaq: ['Hi3D · API 常见问题', 'https://docs.hi3d.ai/zh/api/getting-started/faq'],
    hq: ['华秋 · PCB API 合作公告', 'https://www.hqpcb.com/help/p_1867.html'],
    hqKiCad: ['华秋 KiCad · 10.0.0 发布说明', 'https://kicad.eda.cn/docs/posts/KiCad-10.0.0-Release.html'],
    hqDsh: ['华秋 KiCad · 10.0.7-2 发布说明', 'https://kicad.eda.cn/docs/posts/KiCad-10.0.7-2-Release.html'],
    hqPlugins: ['华秋 · DSH 插件与工具源码', 'https://github.com/Huaqiu-Electronics/dsh-pcb-eda'],
    hqDfm: ['华秋 · DFM 软件介绍', 'https://www.huaqiu.com/news/detail/id/31.html'],
    hqPcba: ['华秋 · PCBA 下单、贴片与返单', 'https://www.hqpcb.com/help/p_1721.html'],
    hqHelp: ['华秋 · SMT / PCBA 帮助中心', 'https://www.hqpcb.com/help'],
    pcbway: ['PCBWay · 合作伙伴测试接口', 'https://api-partner.pcbway.com/Help'],
    pcbwayApply: ['PCBWay · API 合作申请', 'https://www.pcbway.com/api_cooperation.html'],
    pcbwayFlow: ['PCBWay · 合作伙伴订单流程', 'https://api-partner.pcbway.com/PCBWay%20API%20for%20Partners.pdf'],
    slantMcp: ['Slant 3D · 公共 MCP 工具目录', 'https://www.slant3d.com/mcp-server'],
    slantApi: ['Slant 3D · 打印 OpenAPI 规范', 'https://slant3dapi.com/v2/api/openapi.json']
  },
  platforms: [
    {
      id: 'easyeda', name: '嘉立创 EDA', scope: '电子设计', color: 'blue', mcp: '本地', api: '扩展 API',
      access: '安装专业版客户端，通过 CLI 或 MCP 驱动编辑器。',
      test: '本地设计可验证。真实订单测试环境待核实。',
      human: 'Beta 下单方法完成检查后打开下单页，后续由用户在网页确认。',
      refs: ['eda', 'edaOrder', 'edaDfm'],
      order: ['本地编辑器提供设计文件与制造数据导出。', '下单检查与本地 PCB DFM 扩展。', '报价由制造平台处理。', 'Beta 方法打开下单页，由人继续操作。', '订单跟踪由制造平台处理。', '撤单由制造平台处理。'],
      orderRefs: ['eda', 'edaDfm', 'edaOrder', 'edaOrder', 'edaOrder', 'edaOrder'],
      cells: {
        schematic: ['core', '编辑原理图', 'MCP · API · CLI', '运行专业版客户端，经 MCP 或 CLI 调扩展 API 操作原理图并导出 BOM。', ['eda']],
        layout: ['core', 'PCB 编辑与导出', 'MCP · API · CLI', '使用本地编辑器的扩展 API 操作 PCB，导出 Gerber 和 3D 文件。', ['eda']],
        order: ['partial', '检查后跳转', 'MCP · API · CLI', 'Beta 方法先做下单检查，再生成订单数据并打开下单页。后续报价、付款及撤单在制造侧处理。', ['edaOrder', 'deepdiveJlc']],
        preflight: ['partial', '本地 DFM', '扩展', '官方扩展可检查部分 PCB 可制造性规则。实物上电、功能测试和贴片方向复核仍需各自的验证证据。', ['edaDfm', 'deepdiveJlc']]
      }
    },
    {
      id: 'jlc', name: '嘉立创开放平台', scope: 'PCB / SMT / 3D 打印', color: 'blue', mcp: '未找到', api: '审批开放',
      access: '按业务线申请。国内开发指南提供签名、错误码、请求追踪号和 SDK。',
      test: 'DeepDive 的国内 PCB 接入未发现沙箱。',
      human: 'DeepDive 记录了网页付款和贴片审核。付款能力依订单参数与账户条件判断。',
      refs: ['jlc', 'jlcGuide', 'deepdiveJlc'],
      order: ['官方公布 PCB、SMT、3D 打印等业务范围。', '国内 PCB 开放接口清单未见独立 DFM。', 'PCB 计价接口有历史实测。', '国内 PCB 有建单接口。DeepDive 实例中人到网页付款，SMT 也在网页建单。', 'API 可查询订单、生产进度与物流。', 'DeepDive 核对的国内 PCB 清单未见撤单接口。'],
      orderRefs: ['jlc', 'deepdiveJlc', 'deepdiveJlc', 'jlcSmt', 'jlc', 'deepdiveJlc'],
      cells: {
        parts: ['partial', '库存与料号', 'API', 'SMT 元件信息可查询。元器件与 MRO 接口按条件试开放，覆盖商品、价格与库存。完整替代料审批和 BOM 采购流程待核实。', ['jlc']],
        order: ['partial', 'PCB 计价 / 建单', 'API', '国内 PCB 计价经 DeepDive 实跑。该文查到建单、订单查询，记录的建单流程通过公网 URL 交文件。国内 PCB 校验与撤单接口未见于该文核过的清单。', ['jlc', 'jlcGuide', 'deepdiveJlc'], '历史实测仅覆盖 PCB 计价。'],
        fabrication: ['core', '生产进度与物流', 'API', '国内 PCB 与 3D 打印可建单并查生产进度和物流。可见的是厂商履约状态，实时机台产能仍待核实。', ['jlc']],
        assembly: ['partial', 'SMT 订单查询', 'API · 网页', 'API 可查 SMT 订单、生产进度和物料。SMT 建单公开指引走网页，需核对 PCB 订单、BOM 和贴片位置。', ['jlc', 'jlcSmt', 'deepdiveJlc']],
        preflight: ['ui', '网页贴片复核', '网页', 'DeepDive 记录了在贴片预览中人工核对元件方向。制造侧的结构化 DFM、测试报告或验收签署接口未核实。', ['deepdiveJlc']],
        scale: ['partial', 'PCB 返单', 'API', '开放平台支持 PCB 返单和进度跟踪。批次质量放行、工程变更和认证记录接口待核实。', ['jlc']]
      }
    },
    {
      id: 'blacklake', name: '黑湖智造 3.0', scope: '工厂 MES / 生产协同', color: 'teal', mcp: '有指南 · 待验', api: '租户接入',
      access: '公开 OpenAPI 文档及 MCP 指南。指南提供接口索引和 Markdown 路径，此次未能读取业务工具清单。',
      test: '独立沙箱及开通方式待核实。',
      human: '批量报工文档有 needCheck 二次确认字段。具体确认流程与租户权限待联调。',
      refs: ['blacklake', 'blacklakeMes', 'blacklakeReport'],
      cells: {
        parts: ['partial', '工厂物料同步', 'API', 'MES 集成公开列出物料导入、停用与投料事件回调。覆盖厂内物料协同，供应商选件、采购价和替代料流程待核实。', ['blacklakeMes']],
        order: ['unknown', '报价接口待核', '待核实', '官网展示报价 Agent。该产品的对外报价、供应商交易及付款接口待核实。生产工单能力列在制造阶段。', ['blacklakeProduct', 'blacklake']],
        fabrication: ['core', '建工单 / 报工', 'API', '集成清单列出创建、编辑、关闭和查询生产工单。官方批量报工 API 是异步接口，需轮询库存更新结果，并可返回二次确认标志。', ['blacklakeMes', 'blacklakeReport']],
        assembly: ['partial', '工序报工', 'API', '可按生产任务与工序提交报工、产量和投料追溯信息。面向电子贴片的专用数据和工艺确认入口待核实。', ['blacklakeReport']],
        verify: ['partial', '质量状态记录', 'API', '报工接口有质量状态和不良原因字段，可写入合格、待检等状态。测试设备数据、完整报告和验收签署接口待核实。', ['blacklakeReport']],
        scale: ['partial', '批次追溯字段', 'API', '报工支持批次和投料追溯相关字段。量产放行、工程变更及外部认证的端到端接口待核实。', ['blacklakeReport']]
      }
    },
    {
      id: 'hi3d', name: 'Hi3D', scope: '图生 3D / 网格资产', color: 'violet', mcp: '托管', api: '自助密钥',
      access: '开发者控制台自助创建凭据，托管 MCP 使用 Basic Auth。',
      test: '有试用资源包。独立沙箱待核实。',
      human: '人开通资源包。任务消耗积分，部分失败类型退还或免扣。',
      refs: ['hiMcp', 'hiApi', 'hiQuery', 'hiFaq', 'deepdiveAgent'],
      cells: {
        concept: ['core', '图生 3D', 'MCP · API', '可提交图片生成几何与纹理，随后查询任务并取下载链接。REST 支持状态回调。尺寸、公差和可编辑工程 CAD 需另行验证。', ['hiMcp', 'hiApi', 'hiQuery', 'hiFaq', 'deepdiveAgent'], '本页只读探测列出 2 个 MCP 工具，均无 annotations。未提交生成任务。'],
        preflight: ['unknown', '网格校验待核', '待核实', '生成接口输出网格和纹理。公开 MCP 工具列表只有提交和查询，独立的尺寸、公差或可打印性校验能力待核实。', ['hiMcp', 'hiFaq']]
      }
    },
    {
      id: 'huaqiu-kicad', name: '华秋 KiCad', scope: '电子设计 / DSH', color: 'orange', mcp: '曾内置 · 待验', api: 'IPC API · CLI',
      access: '安装华秋发行版或接入开源 DSH 插件。部分工具需登录华秋账号。10.0.0 曾内置 MCP，当前 DSH 版的 MCP 工具清单待核实。',
      test: '可用本地 KiCad 工程测试设计和 DRC。供应链业务沙箱待核实。',
      human: '部分设计操作需确认。封装生成可请求确认尺寸。PCB、SMT 供应链插件把文件交给下单页。',
      refs: ['hqKiCad', 'hqDsh', 'hqPlugins'],
      cells: {
        intent: ['partial', '需求转系统方案', 'DSH 工具', '开源插件注册系统模块图和原理图生成工具，并可交付预览或工程文件。完整需求追踪与验收规格接口待核实。', ['hqPlugins']],
        schematic: ['core', '原理图与符号生成', 'DSH 工具', 'DSH 插件可生成原理图、符号和封装。工程师仍需复核设计结果。', ['hqDsh', 'hqPlugins']],
        layout: ['core', 'PCB 编辑与布线', 'DSH · IPC API', '经 KiCad IPC API 操作 PCB。新版 Windows 发行版另有自动布线适配器。', ['hqDsh', 'hqPlugins']],
        parts: ['partial', '查件 / BOM 询价', 'DSH 工具', '有器件搜索和报价工具。发行版支持 BOM 匹配，替代件审批与采购闭环待核实。', ['hqDsh', 'hqPlugins']],
        order: ['ui', '插件上传文件', '桌面工具', '发行说明展示 PCB、SMT 插件导出制造文件并转入下单页。华秋 PCB 合作 API 单独评估。', ['hqKiCad']],
        preflight: ['partial', '结构化 DRC', 'CLI · DSH', 'DRC 插件调用 kicad-cli 并返回结构化结果。实物上电与功能验收另需证据。', ['hqDsh']]
      }
    },
    {
      id: 'huaqiu', name: '华秋 PCB', scope: 'PCB / PCBA / DFM', color: 'orange', mcp: '未找到', api: '审批开放',
      access: '在华秋 PCB 用户中心申请，审核通过后取应用 Key 和密钥。',
      test: '沙箱、测试密钥及测试订单规则待核实。',
      human: '公告称支持 API 支付。权限、逐笔批准与支付撤回条件待核实。',
      refs: ['hq', 'hqDfm', 'hqHelp'],
      order: ['公告公开服务范围，工艺能力查询的字段级文档待核实。', '有桌面 DFM，公开 API 待核实。', '公告列出 PCB 计价。', '公告列出创建和支付，交易审批语义待核实。', '公告列出生产进度及物流追踪。', '公告列出删除订单，适用状态和退款语义待核实。'],
      orderRefs: ['hq', 'hqDfm', 'hq', 'hq', 'hq', 'hq'],
      cells: {
        parts: ['ui', 'BOM 配单', '网页', '帮助中心展示元器件采购和 BOM 配单。PCB 合作公告提及商城开放服务，具体 BOM 查询和替代件接口待核实。', ['hq', 'hqHelp']],
        order: ['partial', '建单 / 支付 / 删除', 'API', '官方公告列出计价及订单创建、修改、查询、支付和删除。校验、删除边界及付款审批语义需申请后核实。', ['hq']],
        fabrication: ['core', '生产进度与物流', 'API', 'PCB 合作公告列出创建 PCB 订单、查询生产进度和物流跟踪。字段级合同及调用结果待联调。', ['hq']],
        assembly: ['ui', 'PCBA 网页下单', '网页', '公开帮助提供 PCBA 下单和 SMT 返单流程。PCB API 合作公告未列明 SMT 建单接口。', ['hqPcba', 'hq']],
        preflight: ['ui', '桌面 DFM', '桌面工具', '官方提供 PCB 可制造性分析软件。公开的检查 API、结构化结果和实物测试接口待核实。', ['hqDfm']],
        scale: ['ui', 'PCBA 网页返单', '网页', '已审过生产资料的 PCBA 订单可在网页返单。批次放行、变更或认证记录的专用接口待核实。', ['hqPcba', 'hq']]
      }
    },
    {
      id: 'pcbway', name: 'PCBWay', scope: 'PCB / SMT · 对照', color: 'orange', mcp: '未找到', api: '合作伙伴',
      access: '合作伙伴申请审批。公开测试环境提供接口说明及示例。',
      test: '公开测试环境文档，调用需合作凭据。',
      human: '可用合作账户余额确认，或返回网页支付链接。',
      refs: ['pcbway', 'pcbwayApply', 'pcbwayFlow'],
      order: ['合作 API 提供 PCB 报价参数及可选工艺字段。', '独立 DFM 校验接口待核实。', 'PCB 报价、运费有公开接口文档。', '可入购物车，再选合作余额或网页支付。', 'API 查询订单详情和生产状态。', '合作流程明确可在付款前撤单。'],
      orderRefs: ['pcbway', 'pcbwayFlow', 'pcbway', 'pcbwayFlow', 'pcbway', 'pcbwayFlow'],
      cells: {
        order: ['core', '报价到撤单', 'API', '合作接口覆盖 PCB 报价、入购物车、运费、查询、付款确认与取消。公开流程文件明确付款前可撤单。独立结构化 DFM 接口待核实。', ['pcbway', 'pcbwayFlow']],
        fabrication: ['core', '建单与生产状态', 'API', '合作伙伴 API 提供 PCB 订单和生产状态查询。此处评估履约可见性。', ['pcbway']],
        assembly: ['partial', 'SMT 报价', 'API', '测试目录列出 SMT 计价。官网合作说明将完整装配 API 标为建设中。', ['pcbway', 'pcbwayApply']]
      }
    },
    {
      id: 'slant', name: 'Slant 3D', scope: 'FDM 打印 · 对照', color: 'teal', mcp: '托管 · 免密钥', api: '独立 REST',
      access: '公共 MCP 可直接发现工具。打印 REST 另有接入流程。',
      test: '可无密钥查看材料、计价。结账后的隔离测试环境待核实。',
      human: 'MCP 生成结账链接，由人付款。支付完成后订单进入打印。',
      refs: ['slantMcp', 'slantApi', 'deepdiveSlant'],
      order: ['MCP 可查询材料与颜色。', '上传 STL 后可返回实验性打印反馈。', 'MCP 支持阶梯报价、交期和运费。', 'MCP 生成结账链接，人付款后入生产。', '生产状态走 REST，MCP 工具列表未见订单状态。', 'MCP 未列撤单工具。REST 可在尚未开工时撤单。'],
      orderRefs: ['slantMcp', 'slantMcp', 'slantMcp', 'slantMcp', 'slantApi', 'slantApi'],
      cells: {
        order: ['partial', '报价与结账链接', 'MCP · API', '公共 MCP 支持上传 STL、改数量、查运费并生成结账链接。公开 MCP 工具列表未见撤单或订单状态工具，REST 支持查订单及开工前撤单。', ['slantMcp', 'slantApi'], '本页只读探测列出 10 个带 annotations 的工具。报价实跑见 DeepDive。'],
        fabrication: ['core', '打印与进度', 'MCP · API', 'MCP 公开材料、数量和交期，完成付款后进入打印。REST 提供订单进度。', ['slantMcp', 'slantApi']],
        preflight: ['partial', '可打印性反馈', 'MCP', '报价接口可返回实验性的可打印性问题与改进建议。实物尺寸、材料性能和功能验收另需证据。', ['slantMcp', 'deepdiveSlant']],
        scale: ['partial', '批量阶梯报价', 'MCP · API', '可按不同数量查单价和交期。量产批次放行与认证的接口待核实。', ['slantMcp', 'slantApi']]
      }
    },
    {
      id: 'github', name: 'GitHub', scope: '需求与版本管理', color: 'blue', mcp: '托管 / 本地', api: 'REST',
      access: '使用仓库权限授权官方 MCP 或 REST API，按需开启 Issues 工具。',
      test: '可用测试仓库验证权限、需求和发布流程。',
      human: '产品负责人确认需求和验收阈值。发版权限由仓库配置，实体批次仍需质量签字。',
      refs: ['githubMcp', 'githubIssues', 'githubRelease'],
      cells: {
        intent: ['core', '需求单与验收项', 'MCP · REST', '用 Issues 读写需求、验收标准和责任人。以需求编号关联后续设计和测试。', ['githubMcp', 'githubIssues']],
        release: ['partial', '版本与发布附件', 'REST', '可创建发布并上传与版本对应的固件、制造包和测试报告。质量负责人另行审核实体批次。', ['githubRelease']]
      }
    },
    {
      id: 'kicad', name: 'KiCad', scope: '开源电子设计', color: 'violet', mcp: '未找到', api: 'IPC API · CLI',
      access: '安装 KiCad。9/10 的 IPC 需要正在运行的 PCB 编辑器，导出与规则检查可走 CLI。',
      test: '本地工程可复跑 CLI。按所用版本核对 IPC 的编辑范围。',
      human: '工程师确认电路行为、板厂约束和无法靠规则判断的问题。',
      refs: ['kicadCli', 'kicadIpc'],
      cells: {
        schematic: ['partial', '原理图与网表', 'CLI · 编辑器', 'KiCad 10 可用 CLI 导出原理图网表和 BOM。原理图编辑在桌面完成，10 版 IPC 插件入口位于 PCB 编辑器。', ['kicadCli', 'kicadIpc']],
        layout: ['core', 'PCB 编辑与导出', 'IPC API · CLI', '通过 IPC 对接 PCB 编辑器，并用 CLI 导出 Gerber、钻孔和 STEP。9/10 的 IPC 需要 GUI 会话。', ['kicadIpc', 'kicadCli']],
        simulation: ['ui', '电路 SPICE 仿真', '桌面工具', 'KiCad 原理图编辑器集成 ngspice。先为器件配置模型，再选择瞬态或频域分析。此格记录编辑器中的操作流程。', ['kicadSpice']],
        preflight: ['core', 'ERC / DRC 报告', 'CLI', '可脚本化执行原理图 ERC 与 PCB DRC，并保存报告或按违规退出。板厂专用 DFM 和功能验证仍需对应流程。', ['kicadCli']]
      }
    },
    {
      id: 'freecad', name: 'FreeCAD', scope: '参数化机械 CAD', color: 'violet', mcp: '未找到', api: '本地 Python',
      access: '安装桌面应用，用本地 Python 脚本操作参数化模型。',
      test: '用本地样件、板卡 STEP 和尺寸约束验证脚本与导出。',
      human: '工程师确认配合公差、材料和装配可达性。',
      refs: ['freecad', 'freecadScript'],
      cells: {
        mechanical: ['core', '参数化外壳 / STEP', 'Python · 桌面', '可导入板卡 STEP，按板框、连接器和固定点建立可编辑外壳，再导出 STEP 或 STL。', ['freecad', 'freecadScript']]
      }
    },
    {
      id: 'esp-idf', name: '乐鑫 ESP-IDF', scope: 'ESP32 固件与实板测试', color: 'blue', mcp: '本地', api: '本地 CLI',
      access: '安装支持 MCP 的 ESP-IDF 与 mcp 功能，或直接使用 idf.py 命令行。按版本核对工具清单。',
      test: '可本地构建。实板测试需要目标板、串口和相应测试连接。',
      human: '人确认目标板与串口，首次上电检查电源及接线。',
      refs: ['idfMcp', 'idfFlash', 'idfTest'],
      cells: {
        firmware: ['core', '创建、配置与构建', 'MCP · CLI', '官方文档列出建项目、选芯片、构建和读取产物状态。固定芯片型号、配置和固件版本后交给烧录。', ['idfMcp', 'idfFlash']],
        bringup: ['core', '烧录与串口日志', 'MCP · CLI', '可按端口烧录。官方最新 MCP 文档含脚本式串口监视。首次上电和电源测量由人完成。', ['idfMcp', 'idfFlash']],
        verify: ['partial', '实板回归测试', 'pytest · CLI', 'pytest-embedded 可驱动实板并断言串口输出。测试夹具、传感器参考值和整机验收仍需项目定义。', ['idfTest']]
      }
    },
    {
      id: 'wokwi', name: 'Wokwi', scope: '嵌入式仿真与 CI', color: 'violet', mcp: '本地 · 实验性', api: 'CLI',
      access: '用 Wokwi CLI 和 CI token，提供固件二进制与仿真配置。实验性 MCP 随 CLI。',
      test: '云端仿真支持自动化场景和串口断言，受方案配额约束。',
      human: '人确认目标芯片、模拟器件和验收用例，实板测试另行执行。',
      refs: ['wokwiCi', 'wokwiMcp'],
      cells: {
        simulation: ['core', '仿真场景与串口断言', 'CLI · 实验 MCP', 'CI 可运行固件、模拟按键和传感器输入，并对串口输出设断言。仿真服务器需要固件二进制。', ['wokwiCi', 'wokwiMcp']]
      }
    },
    {
      id: 'lcsc', name: '立创商城', scope: '国内元器件与 BOM 配单', color: 'orange', mcp: '未找到', api: '商城端待核实',
      access: '新版 BOM 智能云表可通过网页导入或粘贴。此行评估商城端，嘉立创开放平台按业务线单列。',
      test: '可在网页试配单，公开商城采购沙箱待核实。',
      human: '人核对料号、价格、库存和替代料，再确认采购。',
      refs: ['lcscBom', 'jlc'],
      cells: {
        parts: ['ui', '匹配 BOM 和查库存', '网页', '新版 BOM 云表可匹配商品并查看参数、库存和价格。商城端公开可调用的配单合同待核实。', ['lcscBom']],
        order: ['ui', '批量采购元器件', '网页', 'BOM 配单支持网页批量采购。此格仅指器件采购，制板和贴片下单分别评估。', ['lcscBom']]
      }
    },
    {
      id: 'digikey', name: 'DigiKey', scope: '全球元器件分销', color: 'orange', mcp: '未找到', api: 'OAuth REST',
      access: '注册应用，按所需 API 使用 OAuth。Ordering API 要求有效的 DigiKey 企业信用账户。',
      test: '官方有沙箱。部分查询返回示例数据，用于验证接入与响应结构。',
      human: '工程师批准替代件。下单遵守账户权限和项目付款授权。',
      refs: ['digikeySearch', 'digikeyProducts', 'digikeyFaq'],
      cells: {
        parts: ['core', '料号、价格与库存', 'REST API', '可按料号、参数和品类查询。用 Product Details 复核实时价格和库存，关键词查询可能来自缓存。', ['digikeySearch', 'digikeyFaq']],
        order: ['partial', '报价与器件订单', 'REST API', '官方目录有报价、下单及订单状态。Ordering 需要企业信用账户，此格限元器件采购。', ['digikeyProducts']]
      }
    },
    {
      id: 'saleae', name: 'Saleae Logic 2', scope: '台架波形与总线测试', color: 'teal', mcp: '未找到', api: '本地 Python',
      access: '用 Logic 2 启动自动化服务，经 Python 连接。实测需要受支持的 USB 逻辑分析仪。',
      test: '可保存和加载采集记录，连接硬件后运行重复采集。',
      human: '人接线、选量程与采样率，并判断波形是否符合工程要求。',
      refs: ['saleaeOverview', 'saleaeApi'],
      cells: {
        bringup: ['partial', '采集启动与总线信号', 'Python API · 人工接线', '脚本可配置、启动采集并保存波形，用于复查 SPI、I²C 或串口。上电及电气安全检查仍由工程师负责。', ['saleaeOverview', 'saleaeApi']],
        verify: ['partial', '自动采集与导出', 'Python API', '能重复记录、分析并导出捕获数据，供台架用例比较。验收规则和其他测量仪器由项目补齐。', ['saleaeOverview', 'saleaeApi']]
      }
    },
    {
      id: 'sgs', name: 'SGS', scope: '第三方检测与认证服务', color: 'teal', mcp: '未找到', api: '业务接口待核实',
      access: '根据目标市场、产品与适用项目联系具备相应资质的实验室。',
      test: '实验室按项目和样品执行，接入沙箱待核实。',
      human: '工程师与实验室确认配置、检测范围及报告。质量负责人据此审批。',
      refs: ['sgsPortfolio'],
      cells: {
        compliance: ['ui', 'EMC 与安全送检', '人工 / 实验室', '公开服务包括 EMC、射频、产品安全和认证支持。应按目标市场与最终产品配置确认适用项目。', ['sgsPortfolio']]
      }
    },
    {
      id: 'hq3dp', name: '华秋 3D 打印', scope: '结构件与小批量打印', color: 'orange', mcp: '未找到', api: '业务接口待核实',
      access: '登录官网上传 STEP 或 STL，选材料和工艺，使用在线报价。',
      test: '公开资料可核对文件格式和工艺。接入沙箱待核实。',
      human: '人确认模型版本、材料、数量、报价和订单。',
      refs: ['hqPrint'],
      cells: {
        order: ['ui', '打印在线报价与下单', '网页', '登录后可上传模型、选工艺并建单。公开可调用的报价和订单接口待核实。', ['hqPrint']],
        fabrication: ['ui', '打印结构件', '网页', '平台接单后生产打印件。工程师确认版本、材料和关键尺寸。', ['hqPrint']]
      }
    }
  ]
};
