# 句间：英语语法分析 JSON 规范

版本：`1.0.0` · Profile：`sentence-lab-pedagogical-en-v1` · 状态：设计稿

本规范定义 AI / 分析服务与前端之间的交换格式。机器结构使用 JSON Schema Draft 2020-12；跨字段约束和语言学口径由本文补充。关键词“必须”“不得”为协议约束，“建议”为可选指导。

本次交付只新增规范、Schema、生成提示词和示例，不改造现有渲染器，不接入模型。示例是设计样本，未运行 Schema 验证、自动化测试或独立语言学审校。

## 1. 文件入口

| 文件 | 用途 |
|---|---|
| [grammar-analysis.schema.json](grammar-analysis.schema.json) | 可供校验器使用的完整机器结构定义 |
| 本文 | 语法口径、字段含义、跨字段约束、渲染与版本协议 |
| [ai-generation-prompt.md](ai-generation-prompt.md) | 给模型的生成约束模板 |
| [examples/01-simple-svo.json](examples/01-simple-svo.json) | 名词短语、状语、分层展示、可选 UD |
| [examples/02-recursive-reason.json](examples/02-recursive-reason.json) | 主句 → 原因从句 → 形容词短语，三个独立分析层 |
| [examples/03-fused-relative.json](examples/03-fused-relative.json) | What he said 的外层主语与内层宾语关系 |
| [examples/04-ambiguous-attachment.json](examples/04-ambiguous-attachment.json) | 介词短语附着歧义，两个完整替代分析 |
| [examples/05-unsupported.json](examples/05-unsupported.json) | 多句输入，明确不支持 |
| [examples/06-partial-fragment.json](examples/06-partial-fragment.json) | 片段的局部分析，不补写缺失句子 |

## 2. 理论依据与协议边界

### 2.1 借鉴什么

