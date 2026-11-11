# Project Hardcore · 供货商与生态

复核日期为 2026-11-11。

本记录针对小型 ESP32 硬件从需求到量产放行的候选路线。 [打开 Bench](https://roam.xiaopingfeng.com/hardware-agent-bench/) · [显示可行路线](https://roam.xiaopingfeng.com/hardware-agent-bench/?focus=viable#route)

复核了 17 个阶段、18 项交接。整机验证同时核对实板测试和 MES 质量记录。格式可直交 5 项、需转换或关联 14 项、人工确认 17 项、接口缺口 8 项。同一项可带多个标记。「格式可直交」表示有资料支持下游接受该格式，具体项目仍需满足所列条件。「接口缺口」指跨系统能力或业务接口在公开证据下尚未证实，涉及已授权接口时仍需联调。供应商和工具均为平台建设候选。本轮按公开证据复核，未执行端到端打样、付费或送检。

## 平台需要记录的交接信息

1. **工程交付** · 每份文件保留项目 ID、需求版本、工程修订号、来源、格式、文件指纹和接收方的检查结果。冻结制造包内的 Gerber、钻孔、BOM 和坐标必须能追到同一版本。
2. **跨平台编号** · 保留供应商订单号、内部工单号、供应商批次、样机序列号和测试编号的对应关系。查询状态和收到实物分别记录。
3. **人工确认** · 给规格批准、替代料、审单和付款、首次上电、质检判定与量产放行建立待确认记录，记下责任人、时间、确认对象的版本及证据。
4. **接口接入** · 首先用本地导出和只读状态接口验证交接。对商城物料与 SMT 编号、嘉立创与黑湖工单、实测记录与 MES 状态建立明确映射。接口仍缺的环节支持人工交接，并保留相同版本和编号。
5. **供货商复核** · 后续记录授权条件、测试环境、已核实动作、成功和失败样例、人工责任人及复核日期。获得凭据后的联调结果另行记录。

电路、结构、固件和选件可并行。试产工单必须先于对应批次的报工和质检记录建立。下文按矩阵列顺序记录，并在各项写明实际依赖。

## 产品定义

### 01 需求规格

**GitHub · MCP · REST** · 需转换或关联、人工确认。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=github&stage=intent&stages=17&focus=viable#matrix)

- **本步交付** · 需求 Issue、规格版本、验收项编号及阈值。
- **交给下一步** · Hi3D 接收外观参考图和尺寸包络，电路与结构设计同时读取冻结规格。
- **接入条件** · Issues API 能交付标题、正文和编号。平台需把自由文本整理成结构化规格，并关联验收项。负责人确认约束、预算和放行阈值后再发给设计工具。 [GitHub · Issues REST API](https://docs.github.com/en/rest/issues/issues#create-an-issue) · [Hi3D · 创建任务 API](https://docs.hi3d.ai/zh/api/api-reference/list/create-task) · [NASA · 系统工程与需求分解](https://www.nasa.gov/reference/2-0-fundamentals-of-systems-engineering/)

### 02 概念外观

**Hi3D · MCP · API** · 需转换或关联、人工确认。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=hi3d&stage=concept&stages=17&focus=viable#matrix)

- **本步交付** · 选定参考图、任务 ID、网格下载链接和预览图。
- **交给下一步** · FreeCAD 读取网格作为参考，并同时接收 PCB STEP 和尺寸约束。
- **接入条件** · MCP 或 REST 可返回网格资产。工程人员要选稿，并按公差、板框和接口位置重建参数化 CAD。记录输入图和下载结果版本。 [Hi3D / Hitem3D · MCP 接入指南](https://docs.hi3d.ai/en/mcp-tools) · [Hi3D · 查询任务与模型结果](https://docs.hi3d.ai/zh/api/api-reference/list/query-task) · [FreeCAD · 参数化设计和 STEP 支持](https://www.freecad.org/features)

## 设计与工程

### 03 电路原理图

**嘉立创 EDA · MCP · API · CLI** · 格式可直交、人工确认。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=easyeda&stage=schematic&stages=17&focus=viable#matrix)

- **本步交付** · 同一 EDA 工程的原理图、网络、位号与封装关联。
- **交给下一步** · 用嘉立创 EDA「更新/转换原理图到 PCB」，将引脚定义交给固件。
- **接入条件** · 同工程可以直接更新 PCB。工程师确认供电、引脚和符号到封装的映射，审查 ECO 差异后再应用。 [嘉立创 EDA · 更新/转换原理图到 PCB](https://prodocs.easyeda.com/cn/quick-start.html) · [嘉立创 EDA · 命令行与 MCP](https://prodocs.easyeda.com/cn/api/guide/cli.html)

### 04 PCB 布局布线

**嘉立创 EDA · MCP · API · CLI** · 格式可直交、人工确认。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=easyeda&stage=layout&stages=17&focus=viable#matrix)

- **本步交付** · PCB 源文件、板框、装配基准和板卡 STEP。
- **交给下一步** · FreeCAD 导入 STEP；PCB 工程与装配坐标保留给投产前审查。
- **接入条件** · STEP 格式可接收。检查板框原点、单位、孔位及连接器高度；未绑定 STEP 的元件可能缺少三维模型，需补尺寸包络。 [嘉立创 EDA · STEP 导出与器件模型](https://prodocs.lceda.cn/cn/faq/pcb/) · [FreeCAD · 参数化设计和 STEP 支持](https://www.freecad.org/features)

### 05 机械结构

**FreeCAD · Python · 桌面** · 格式可直交、人工确认。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=freecad&stage=mechanical&stages=17&focus=viable#matrix)

- **本步交付** · 可编辑 FCStd、每个独立零件的 STEP、关键尺寸与配合公差。
- **交给下一步** · STEP 交嘉立创 3D 打印，关键尺寸随装配说明和验收表交给装测。
- **接入条件** · 打印端接受 STEP。人确认材料、壁厚、工艺和公差，并按零件分别导出；板框或接口改版时重新核对外壳。 [FreeCAD · 参数化设计和 STEP 支持](https://www.freecad.org/features) · [嘉立创 3D 打印 · STEP 格式与工艺要求](https://www.jlc.com/portal/q7i40026.html)

### 06 固件开发

**乐鑫 ESP-IDF · MCP · CLI** · 格式可直交、需转换或关联。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=esp-idf&stage=firmware&stages=17&focus=viable#matrix)

- **本步交付** · 固定芯片目标和版本的 flasher_args.json、引用的全部镜像及 ELF。
- **交给下一步** · 同一套构建产物交 Wokwi 仿真，也保留给后续实板烧录。
- **接入条件** · Wokwi 支持 ESP-IDF 原始烧录清单，但要有 wokwi.toml 与目标芯片匹配的 diagram.json。CLI 可生成初始配置，传感器连线和用例仍需项目配置。 [乐鑫 · ESP-IDF 命令行与 MCP](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/tools/idf-py.html#esp-idf-mcp-server) · [Wokwi · ESP-IDF 烧录清单、镜像和板型](https://docs.wokwi.com/vscode/esp-idf) · [Wokwi · CLI 配置与运行](https://docs.wokwi.com/wokwi-ci/cli-usage)

### 07 选件与 BOM

**立创商城 · 网页** · 需转换或关联、人工确认、接口缺口。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=lcsc&stage=parts&stages=17&focus=viable#matrix)

- **本步交付** · 带厂商料号、封装、位号、用量和备选件的配单结果。
- **交给下一步** · 映射为嘉立创 SMT 的物料编号和装配 BOM，交给 DFM 与审单。
- **接入条件** · 商城配单能查库存和价格。未找到公开接口证明商城库存、编号与实际可贴料一键同步。人在 SMT 侧核对可贴库存、型号、封装和替代料，保留位号对应表。 [立创商城 · 新版 BOM 智能云表](https://www.szlcsc.com/news/16581.html) · [嘉立创 EDA · 元件购买与贴片导出](https://prodocs.easyeda.com/cn/schematic/export-order-parts/) · [嘉立创 · SMT 下单、核料与审单](https://www.jlc.com/portal/server_guide_19858.html)

### 08 仿真与回归

**Wokwi · CLI · 实验 MCP** · 需转换或关联、人工确认。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=wokwi&stage=simulation&stages=17&focus=viable#matrix)

- **本步交付** · 仿真配置、用例、固件版本及串口日志。
- **交给下一步** · 回归结果并入投产前审查；同一固件版本进入台架。
- **接入条件** · CLI 和实验 MCP 可执行仿真。平台需把结果关联到需求编号和固件版本。由人确认传感器模型覆盖范围，电源、信号完整性和实际公差安排实测。 [Wokwi · CI 仿真与测试场景](https://docs.wokwi.com/wokwi-ci/getting-started) · [Wokwi · 实验性 MCP](https://docs.wokwi.com/wokwi-ci/mcp-support) · [NASA · 实现、集成与验证](https://www.nasa.gov/reference/5-0-product-realization/)

### 09 投产前审查

**嘉立创 EDA · 扩展** · 需转换或关联、人工确认、接口缺口。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=easyeda&stage=preflight&stages=17&focus=viable#matrix)

- **本步交付** · ERC/DRC/DFM 记录与同版 Gerber、钻孔、BOM、坐标；外壳文件单独打包。
- **交给下一步** · PCB、SMT、3D 打印分别按各自文件要求提交，保留共同修订号。
- **接入条件** · 自动导出后核对位号、数量、板面、旋转、极性和工艺边。官方有客户端 SMT 检查，但公开下单 API 未核实能返回同等的 SMT 审查结果。材料或料号变化后重新审查。 [嘉立创 EDA · 官方 DFM 扩展](https://github.com/easyeda/eext-jlc-order-dfm-checker) · [嘉立创 · DFM 客户端 SMT 检查](https://www.jlc.com/portal/server_guide_41516.html) · [嘉立创 · BOM 与贴片坐标格式](https://www.jlc.com/portal/server_guide_48022.html) · [嘉立创 · 开放平台业务范围](https://www.jlc.com/portal/q7i64392.html) · [DeepDive §03 · 嘉立创订单实测与接口清单](https://xiaopingfeng.com/deepdive/agent-native-services/?v=2#sec-03)

## 打样与验证

### 10 报价与下单

**嘉立创开放平台 · API** · 需转换或关联、人工确认、接口缺口。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=jlc&stage=order&stages=17&focus=viable#matrix)

- **本步交付** · 经确认的报价、制板/贴片/外壳订单号和修订号。
- **交给下一步** · 按业务线查询进度，在项目档案把同一修订号下的订单归并。
- **接入条件** · PCB API 需申请，公开资料列有计价和建单。SMT 创建走网页，文件输入按已授权业务文档处理。付款、审单变更和贴片确认由人承担；国内 PCB 公开证据不足以确认完整校验与撤单闭环。 [嘉立创 · 开放平台业务范围](https://www.jlc.com/portal/q7i64392.html) · [嘉立创 · API 开发指南](https://open.jlc.com/develop-guide) · [嘉立创 · SMT 下单、核料与审单](https://www.jlc.com/portal/server_guide_19858.html) · [嘉立创 3D 打印 · 报价、审核与进度](https://www.jlc.com/portal/q7i28571.html) · [DeepDive §03 · 嘉立创订单实测与接口清单](https://xiaopingfeng.com/deepdive/agent-native-services/?v=2#sec-03)

### 11 制板与加工

**嘉立创开放平台 · API** · 需转换或关联、人工确认。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=jlc&stage=fabrication&stages=17&focus=viable#matrix)

- **本步交付** · 生产和物流状态、供应商订单号、实际到货与批次记录。
- **交给下一步** · 按版本把实物与来料清单交给贴片或整机装配，确认缺件和异常。
- **接入条件** · 获批 API 可查相关订单状态；状态回传后仍需现场收料、识别实物批次及核对版次，外壳与板卡分别查单。 [嘉立创 · 开放平台业务范围](https://www.jlc.com/portal/q7i64392.html) · [嘉立创 3D 打印 · 报价、审核与进度](https://www.jlc.com/portal/q7i28571.html) · [NASA · 实现、集成与验证](https://www.nasa.gov/reference/5-0-product-realization/)

### 12 贴片与装配

**嘉立创开放平台 · API · 网页** · 需转换或关联、人工确认、接口缺口。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=jlc&stage=assembly&stages=17&focus=viable#matrix)

- **本步交付** · 已贴装板卡、已确认的贴片预览、同版外壳和样机编号。
- **交给下一步** · 装配人员核对连接器、固定件和传感器通风，再向首次上电交付实物与装配记录。
- **接入条件** · SMT API 可查状态，贴片方向和替代料需在页面复核。公开资料未确认有接口把贴片和外壳订单合并为带序列号的整机装配记录，编号和关联由项目方维护。 [嘉立创 · 开放平台业务范围](https://www.jlc.com/portal/q7i64392.html) · [嘉立创 · SMT 下单、核料与审单](https://www.jlc.com/portal/server_guide_19858.html) · [嘉立创 · BOM 与贴片坐标格式](https://www.jlc.com/portal/server_guide_48022.html) · [NASA · 实现、集成与验证](https://www.nasa.gov/reference/5-0-product-realization/)

### 13 上电与烧录

**乐鑫 ESP-IDF · MCP · CLI** · 格式可直交、人工确认。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=esp-idf&stage=bringup&stages=17&focus=viable#matrix)

- **本步交付** · 样机编号、已烧录版本、串口启动日志和电源/总线检查记录。
- **交给下一步** · 带相同编号及固件版本的实物和日志交给整机验证。
- **接入条件** · ESP-IDF CLI 或支持该工具的 MCP 可烧录并监视串口。工程师先核对目标端口、电压、限流和接线，确认首次上电条件。 [乐鑫 · ESP-IDF 命令行与 MCP](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/tools/idf-py.html#esp-idf-mcp-server) · [乐鑫 · 构建、烧录和串口监视](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/start-project.html) · [NASA · 产品集成与实物交接](https://www.nasa.gov/reference/5-2-product-integration/)

### 14 整机验证

**乐鑫 ESP-IDF · pytest · CLI** · 需转换或关联、人工确认。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=esp-idf&stage=verify&stages=17&focus=viable#matrix)

- **本步交付** · 按样机编号和固件版本记录的用例结果、原始日志及实测数据。
- **交给下一步** · 把原始证据按工单或样机编号归档，向黑湖提交汇总状态。
- **接入条件** · pytest-embedded 可驱动实板并断言串口结果。整机指标仍需相应仪器或夹具，测试人员判定合格/不良。研发样机还没有试产工单时，先归档结果，待工厂建立编号后再关联。 [乐鑫 · pytest-embedded 测试服务](https://docs.espressif.com/projects/pytest-embedded/en/latest/concepts/services.html) · [黑湖 · 批量报工 API](https://v3-hw-openapi.blacklake.cn/document/api?catId=1650452818128086&detailId=1681109889053798&url=%2Fmfg%2Fopen%2Fv1%2Fprogress_report%2F_progress_report) · [NASA · 实现、集成与验证](https://www.nasa.gov/reference/5-0-product-realization/)

**黑湖智造 3.0 · API** · 需转换或关联、人工确认、接口缺口。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=blacklake&stage=verify&stages=17&focus=viable#matrix)

- **本步交付** · 黑湖质量状态、不良原因、工单与批次关联。
- **交给下一步** · 原始数据保留在项目档案，按相同编号汇入试产质量记录。
- **接入条件** · 需有租户权限及对应工单/工序。批量报工是异步操作，需查询结果；没有公开证据确认串口日志或测试 CSV 可以原样作为质检报告写入。检验员确认判定及需二次确认的记录。 [华为云 · 黑湖 MES 集成接口清单](https://support.huaweicloud.com/bestpractice-sparkpack/zh-cn_topic_0000001443502088.html) · [黑湖 · 批量报工 API](https://v3-hw-openapi.blacklake.cn/document/api?catId=1650452818128086&detailId=1681109889053798&url=%2Fmfg%2Fopen%2Fv1%2Fprogress_report%2F_progress_report) · [乐鑫 · pytest-embedded 测试服务](https://docs.espressif.com/projects/pytest-embedded/en/latest/concepts/services.html)

## 试产与上市

### 15 小批量试产

**黑湖智造 3.0 · API** · 需转换或关联、人工确认、接口缺口。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=blacklake&stage=scale&stages=17&focus=viable#matrix)

- **本步交付** · 冻结的工程版本、试产工单、来料批次、良率与返修记录。
- **交给下一步** · 将工单、批次及最终配置对应到送检样品；同时保留量产候选版本。
- **接入条件** · 已授权工厂可用 API 建工单和报工，试产前先建单。嘉立创供应商订单号到黑湖工单的映射由平台或工厂建立，未核实有现成跨厂接口。由工厂确认排产和取样。 [华为云 · 黑湖 MES 集成接口清单](https://support.huaweicloud.com/bestpractice-sparkpack/zh-cn_topic_0000001443502088.html) · [黑湖 · 批量报工 API](https://v3-hw-openapi.blacklake.cn/document/api?catId=1650452818128086&detailId=1681109889053798&url=%2Fmfg%2Fopen%2Fv1%2Fprogress_report%2F_progress_report) · [嘉立创 · 开放平台业务范围](https://www.jlc.com/portal/q7i64392.html) · [SGS · EMC、产品安全与认证服务](https://www.sgs-cqe.de/en/service-portfolio.html)

### 16 送检与认证

**SGS · 人工 / 实验室** · 需转换或关联、人工确认、接口缺口。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=sgs&stage=compliance&stages=17&focus=viable#matrix)

- **本步交付** · 经确认的送检配置、样品编号、实验室报告和适用的认证材料。
- **交给下一步** · 按产品和工程版本将报告原件、编号及签发方交给量产放行。
- **接入条件** · 实验室与项目方确定市场、项目及样品。未核实可直接创建送检任务并取结构化报告的公共 API；平台须支持人工送检、上传原件及报告适用范围确认。 [SGS · EMC、产品安全与认证服务](https://www.sgs-cqe.de/en/service-portfolio.html) · [NASA · 实现、集成与验证](https://www.nasa.gov/reference/5-0-product-realization/)

### 17 量产放行

**GitHub · REST** · 需转换或关联、人工确认、接口缺口。 [矩阵对应格](https://roam.xiaopingfeng.com/hardware-agent-bench/?platform=github&stage=release&stages=17&focus=viable#matrix)

- **本步交付** · 签字放行记录、带标签的固件、制造包、测试及检测报告。
- **交给下一步** · 冻结版本交给批量生产和后续变更控制，保留对需求、批次和报告的引用。
- **接入条件** · GitHub REST 可发布版本及附件。实体批次获批由质量负责人签字。平台把发布标签、文件指纹、工单/批次和审批记录关联。 [GitHub · Releases 与发布附件 API](https://docs.github.com/en/rest/releases) · [华为云 · 黑湖 MES 集成接口清单](https://support.huaweicloud.com/bestpractice-sparkpack/zh-cn_topic_0000001443502088.html) · [NASA · 实现、集成与验证](https://www.nasa.gov/reference/5-0-product-realization/)

## 供货商与工具目录

| 产品入口 | 角色 | 本轮定位 | MCP / API | 官方资料 |
| --- | --- | --- | --- | --- |
| 嘉立创 EDA | 电子设计 | 可行路线 | 本地 / 扩展 API | [嘉立创 EDA · 命令行与 MCP](https://prodocs.easyeda.com/cn/api/guide/cli.html) |
| 嘉立创开放平台 | PCB / SMT / 3D 打印 | 可行路线 | 未找到 / 审批开放 | [嘉立创 · 开放平台业务范围](https://www.jlc.com/portal/q7i64392.html) |
| 黑湖智造 3.0 | 工厂 MES / 生产协同 | 可行路线 | 有指南 · 待验 / 租户接入 | [黑湖 · OpenAPI MCP 接入指南](https://v3-hw-openapi.blacklake.cn/document/mcp) |
| Hi3D | 图生 3D / 网格资产 | 可行路线 | 托管 / 自助密钥 | [Hi3D / Hitem3D · MCP 接入指南](https://docs.hi3d.ai/en/mcp-tools) |
| 华秋 KiCad | 电子设计 / DSH | 对照候选 | 曾内置 · 待验 / IPC API · CLI | [华秋 KiCad · 10.0.0 发布说明](https://kicad.eda.cn/docs/posts/KiCad-10.0.0-Release.html) |
| 华秋 PCB | PCB / PCBA / DFM | 对照候选 | 未找到 / 审批开放 | [华秋 · PCB API 合作公告](https://www.hqpcb.com/help/p_1867.html) |
| PCBWay | PCB / SMT · 对照 | 对照候选 | 未找到 / 合作伙伴 | [PCBWay · 合作伙伴测试接口](https://api-partner.pcbway.com/Help) |
| Slant 3D | FDM 打印 · 对照 | 对照候选 | 托管 · 免密钥 / 独立 REST | [Slant 3D · 公共 MCP 工具目录](https://www.slant3d.com/mcp-server) |
| GitHub | 需求与版本管理 | 可行路线 | 托管 / 本地 / REST | [GitHub · 官方 MCP 服务与 Issues 工具](https://github.com/github/github-mcp-server) |
| KiCad | 开源电子设计 | 对照候选 | 未找到 / IPC API · CLI | [KiCad 10 · CLI、规则检查与导出](https://docs.kicad.org/10.0/en/cli/cli.html) |
| FreeCAD | 参数化机械 CAD | 可行路线 | 未找到 / 本地 Python | [FreeCAD · 参数化设计和 STEP 支持](https://www.freecad.org/features) |
| 乐鑫 ESP-IDF | ESP32 固件与实板测试 | 可行路线 | 本地 / 本地 CLI | [乐鑫 · ESP-IDF 命令行与 MCP](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/tools/idf-py.html#esp-idf-mcp-server) |
| Wokwi | 嵌入式仿真与 CI | 可行路线 | 本地 · 实验性 / CLI | [Wokwi · CI 仿真与测试场景](https://docs.wokwi.com/wokwi-ci/getting-started) |
| 立创商城 | 国内元器件与 BOM 配单 | 可行路线 | 未找到 / 商城端待核实 | [立创商城 · 新版 BOM 智能云表](https://www.szlcsc.com/news/16581.html) |
| DigiKey | 全球元器件分销 | 对照候选 | 未找到 / OAuth REST | [DigiKey · 产品搜索 V4](https://developer.digikey.com/products/product-information-v4/productsearch/keywordsearch) |
| Saleae Logic 2 | 台架波形与总线测试 | 对照候选 | 未找到 / 本地 Python | [Saleae · 自动采集、分析与导出](https://www.saleae.com/support/extensions-api/automation-api/automation) |
| SGS | 第三方检测与认证服务 | 可行路线 | 未找到 / 业务接口待核实 | [SGS · EMC、产品安全与认证服务](https://www.sgs-cqe.de/en/service-portfolio.html) |
| 华秋 3D 打印 | 结构件与小批量打印 | 对照候选 | 未找到 / 业务接口待核实 | [华秋 3D 打印 · 在线报价与文件格式](https://www.hq3dp.cn/quote) |
