'use strict';

const bench = {
  date: '2026-11-11',
  levels: {
    core: { label: '主要动作可调', description: '指定子流程的主要动作有机器接口，输出可供后续步骤使用。' },
    partial: { label: '部分动作可调', description: '已有部分读写接口，关键动作、状态或交接仍缺证据。' },
    ui: { label: '界面可做', description: '有官方产品界面或桌面工具，未找到该动作的可调用入口。' },
    unknown: { label: '待核实', description: '业务相关，但公开证据不足以判定接口覆盖。' },
    na: { label: '范围外', description: '超出本行产品的评测范围。' }
  },
  stages: [
    { id: 'intent', name: '想法与需求', task: '收集需求、澄清约束并输出可交接的规格。' },
    { id: 'design', name: '设计', task: '生成或修改原理图、PCB、外壳或固件，并导出设计文件。' },
    { id: 'parts', name: '选件', task: '查料号、库存、价格和替代件，并形成可采购的 BOM。' },
    { id: 'order', name: '下单', task: '校验文件、计价、创建订单、确认付款、跟踪与取消。' },
    { id: 'fabrication', name: '制造', task: '查询工艺与材料能力，提交制造任务并读取生产进度。' },
    { id: 'assembly', name: '装配', task: '提交贴片或装配任务，确认物料与工艺，读取进度。' },
    { id: 'verify', name: '验证', task: '区分设计规则检查、工厂质量记录和实物上电或功能测试。' },
    { id: 'scale', name: '量产与认证', task: '追踪批次、变更和量产放行，并取得可追溯的认证记录。' }
  ],
  orderChecks: ['能力查询', '文件校验', '报价', '下单与付款', '跟踪', '取消'],
  sources: {
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
        design: ['core', '原理图与 PCB', 'MCP · API · CLI', '专业版可打开或创建项目，经 MCP、CLI 或脚本调用扩展 API，操作原理图和 PCB 并导出制造文件。需运行本地编辑器。', ['eda']],
        order: ['partial', '检查后跳转', 'MCP · API · CLI', 'Beta 方法先做下单检查，再生成订单数据并打开下单页。后续报价、付款及撤单在制造侧处理。', ['edaOrder', 'deepdiveJlc']],
        verify: ['partial', '本地 DFM', '扩展', '官方扩展可检查部分 PCB 可制造性规则。实物上电、功能测试和贴片方向复核仍需各自的验证证据。', ['edaDfm', 'deepdiveJlc']]
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
        verify: ['ui', '网页贴片复核', '网页', 'DeepDive 记录了在贴片预览中人工核对元件方向。制造侧的结构化 DFM、测试报告或验收签署接口未核实。', ['deepdiveJlc']],
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
        design: ['core', '图生 3D', 'MCP · API', '可提交图片生成几何与纹理，随后查询任务并取下载链接。REST 支持状态回调。尺寸、公差和可编辑工程 CAD 需另行验证。', ['hiMcp', 'hiApi', 'hiQuery', 'hiFaq', 'deepdiveAgent'], '本页只读探测列出 2 个 MCP 工具，均无 annotations。未提交生成任务。'],
        verify: ['unknown', '网格校验待核', '待核实', '生成接口输出网格和纹理。公开 MCP 工具列表只有提交和查询，独立的尺寸、公差或可打印性校验能力待核实。', ['hiMcp', 'hiFaq']]
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
        design: ['core', '原理图与 PCB', 'DSH · IPC API', 'DSH 插件支持原理图、符号和封装生成，经 KiCad IPC API 操作 PCB。新版 Windows 发行版另有自动布线适配器。', ['hqDsh', 'hqPlugins']],
        parts: ['partial', '查件 / BOM 询价', 'DSH 工具', '有器件搜索和报价工具。发行版支持 BOM 匹配，替代件审批与采购闭环待核实。', ['hqDsh', 'hqPlugins']],
        order: ['ui', '插件上传文件', '桌面工具', '发行说明展示 PCB、SMT 插件导出制造文件并转入下单页。华秋 PCB 合作 API 单独评估。', ['hqKiCad']],
        verify: ['partial', '结构化 DRC', 'CLI · DSH', 'DRC 插件调用 kicad-cli 并返回结构化结果。实物上电与功能验收另需证据。', ['hqDsh']]
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
        assembly: ['ui', 'PCBA 网页下单', '网页', '公开帮助提供 PCBA 下单和 SMT 返单流程。PCB API 合作公告未列明 SMT 建单接口。', ['hqHelp', 'hq']],
        verify: ['ui', '桌面 DFM', '桌面工具', '官方提供 PCB 可制造性分析软件。公开的检查 API、结构化结果和实物测试接口待核实。', ['hqDfm']],
        scale: ['unknown', '批次接口待核', '待核实', '公开合作公告覆盖 PCB 订单与进度。批次放行、变更或认证记录的专用接口待核实。', ['hq']]
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
        verify: ['partial', '可打印性反馈', 'MCP', '报价接口可返回实验性的可打印性问题与改进建议。实物尺寸、材料性能和功能验收另需证据。', ['slantMcp', 'deepdiveSlant']],
        scale: ['partial', '批量阶梯报价', 'MCP · API', '可按不同数量查单价和交期。量产批次放行与认证的接口待核实。', ['slantMcp', 'slantApi']]
      }
    }
  ]
};