- **成分结构**：词组成短语，短语与从句组成更大的结构，支持递归展开。参考 [NLTK 第 8 章](https://www.nltk.org/book/ch08.html)。
- **形式与功能分离**：`category` 是结构类别，边上的 `function` 是子成分相对于父成分的功能。参考 [UCL 的语法教学材料](https://discovery.ucl.ac.uk/10107837/1/Aarts_Making%20grammar%20meaningful%20Cushing%20and%20Aarts%202019.pdf)。
- **中心词、补足与修饰关系**：补足语并不等于教学标签里的“宾补”；成分能否省略不能仅凭词类判断。参考 [Huddleston 与 Pullum 的配套资料](https://pullum.ppls.ed.ac.uk/grammar/exx_ch4.html)。
- **可选依存层**：采用 [UD v2 的关系标签](https://universaldependencies.org/u/dep/)，独立于成分树；参考 [UD 论文](https://aclanthology.org/2021.cl-2.11/) 和 [CoNLL-U 说明](https://universaldependencies.org/format.html)。
- **结构校验**：采用 [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core)。

这是应用自己的教学交换格式，不是 UD、Penn Treebank 或剑桥语法的官方 JSON 标准，也不声称精确实现任何单一理论。默认把从句组织成主语、动词性谓语、宾语等可视成分，属于教学用的扁平从句层；它不等于标准的 `S → NP VP` 树。不得把教学树的每个子节点机械转换成 UD 依存。

### 2.2 覆盖范围

一份文档分析**一条英语句子或片段**，允许句内并列、从属、非谓语、被动、疑问、否定、倒装、关系结构及可解释的省略。不保证模型能正确分析这些现象；不能可靠处理时使用 `partial` 或 `unsupported`。

- 主教学入口保留五种句型；补充 `SVA/SVOA/other/undetermined`，避免强套五种。
- 同一原句最多四种完整替代分析，服务于真实歧义。
- 句法类别是有限词表，不允许模型临时创造枚举值。
- 不包含段落篇章分析、语音韵律、音标、词汇课程、HTML、CSS、坐标或运行时 UI 状态。
- 不支持直接交换 UD enhanced 空节点图。本版可选 UD 层只表示 basic tree；需要增强依存时另升级协议。

“可表示”不等于“当前前端已支持”：当前 `app.js` 仍使用旧的 `lessons` 数据，不能直接载入本格式。

## 3. 整体结构

```text
Document
├── source：唯一原文与偏移单位
├── tokens：原文切分与字符范围，所有分析共用
├── analyses[]：相互独立的候选解读
│   ├── rootNodeId
│   ├── nodes[]：成分树节点表
│   │   └── children[]：引用子节点，并声明其相对功能
│   ├── relations[]：修饰、指代等解释关系
│   ├── teachingPlans[]：每一层自己的骨骼与展开阶段
│   └── dependencies?：可选 UD 基本依存树
├── preferredAnalysisId：默认展示方案，不代表唯一真解
├── issues[]：歧义、缺上下文、不支持等信息
└── provenance?：来源与审校状态
```

使用节点表与 ID 引用而非重复嵌套对象，便于教学步骤、修饰关系和歧义分析引用。**节点表仍须组成一棵树**，不允许靠重复父节点表达共享成分；共享、指代、空位等另用关系表示。

一个关键表示如下：

```json
{
  "id": "np_boy",
  "category": "noun_phrase",
  "tokenIds": ["t1", "t2", "t3"],
  "children": [
    {"nodeId": "det_the", "function": "determiner", "necessity": "required"},
    {"nodeId": "adj_little", "function": "modifier", "necessity": "optional"},
    {"nodeId": "noun_boy", "function": "head", "necessity": "required"}
  ],
  "explanation": {"summary": "中心词为 boy，little 修饰 boy。"}
}
```

这只是节点片段，不是完整文档。该节点是否作主语，由其父节点的 `children` 边声明，不能在节点自己身上同时写 `subject` 和 `noun_phrase`。

## 4. 顶层字段

| 字段 | 必填 | 含义 |
|---|---|---|
| `schemaVersion` | 是 | 固定 `1.0.0` |
| `profile` | 是 | 固定 `sentence-lab-pedagogical-en-v1`，锁定教学分析口径 |
| `source` | 是 | 原句、语言、偏移单位 |
| `status` | 是 | `complete / partial / unsupported` |
| `tokens` | 是 | 按原文顺序排列的表层 token |
| `analyses` | 是 | 候选分析，最多 4 个 |
| `preferredAnalysisId` | 是 | 可显示方案 ID；不支持时必须为 `null` |
| `issues` | 是 | 没有问题时为 `[]` |
| `provenance` | 否 | 来源信息；必须如实说明，不能让模型自称人工审校 |

状态语义：

- `complete`：至少一个完整结构，所有原文 token 都有归属；可以存在多解、警告，**不等于已证明语法正确**。
- `partial`：至少一个可展示的局部分析，并至少一条 issue；不明部分仍用 `fragment/unknown` 明确覆盖，不能静默丢词。
- `unsupported`：`analyses=[]`，`preferredAnalysisId=null`，至少一条 issue。不输出猜测的树。可保留已可靠得到的 tokens，也可为空。
- 已出现 `error` 级 issue 时不得标为 `complete`；存在未解决的 `unknown` 功能或 `undetermined` 句型时通常应为 `partial`，例外必须解释。

可选字段不适用时省略，集合型必填字段无内容时用 `[]`；除 Schema 明确允许处，不使用 `null`、空字符串或占位单词 `N/A`。

## 5. 原文与 token

### 5.1 唯一文本来源

`source.text` 不得修正大小写、拼写、空格、Unicode 正规化或标点。校正建议只能放进 issue。每个 token：

| 字段 | 含义 |
|---|---|
| `id` | 文档内唯一 ID |
| `text` | 原文片段，必须逐字符一致 |
| `range.start/end` | UTF-16 code unit 的左闭右开范围 |
| `kind` | `word / punctuation / symbol` |

前端可用 `source.text.slice(start, end)` 取原文。Python 不能直接用 Unicode 字符数作为 JS 偏移；可用 `len(prefix.encode('utf-16-le')) // 2` 转换。即使原句是英语，emoji 等也会影响偏移。

token 范围必须不重叠、严格按原序、覆盖全部非空白字符；空白留在原文，不成为 token。句末标点也必须有 token 和树节点。字符串里的撇号、连字符是否拆开，必须遵守以下固定约定：缩约形式可以拆分相邻片段，连字符可以作为标点，但不得重写表面字形。

例如 `can't` 可切为 `ca` 与 `n't`，范围分别为 `[0,2)`、`[2,5)`；词元可另记为 `can` 与 `not`。不允许把原文不存在的 `can` 当作表层 token.text。服务接入时应固定一个 tokenizer 版本，不要让每次请求任意改变切分政策。

### 5.2 节点覆盖与不连续结构

节点不再重复保存 `text` 或字符偏移，只保存 `tokenIds`。其文本、范围都由 tokens 派生，避免多个字段互相矛盾。

- tokenIds 始终按原文顺序、无重复。
- 连续片段使用原文范围恢复空格。
- 不连续成分以多个有序片段显示，不得用最小 start / 最大 end 包住不属于该节点的词。
- 用户原句显示始终忠于 source；骨骼视图是筛选视图，不伪装为改写后的原句。

## 6. 成分节点与功能边

### 6.1 节点类别 `category`

| 枚举 | 含义与约束 |
|---|---|
| `word` | 词级叶子，至少一个 token，必须有 lexical，无 children |
| `punctuation` | 标点叶子，不承担主谓宾功能 |
| `noun_phrase` | 名词短语，内部可有 head、determiner、modifier 等 |
| `verb_group` | 教学动词组：助动词、否定词、实义动词等；不包含宾语 |
| `verb_phrase` | 较宽的动词短语，可包含补足语；用于需要这种分析的结构，不可与 verb_group 混称 |
| `adjective_phrase` | 形容词短语 |
| `adverb_phrase` | 副词短语 |
| `prepositional_phrase` | 介词短语，通常由介词 head 与其 complement 构成 |
| `clause` | 从句/小句，必须有 clause 特征，包含主句与嵌套从句 |
| `coordination` | 并列结构，至少两个 conjunct 子边，可带 coordinator |
| `fragment` | 无法构成或无法确认完整小句的结构 |
| `gap` | 不发音的空位/省略节点；tokenIds 与 children 必须为空，必须解释依据 |

除叶子与 gap 外，节点必须有子节点。`headNodeId` 可指向此节点范围内的中心后代；没有确定中心时省略。它是该成分分析的中心，不等于 UD head。

`construction` 可进一步标记：`ordinary / content_clause / relative_clause / fused_relative / adverbial_clause / infinitival / participial / gerund_participial / comparative / existential / cleft / inversion / ellipsis / other`。它描述结构，不替代语法功能。

### 6.2 功能 `children[].function`

| 分组 | 枚举及含义 |
|---|---|
| 小句核心 | `subject` 主语；`predicate` 动词性谓语；`direct_object` 直接宾语；`indirect_object` 间接宾语 |
| 补足成分 | `subject_complement` 表语；`object_complement` 宾补；`oblique_complement` 斜格/状语性补足语；`clausal_complement` 小句补足语；`complement` 其他局部补足成分 |
| 修饰 | `adjunct` 小句附加语；`modifier` 短语内部修饰语；`appositive` 同位成分 |
| 短语内部 | `head` 中心成分；`determiner` 限定成分；`auxiliary` 助动成分；`negator` 否定成分；`particle` 小品词 |
| 连接 | `marker` 从属标记；`coordinator` 并列连接；`conjunct` 并列项 |
| 其他 | `discourse` 话语成分；`vocative` 呼语；`supplement` 补充成分；`expletive` 虚位成分；`punctuation` 标点；`unknown` 暂不能确定 |

`predicate` 在本 profile 专指教学中的动词或动词组，不是包含宾语的宽泛 VP。典型主谓宾教学层应将宾语和 predicate 并列。使用 `verb_phrase` 时必须在解释中说明结构层级，不重复把同一宾语挂到 VP 与主句上。

词类不等于功能：副词可能是修饰语，介词短语可能是补足语；主语也不总是动作发出者。不要把“主语=施事”写成协议规则。

### 6.3 必要性 `necessity`

- `required`：在当前词义、构式和解释下，结构需要保留。
- `optional`：可选的补充成分，但删除仍可能改变信息或语用。
- `context_dependent`：取决于上下文、省略许可等。
- `not_applicable`：例如标点、并列结构标记的非删除判断。
- `unknown`：没有可靠判断。

不得用简单可删测试作为唯一依据。`She put the book on the table.` 中地点补足成分应保留，不能因为其形式是 PP 就归为可删修饰。

### 6.4 词汇信息

`lexical.upos` 借用 UD 通用词类词表，但单独提供词类不表示整份分析遵循 UD。可选 lemma 与 morphology 描述词元和形态。`morphology` 支持 tense、verbForm、number、person、degree、case；不适用字段省略。

## 7. 从句特征与句型

`clause` 必填：form、finiteness、voice、polarity、pattern、patternExplanation。可选 tense、aspect。枚举见 Schema。

| pattern | 教学含义 |
|---|---|
| `SV` | 主谓 |
| `SVO` | 主谓宾 |
| `SVC` | 主系表 |
| `SVOO` | 主谓双宾 |
| `SVOC` | 主谓宾补 |
| `SVA` | 谓语需要状语性补足成分 |
| `SVOA` | 动词、宾语之外还需要状语性补足成分 |
| `other` | 已有明确分析但不适用这些模式 |
| `undetermined` | 证据不足，不能判定 |

pattern 是教学归纳，**不控制原文顺序**。疑问、倒装、被动、前置成分、祈使省主语时必须在 patternExplanation 解释映射；不能把原文重新排列为 SVO。非谓语结构没有确定的主语时，也不得为了凑句型造词。

`What he said` 的口径：传统教学可标为“主语从句”，但现代分析会涉及融合关系结构。本 profile 用 `category=clause, construction=fused_relative` 承载教学拆解，外层边为 subject，内层 What 的边为 direct_object。这是明确的教学简化，不声称等同所有理论对 fused relative 的类别划分。

关系从句的空位可用 gap 节点和 relative_reference 关系表示；不允许让 antecedent 的同一词级节点同时出现在树的两个位置。对存在争议的空位分析应标明 uncertainty，而非必须输出 gap。

## 8. 额外关系与 UD

### 8.1 解释关系 `relations`

每条关系包含 ID、type、sourceNodeId、targetNodeId、explanation，可选 certainty。方向约定：

| type | source → target |
|---|---|
| `modifies` | 修饰语 → 被修饰词/短语/事件小句 |
| `complements` | 补足成分 → 它补足的中心成分 |
| `corefers` | 指代表达 → 本分析选定的先行表达；显示上可视为对称 |
| `relative_reference` | 关系成分/关系空位 → 先行项 |
| `understood_subject` | 非显式主语 gap → 控制它的节点 |
| `ellipsis_resolution` | 省略 gap → 可恢复的已出现结构 |
| `scope` | 否定/量化等表达 → 其作用范围 |

只引用本候选分析内的节点，不凭空指向上下文外的词。缺少先行项时在解释中说明，不伪造节点。关系允许跨树层级；它不是 DOM 父子关系，不参与折叠层级计算。

### 8.2 可选 `dependencies`

`scheme=ud-v2-basic`，包含独立 words 与 edges：

- words 记录 ID、form、表层 tokenIds、upos，可选 lemma/features。
- edges 用 `headWordId → dependentWordId` 表示依存；唯一 root 的 headWordId 为 null。
- 基础标签固定为 UD v2 的 37 种，允许 `基础标签:subtype`。Schema 只验证形状；subtype 是否属于英语 UD 规范仍需语义校验。
- 每个 word 必须且只能有一个入边，包括 root；所有词连通，无环，不能自指。
- 多个 UD word 可映射同一表层 token，支持缩约形式；form 可以是该层的规范表示，不用于替换 source。
- 不是把教学层 subject 节点改名为 nsubj。尤其系词结构和融合关系结构，必须独立分析。
- 未提供时省略整个 dependencies，不用空图假装解析完成。

## 9. 教学计划：骨骼、血肉与递归展开

每份 `teachingPlan` 属于一个分支节点 ownerNodeId，最多一份。未提供计划的分支，前端默认显示其全部直接子节点；仍可展开。

每个 stage：

| 字段 | 规则 |
|---|---|
| `id` | 同一 plan 内唯一 |
| `kind` | skeleton / expansion / complete |
| `title` | 简短中文阶段名 |
| `visibleNodeIds` | owner 的直接子节点，按原顺序排列 |
| `focusNodeIds` | 可选，必须是本阶段 visibleNodeIds 的子集 |
| `explanation` | 当前层的解释 |
| `omissions` | 未显示的直接子节点及省略依据 |

严格规则：

1. 仅一阶段时必须为 complete；多阶段时首项 skeleton，末项 complete，中间 expansion。
2. 相邻阶段可见节点集合必须单调增加，不重排、不替换、不改写源句。完整阶段包含全部直接子节点且 omissions 为空。
3. 每个直接子节点必须恰好出现在 visibleNodeIds 或 omissions 之一，不能两处同时出现。
4. `optional_modifier` 仅能省略功能为 modifier 或 adjunct 且 necessity=optional 的节点。
5. `teaching_scaffold` 用于教学上暂时隐藏引导词等；本版只允许 marker/coordinator/punctuation，必须解释“不代表原句可删除”。主语、谓语、宾语、表语、宾补等核心成分不得通过此理由隐藏。
6. 原文标点默认保留；若为避免局部展示歧义而隐藏，也必须显式声明。
7. 计划只控制当前层。主语短语展开与否、内部停在哪一阶段，由前端单独保存；不为主句每一阶段复制整棵树。
8. 译文属于整个候选分析，不自动当作骨骼阶段的精确译文；界面应标注“原句译文”。1.0 不要求 AI 为每个删减视图编造新译文。
9. gap 没有原文字符；完整分析时可以用空位符号展示，必须与真实词视觉区分，不加入 source。

例如 `because he was very hungry`：外层整体是 adjunct；内部把 because 标为 marker，he 为 subject，was 为 predicate，very hungry 为 subject_complement；再点 very hungry，展开 very → modifier 与 hungry → head。三层共用同一个渲染器，但分别保存阶段和选择状态。

## 10. 跨字段语义约束

以下不能仅靠标准 JSON Schema 完整检查，未来接入时需要单独的语义检查器。**Schema 通过不等于它们通过。**

### 原文层

- token ID 唯一；`0 <= start < end <= source.text.length`（UTF-16）。
- 原文切片等于 token.text；token 按位置排序、不重叠、覆盖全部非空白字符。
- token.kind 与其表面类别一致；修正意见不能覆盖原文。

### 分析层

- analysis ID 文档内唯一；preferredAnalysisId 指向现存方案。
- node ID 在每个 analysis 内唯一；不同 analysis 可复用 ID，切换时不能混用节点表。
- rootNodeId 存在；root 只能是 clause、coordination 或 fragment。
- 除 root 外每个节点恰好有一个父节点；无环、无孤立节点、不能引用自己。
- 每个 token 都由恰好一个 word/punctuation 叶子覆盖；gap 不消费 token。
- 非叶节点 tokenIds 等于全部直接子节点 tokenIds 的有序并集；兄弟节点不得重复消费 token；root 覆盖文档全部 tokens。
- children 按最早出现位置排序；不连续节点的内部文本仍按各 token 原序呈现。gap 的相对位置由 children 数组定义。
- lexical 只能用于 word，clause 特征只能用于 clause，gap 信息只能用于 gap。
- headNodeId 若有，必须是自身的严格后代，不允许跨分支。
- form、finiteness、voice、pattern、function 与原句和解释一致；Schema 不承担这个语言学判断。
- relations ID 在当前 analysis 内唯一；端点都存在，不得自指；词表及方向服从第 8 节。

### 计划、依存与问题层

- 教学 plan 的 owner 存在且有 children，每个 owner 最多一份。
- 阶段 ID 唯一；引用、可见集合、遗漏集合和阶段顺序服从第 9 节。
- UD word ID 唯一、token 引用有效，所有表层 token 都有对应 UD word；依存层树规则服从第 8 节。
- issue.tokenIds 和 analysisIds 均引用现存对象；[] 表示全局问题。
- partial/unsupported 必须说明实际限制，不用无关 warning 凑字段。
- provenance.human_reviewed 只能来自已发生的人类审核；AI 不得自行设置。

### 建议的本地错误码

这些是未来校验服务的错误码，**不是本次 AI JSON 的字段**：

| 错误码 | 含义 |
|---|---|
| `SCHEMA_INVALID` | 类型、必填、枚举或额外字段错误 |
| `VERSION_UNSUPPORTED` | 不支持的版本/profile |
| `TOKEN_RANGE_INVALID` | 偏移、切片或原文覆盖错误 |
| `DUPLICATE_ID` / `REFERENCE_NOT_FOUND` | 唯一性或引用错误 |
| `TREE_INVALID` / `COVERAGE_INVALID` | 成分树、重复词或覆盖问题 |
| `PLAN_INVALID` / `UNSAFE_OMISSION` | 阶段引用、顺序或必要成分省略问题 |
| `DEPENDENCY_INVALID` | 可选 UD 树错误 |
| `LIMIT_EXCEEDED` | 本地资源边界超出 |

校验错误返回给调用方或模型修复流程，不要直接当成用户输入的语法错误。渲染前失败就保留原句和错误说明，不显示半棵看似正确的树。

## 11. 前端渲染契约

1. 验证版本、Schema、语义约束；按 preferredAnalysisId 选择候选。
2. 用节点索引构建树；root 显示当前阶段的直接子成分。
3. 点击有 children 的色块，在下方建立相同分析面板；连线从父色块底边中心到子面板顶边中心。
4. 展开连线表示“组成/展开”，依存或修饰连线表示“关系”，必须用不同样式或独立模式，不能混淆。
5. 外层颜色由父边 function 决定；内部类别决定相近色或标签；内部再次遇到 subject/predicate 等时使用它在当前层的颜色。
6. head、determiner、modifier 等局部功能可继承父层色系，但必须显示自己的真实功能标签，不能让内部 little 的标签变成主语。
7. gap、unknown 和不确定解释应有明确标记，不偷偷补全文本。
8. 坐标、颜色、字号、箭头路径、选中状态、折叠状态、当前阶段均由前端决定，不写入分析 JSON。
9. 所有模型文本按纯文本处理，不解释为 HTML，不执行代码；source 和 explanation 都是外部数据。
10. 默认折叠深层结构；建议一次只展开用户选中的路径，避免长句展开后失控。

建议的功能颜色映射：

| 功能 | 现有主色 |
|---|---|
| subject | subject 蓝色 |
| predicate | verb 暖色 |
| direct_object / indirect_object | object 黄色 |
| subject_complement / object_complement | complement 紫色 |
| adjunct | modifier 绿色 |
| oblique_complement / clausal_complement | 补足语色系，保留专用标签，不冒充可删状语 |
| 局部 head/determiner/modifier 等 | 继承所属短语色系 + 独立标签 |
| 标点、连接词、unknown | 中性色或上下文色，不能强行归入五种主色 |

运行时状态建议以 `{analysisId, ownerNodeId}` 为键，保存 stageId、selectedNodeId、expandedNodeIds。切换候选分析后清除或分区保存状态，不能只靠同名 node ID 复用。

## 12. AI 生成与接入流程

推荐顺序：原文接收 → 稳定 tokenizer → AI 按约束分析 → JSON Schema 校验 → 引用与覆盖等语义校验 → 渲染。

tokenizer 不是本次实现的一部分。若由 AI 一并输出 tokens，也必须在接入时复核原文切片。更稳妥的方案是应用提供已经固定的 tokens，让 AI 只生成分析，并原样返回 source/tokens。

- 第一版可不生成 dependencies；减少生成负担和体系混淆。
- 严格结构化输出接口对 Schema 的支持因供应商而异，不保证支持本规范的全部 `$ref`、`if/then`、`contains` 等关键字。
- 如需供应商兼容 Schema，应从本规范派生受限的传输结构，应用侧再执行权威 Schema 和语义检查，不为了模型能力删掉核心规则。
- 可限制修复请求次数，例如最多 2 次；仍失败则展示“暂时无法完成可靠分析”，保留原句，不自动修补出一个似是而非的结果。
- 示例不代表可靠性评测。自评 certainty 不得转换成“正确率 95%”之类声明。

## 13. 资源边界、版本与演进

Schema 限制：source 最多 4096 个 JSON Schema 字符，tokens 最多 512，候选最多 4，每个候选 nodes 最多 2048，每层计划最多 32 阶段，issues 最多 64。JSON Schema 字符长度按 Unicode 字符语义，与 UTF-16 偏移不同。

接入方额外限制：建议原始响应最多 2 MiB，成分树最大深度 32；超限应返回校验错误，不静默截断。深度属于跨节点图检查，不由当前 Schema 直接执行。

- version 与 profile 同时锁定；渲染器必须明确声明支持的组合。
- 严格拒绝未知字段，不保留自由 `extensions` 袋；避免模型把样式、脚本或不受控标签混入协议。
- 增加字段或枚举需要发布新 Schema 并更新消费者；由于 additionalProperties=false，旧消费者不应默许新版本。
- 语义或结构不兼容变更升级 major；兼容的约束澄清可用 patch，但仍需记录。
- 未来可单独设计篇章、多语言、增强依存及人工纠错 patch 协议，不挤进本版本。

## 14. 与现有原型的迁移映射

| 旧字段 | 新规范 |
|---|---|
| `text` | 从 tokenIds + source 派生 |
| `role` | 父节点 children[].function |
| `type` | category + lexical.upos / construction，再由前端生成中文标签 |
| `description` / `nestedNote` | explanation.summary/details |
| `children` 对象数组 | children 引用 + nodes 表 |
| `analysisStages` | teachingPlans |
| `added` 字符串匹配 | 相邻阶段新增节点引用，不靠字符串查找重复词 |
| `formula` | clause.pattern + 本层功能边推导 |
| `translation` | analysis.translation |
| selected / expanded 等 | 留在前端状态，不由 AI 生成 |

迁移时要为旧的 verb、object、complement 区分 predicate、direct_object、indirect_object、subject_complement、object_complement；不能只做字符串替换。递归面板交互和父底边中心到子顶边中心的连线可以沿用。
