const roles = {
  subject: { label: '主语', symbol: 'S' },
  verb: { label: '谓语', symbol: 'V' },
  object: { label: '宾语', symbol: 'O' },
  complement: { label: '补语', symbol: 'C' },
  modifier: { label: '状语', symbol: 'A' },
};
const part = (text, role, type, description, options = {}) => ({ text, role, type, description, ...options });
const subject = (text, type, description, options) => part(text, 'subject', type, description, options);
const verb = (text, description, options) => part(text, 'verb', '动词', description, options);
const object = (text, type, description, options) => part(text, 'object', type, description, options);
const modifier = (text, type, description, options) => part(text, 'modifier', type, description, options);
const complement = (text, type, description, options) => part(text, 'complement', type, description, options);
const stage = (label, translation, parts) => ({ label, translation, parts });

const bird = subject('Birds', '名词', 'Birds 是动作 fly 的发出者，回答“谁在飞？”这个问题。');
const fly = verb('fly', 'fly 表示“飞”，是不及物动词，可以独立作谓语，不需要宾语。');
const boy = subject('The boy', '名词短语', '中心词是 boy，The 限定我们谈论的是哪个男孩。整个名词短语作主语。');
const ate = verb('ate', 'ate 是 eat 的过去式，表示“吃了”。这里是及物动词，后面接吃的对象。');
const apple = object('an apple', '名词短语', 'an apple 是动作 ate 的对象，回答“吃了什么？”这个问题。');
const littleBoy = subject('The little boy', '名词短语', 'little 是形容词，作定语修饰中心词 boy。加上修饰后，整个短语仍然是主语。', {
  added: ['little'], children: [part('The', 'subject', '限定词', 'The 限定 boy。', { label: '限定语' }), part('little', 'subject', '形容词', 'little 描述男孩的特征，作定语。', { label: '定语' }), subject('boy', '名词', 'boy 是整个主语短语的中心词。', { label: '中心词' })],
  nestedNote: '这是名词短语的内部结构。限定词和形容词都围绕中心词 boy，并非另外一组主谓宾。',
});
const jacketBoy = subject('The little boy in the blue jacket', '名词短语', 'in the blue jacket 是介词短语，作后置定语修饰 boy，说明“穿蓝色夹克的那个男孩”。', {
  added: ['little', 'in the blue jacket'], children: [part('The', 'subject', '限定词', 'The 限定 boy。', { label: '限定语' }), part('little', 'subject', '形容词', 'little 修饰 boy。', { label: '定语' }), subject('boy', '名词', 'boy 是主语短语的中心词。', { label: '中心词' }), part('in the blue jacket', 'subject', '介词短语', '整个介词短语作后置定语，修饰 boy。', { label: '后置定语' })],
  nestedNote: '修饰成分可以出现在中心词前面或后面；整个主语短语仍然回答“谁吃了苹果？”。',
});
const quickly = modifier('very quickly', '副词短语', 'very 修饰 quickly；整个副词短语作方式状语，说明吃的速度。');
const she = subject('She', '代词', 'She 是人称代词，在句子中作主语。');
const is = verb('is', 'is 是系动词，连接主语和描述主语的表语。', { label: '系动词' });
const happy = complement('happy', '形容词', 'happy 作表语，描述主语 She 的状态。', { label: '表语' });
const he = subject('He', '代词', 'He 作主语，表示给东西的人。');
const gave = verb('gave', 'gave 是 give 的过去式，可以接两个宾语：给谁，以及给什么。');
const me = object('me', '代词', 'me 作间接宾语，表示接受者，即“给谁”。', { label: '间接宾语' });
const book = object('a book', '名词短语', 'a book 作直接宾语，表示被给予的东西，即“给什么”。', { label: '直接宾语' });
const we = subject('We', '代词', 'We 作主语，表示发出这个称呼的人。');
const call = verb('call', 'call 在这里表示“称呼”，其后需要宾语和说明称呼的宾语补足语。');
const him = object('him', '代词', 'him 是 call 的宾语，表示被称呼的人。');
const tom = complement('Tom', '专有名词', 'Tom 作宾语补足语，补充说明 him 的称呼；him 和 Tom 指同一个人。', { label: '宾语补足语' });
const whatClause = subject('What he said', '主语从句', '整个 What he said 作主句的主语，意思是“他说的话”。内部 What 是 said 的宾语。', {
  children: [object('What', '连接代词', 'What 引导这个名词性从句，同时作 said 的宾语，表示“所说的内容”。'), subject('he', '代词', 'he 是从句内部的主语。'), verb('said', 'said 是从句内部的谓语，宾语 What 位于从句开头。')],
  nestedNote: '外层：整个从句是主语。内层：What（宾语）+ he（主语）+ said（谓语）。按原词序展示，不能把开头的 What 误判成主语。',
});
const surprised = verb('surprised', 'surprised 是主句的谓语，表示“使……吃惊”，后面接受到影响的人。');
const surpriseMe = object('me', '代词', 'me 是主句的宾语，表示感到吃惊的人。');
const reason = modifier('because he was hungry', '原因状语从句', '整个从句修饰主句 ate an apple，解释男孩为什么吃苹果。', {
  children: [part('because', 'modifier', '从属连词', 'because 引导原因状语从句，本身不是从句中的主语、谓语或宾语。', { label: '引导词' }), subject('he', '代词', 'he 是从句的主语，这里指前面的男孩。'), verb('was', 'was 是系动词 be 的过去式。', { label: '系动词' }), complement('hungry', '形容词', 'hungry 作表语，说明 he 的状态。', { label: '表语' })],
  nestedNote: 'because 引导整个原因从句；里面的 he / was / hungry 是主系表结构。外层的状语身份与内层的句子成分同时成立。',
});

const lessons = [
  { id: 'sv', title: '主谓结构', english: 'SUBJECT + VERB', group: '基本句型', description: '谁，做了什么。一个主语和一个谓语，就能构成完整的句子。', formula: ['subject', 'verb'], formulaDescription: '动作本身，意思已经完整', tip: '先找动词，再问“谁在做这个动作”。不及物动词不需要宾语，后面的时间、地点等信息可以是状语。', contrast: 'Birds fly in the sky. 中，in the sky 是地点状语，不是宾语。', stages: [stage('基本骨骼', '鸟儿飞翔。', [bird, fly]), stage('修饰主语', '小鸟飞翔。', [subject('Little birds', '名词短语', 'Little 修饰中心词 birds；整个短语作主语。', { added: ['Little'] }), fly]), stage('添加地点', '小鸟在天空中飞翔。', [subject('Little birds', '名词短语', 'Little birds 是主语，中心词为 birds。', { added: ['Little'] }), fly, modifier('in the sky', '介词短语', 'in the sky 作地点状语，说明飞翔发生在哪里。')])] },
  { id: 'svo', title: '主谓宾结构', english: 'SUBJECT + VERB + OBJECT', group: '基本句型', description: '谁，做了什么，作用于什么。看清动作与对象之间的关系。', formula: ['subject', 'verb', 'object'], formulaDescription: '动作有一个明确的对象', tip: '先找到谓语动词 ate，再向两边提问：“谁吃？”得到主语；“吃了什么？”得到宾语。修饰语让信息更具体，但不改变这句的核心结构。', contrast: 'little 和 in the blue jacket 都修饰 boy；very quickly 修饰吃这个动作。', stages: [stage('基本骨骼', '那个男孩吃了一个苹果。', [boy, ate, apple]), stage('添加特征', '那个小男孩吃了一个苹果。', [littleBoy, ate, apple]), stage('明确是哪一个', '那个穿蓝色夹克的小男孩吃了一个苹果。', [jacketBoy, ate, apple]), stage('添加方式', '那个穿蓝色夹克的小男孩很快地吃了一个苹果。', [jacketBoy, ate, apple, quickly])] },
  { id: 'svc', title: '主系表结构', english: 'SUBJECT + LINKING VERB + COMPLEMENT', group: '基本句型', description: '主语是什么，或处于什么状态。表语为主语补充描述。', formula: ['subject', ['verb', '系动词'], ['complement', '表语']], formulaDescription: '描述主语的身份或状态', tip: '系动词连接主语与表语。这里的 happy 描述 She 的状态，并不是动作作用的对象。', contrast: 'She is happy. 中 happy 是表语；She likes music. 中 music 才是宾语。', stages: [stage('基本骨骼', '她很开心。', [she, is, happy]), stage('添加程度', '她非常开心。', [she, is, complement('very happy', '形容词短语', 'very 修饰 happy，整个形容词短语作表语。', { label: '表语', added: ['very'] })]), stage('添加时间', '她今天非常开心。', [she, is, complement('very happy', '形容词短语', 'very happy 作表语，描述 She 的状态。', { label: '表语', added: ['very'] }), modifier('today', '副词', 'today 作时间状语，说明这个状态发生的时间。')])] },
  { id: 'svoo', title: '主谓双宾结构', english: 'SUBJECT + VERB + TWO OBJECTS', group: '基本句型', description: '给谁，给什么。一个动作同时关联接受者和被给予的事物。', formula: ['subject', 'verb', ['object', '间接宾语'], ['object', '直接宾语']], formulaDescription: '接受者 + 被给予的东西', tip: '两个宾语分别回答“给谁？”和“给什么？”。间接宾语 me 与直接宾语 a book 并不指同一个对象。', contrast: 'He gave me a book. 也可以表达为 He gave a book to me.，但结构的分析方式有所不同。', stages: [stage('基本骨骼', '他给了我一本书。', [he, gave, me, book]), stage('修饰事物', '他给了我一本有趣的书。', [he, gave, me, object('an interesting book', '名词短语', 'interesting 修饰 book，整个短语仍是直接宾语；因后接元音音素，冠词使用 an。', { label: '直接宾语', added: ['interesting'] })]), stage('添加时间', '他昨天给了我一本有趣的书。', [he, gave, me, object('an interesting book', '名词短语', '整个名词短语是直接宾语。', { label: '直接宾语', added: ['interesting'] }), modifier('yesterday', '副词', 'yesterday 作时间状语。')])] },
  { id: 'svoc', title: '主谓宾补结构', english: 'SUBJECT + VERB + OBJECT + COMPLEMENT', group: '基本句型', description: '动作之后，再补充说明宾语的身份、状态或结果。', formula: ['subject', 'verb', 'object', ['complement', '宾补']], formulaDescription: '补语说明的是宾语', tip: '判断宾补时，可以观察它是否描述或指向前面的宾语。这里 him 和 Tom 是同一个人，Tom 是对 him 的补充说明。', contrast: '双宾语：me ≠ a book；宾语 + 宾补：him = Tom。这是理解这两个例句的一个线索。', stages: [stage('基本骨骼', '我们叫他汤姆。', [we, call, him, tom]), stage('添加频率', '我们通常叫他汤姆。', [we, modifier('usually', '副词', 'usually 作频率状语，位于主语之后、实义动词之前。'), call, him, tom])] },
  { id: 'subject-clause', title: '主语从句', english: 'A CLAUSE AS THE SUBJECT', group: '从句与嵌套', description: '把整个从句放进主语的位置。一个骨骼里，还可以容纳另一个骨骼。', formula: [['subject', '主语从句'], 'verb', 'object'], formulaDescription: '外层主谓宾，内层再拆解', tip: '句子成分说的是“做什么工作”，从句说的是“由什么构成”。What he said 由一个从句构成，在主句中做主语的工作。', contrast: '点击虚线框中的 What he said，查看内部结构。骨骼模式仍保留整个主语从句，因为它本身是必要成分。', stages: [stage('基本骨骼', '他说的话让我吃惊。', [whatClause, surprised, surpriseMe]), stage('添加程度', '他说的话真的让我吃惊。', [whatClause, modifier('really', '副词', 'really 修饰 surprised，强调吃惊的程度。'), surprised, surpriseMe])] },
  { id: 'reason-clause', title: '原因状语从句', english: 'A CLAUSE THAT EXPLAINS WHY', group: '从句与嵌套', description: '在主句外增加原因，从句内部也有自己的主语和谓语。', formula: ['subject', 'verb', 'object', ['modifier', '原因状语']], formulaDescription: '主句骨骼 + 原因', tip: '先读懂 The boy ate an apple，再用“为什么？”连接 because 从句。展开从句后，可以发现它自己的主系表结构。', contrast: '从句整体用绿色标识状语身份；内部的 he、was、hungry 各自使用主语、谓语和表语的颜色。', stages: [stage('基本骨骼', '那个男孩吃了一个苹果。', [boy, ate, apple]), stage('添加原因', '那个男孩因为饿了，吃了一个苹果。', [boy, ate, apple, reason]), stage('修饰主语', '那个小男孩因为饿了，吃了一个苹果。', [littleBoy, ate, apple, reason])] },
];

// 每个展开层都使用相同的分析器，独立保存阶段、选择与展开状态。
littleBoy.analysisStages = [
  stage('短语骨骼', '那个男孩', [littleBoy.children[0], littleBoy.children[2]]),
  stage('添加特征', '那个小男孩', littleBoy.children),
];
jacketBoy.analysisStages = [
  stage('短语骨骼', '那个男孩', [jacketBoy.children[0], jacketBoy.children[2]]),
  stage('添加特征', '那个小男孩', jacketBoy.children.slice(0, 3)),
  stage('添加后置定语', '那个穿蓝色夹克的小男孩', jacketBoy.children),
];
whatClause.analysisStages = [stage('基本骨骼', '他说的话', whatClause.children)];
reason.analysisStages = [
  stage('基本骨骼', '他饿了', reason.children.slice(1)),
  stage('连接主句', '因为他饿了', reason.children),
];

const state = { lesson: 'svo', levels: {} };
const main = document.querySelector('#main');
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const getLesson = () => lessons.find((lesson) => lesson.id === state.lesson);
const kind = (p) => p.type.includes('从句') ? 'clause' : p.type.includes('短语') ? 'phrase' : p.type.includes('代词') ? 'pronoun' : p.type.includes('名词') ? 'noun' : 'word';
const getLevel = (path) => state.levels[path] ||= { stage: 0, selected: 0, expanded: null };
const getStages = (node) => node.stages || node.analysisStages || [stage('完整结构', '', node.children)];
function nodeAt(path) {
  let node = getLesson();
  let parentPath = 'root';
  for (const segment of path.split('-').slice(1)) {
    node = getStages(node)[getLevel(parentPath).stage].parts[Number(segment)];
    parentPath += `-${segment}`;
  }
  return node;
}
function clearDescendants(path) {
  for (const key of Object.keys(state.levels)) if (key.startsWith(`${path}-`)) delete state.levels[key];
}
function markedText(p) {
  let text = escapeHtml(p.text);
  for (const addition of p.added || []) text = text.replace(escapeHtml(addition), `<span class="added-word">${escapeHtml(addition)}</span>`);
  return text;
}
function token(p, index, path) {
  const level = getLevel(path);
  const selected = level.selected === index;
  const open = level.expanded === index;
  const label = p.label || roles[p.role].label;
  return `<button id="token-${path}-${index}" class="token ${p.children ? 'nested' : ''} ${open ? 'expanded-source' : ''} ${selected ? 'selected' : ''}" data-role="${p.role}" data-kind="${kind(p)}" data-part="${index}" aria-label="${escapeHtml(p.text)}，${label}，${p.type}${p.children ? '，点击展开或收起内部结构' : ''}" ${p.children ? `aria-expanded="${open}" ${open ? `aria-controls="panel-${path}-${index}"` : ''}` : `aria-pressed="${selected}"`}><span class="token-text">${markedText(p)}</span><span class="token-label">${label}<em>·</em>${p.type}${p.children ? `<span aria-hidden="true">${open ? '−' : '+'}</span>` : ''}</span></button>`;
}
function detail(p, nested = false) {
  return `<section class="info-card ${nested ? 'nested-detail' : ''}" aria-label="所选成分解释"><h2 class="info-heading"><span class="info-icon">⊙</span>成分放大镜</h2><div class="detail-heading" data-role="${p.role}"><span class="detail-word">${escapeHtml(p.text)}</span><span class="badge">${p.label || roles[p.role].label}</span></div><p>${p.description}</p><div class="detail-meta"><div><span>构成</span>${p.type}</div><div><span>层级</span>${nested ? '当前展开层' : '主句成分'}</div></div></section>`;
}
function analysis(node, path = 'root', depth = 0) {
  const stages = getStages(node);
  const level = getLevel(path);
  const current = stages[level.stage];
  const expanded = level.expanded === null ? null : current.parts[level.expanded];
  const nested = depth > 0;
  const title = nested ? `${node.type} · 内部分析` : '句子解剖台';
  const childPath = `${path}-${level.expanded}`;
  const isClause = node.type?.includes('从句');
  return `<section class="analysis-panel ${nested ? 'nested-analysis' : 'root-analysis'}" id="panel-${path}" data-path="${path}" ${nested ? `data-role="${node.role}"` : ''} aria-label="${title}">
    <div class="lab-toolbar"><div class="lab-title"><span aria-hidden="true">${nested ? '↳' : '⌘'}</span>${title}</div><div class="analysis-actions"><div class="segmented" aria-label="${title}显示模式"><button data-stage="0" class="${level.stage === 0 ? 'active' : ''}" aria-pressed="${level.stage === 0}">基本骨骼</button><button data-stage="${stages.length - 1}" class="${stages.length > 1 && level.stage === stages.length - 1 ? 'active' : ''}" aria-pressed="${level.stage === stages.length - 1}" ${stages.length === 1 ? 'disabled title="当前结构已经是完整骨骼"' : ''}>完整${nested ? '结构' : '句子'}</button></div>${nested ? '<button class="collapse-analysis" data-collapse aria-label="收起这一层分析">收起 ↑</button>' : ''}</div></div>
    ${nested ? `<div class="nested-context"><span class="badge" data-role="${node.role}">外层${node.label || roles[node.role].label}</span><span>${escapeHtml(node.text)}</span></div>` : ''}
    <div class="sentence-area"><div class="sentence" aria-label="${escapeHtml(current.parts.map(p => p.text).join(' '))}">${current.parts.map((p, i) => token(p, i, path)).join('')}${nested ? '' : '<span class="punctuation">.</span>'}</div><p class="translation">${current.translation}</p><p class="sentence-hint">点击色块查看成分 · 带 + 的色块可以继续向下展开</p></div>
    ${expanded?.children ? `<div class="branch-link" data-role="${expanded.role}"><span>展开${expanded.type}</span></div>${analysis(expanded, childPath, depth + 1)}` : ''}
    <div class="layer-controls"><div class="layer-label"><span>${nested ? '分析当前内部结构' : '逐层搭建这个句子'}</span><span>${level.stage + 1} / ${stages.length} 层</span></div><div class="layer-buttons">${stages.map((s, i) => `${i ? '<span class="layer-arrow" aria-hidden="true">→</span>' : ''}<button class="layer-button ${level.stage >= i ? 'active' : ''}" data-stage="${i}" aria-pressed="${level.stage === i}"><span class="step">${String(i + 1).padStart(2, '0')}</span>${s.label}</button>`).join('')}</div>${stages.length === 1 ? '<p class="minimal-note">这个结构已是基本骨骼，没有可移除的修饰语。</p>' : ''}${isClause && level.stage === 0 && node === reason ? '<p class="minimal-note">先看 he / was / hungry；切换完整结构后，加入连接主句的 because。这里只是拆解展示，并未改变原句。</p>' : ''}</div>
    ${nested ? `${detail(current.parts[level.selected], true)}<p class="nested-explanation">${node.nestedNote || ''}</p>` : ''}
  </section>`;
}
function renderNavigation() {
  const groups = [...new Set(lessons.map((lesson) => lesson.group))];
  document.querySelector('#navigation').innerHTML = groups.map((group) => `<details class="nav-group" open><summary>${group}</summary><div class="nav-leaves">${lessons.filter((lesson) => lesson.group === group).map((lesson) => `<button class="nav-item ${lesson.id === state.lesson ? 'active' : ''}" data-lesson="${lesson.id}" ${lesson.id === state.lesson ? 'aria-current="page"' : ''}>${lesson.title}</button>`).join('')}</div></details>`).join('');
}
function render() {
  const lesson = getLesson();
  const level = getLevel('root');
  const selected = lesson.stages[level.stage].parts[level.selected];
  const lessonIndex = lessons.indexOf(lesson);
  document.querySelector('#breadcrumb').textContent = `${lesson.group} / ${lesson.title}`;
  document.title = `${lesson.title} · 句间`;
  main.innerHTML = `
    <div class="eyebrow">SENTENCE LAB / ${lesson.english}</div>
    <section class="lesson-header"><div><h1>${lesson.title}</h1><p class="lesson-subtitle">${lesson.description}</p></div><div class="lesson-count">${String(lessonIndex + 1).padStart(2, '0')} <span>/ 07</span></div></section>
    <div class="formula-card"><span class="section-kicker">结构公式</span><div class="formula">${lesson.formula.map((item) => { const [role, label] = Array.isArray(item) ? item : [item, roles[item].label]; return `<span class="formula-role" data-role="${role}"><b>${roles[role].symbol}</b>${label}</span>`; }).join('<span class="formula-plus">+</span>')}</div><span class="formula-description">${lesson.formulaDescription}</span></div>
    <div class="lab">${analysis(lesson)}<svg class="analysis-connectors" aria-hidden="true"><defs><marker id="connector-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="context-stroke" stroke-width="1.5" /></marker></defs><g class="connector-paths"></g></svg></div>
    <div class="legend" aria-label="颜色图例">${Object.entries(roles).map(([key, value]) => `<span class="legend-item" data-role="${key}"><span class="legend-dot"></span>${key === 'complement' ? '表语 / 宾补' : value.label}</span>`).join('')}<span class="legend-note">主色区分成分，相近色区分构成</span></div>
    <div class="info-grid">${detail(selected)}<section class="info-card tip-card"><h2 class="info-heading"><span class="info-icon">✧</span>理解这一点</h2><p>${lesson.tip}</p><p class="tip-example">${lesson.contrast}</p></section></div>
    <div class="lesson-pagination"><button class="pagination-button" data-direction="-1" ${lessonIndex === 0 ? 'disabled' : ''}>← 上一个语法点</button><div class="page-indicators" aria-hidden="true">${lessons.map((_, i) => `<span class="${i === lessonIndex ? 'active' : ''}"></span>`).join('')}</div><button class="pagination-button" data-direction="1" ${lessonIndex === lessons.length - 1 ? 'disabled' : ''}>下一个语法点 →</button></div>`;
  resizeObserver.disconnect();
  resizeObserver.observe(main.querySelector('.lab'));
  requestAnimationFrame(drawConnectors);
}
function drawConnectors() {
  const lab = main.querySelector('.lab');
  if (!lab) return;
  const bounds = lab.getBoundingClientRect();
  const svg = lab.querySelector('.analysis-connectors');
  svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
  const paths = [];
  for (const panel of lab.querySelectorAll('.analysis-panel')) {
    const path = panel.dataset.path;
    const level = getLevel(path);
    if (level.expanded === null) continue;
    const source = document.getElementById(`token-${path}-${level.expanded}`);
    const target = document.getElementById(`panel-${path}-${level.expanded}`);
    if (!source || !target) continue;
    const start = source.getBoundingClientRect();
    const end = target.getBoundingClientRect();
    // 父色块底边中心 → 子分析区顶边中心，两端保持垂直。
    const x1 = start.left + start.width / 2 - bounds.left;
    const y1 = start.bottom - bounds.top;
    const x2 = end.left + end.width / 2 - bounds.left;
    const y2 = end.top - bounds.top;
    const middleY = (y1 + y2) / 2;
    const color = getComputedStyle(source).getPropertyValue('--role').trim();
    paths.push(`<path d="M ${x1} ${y1} C ${x1} ${middleY}, ${x2} ${middleY}, ${x2} ${y2}" stroke="${color}" marker-end="url(#connector-arrow)"/><circle cx="${x1}" cy="${y1}" r="3" fill="${color}"/>`);
  }
  svg.querySelector('.connector-paths').innerHTML = paths.join('');
}
const resizeObserver = new ResizeObserver(() => requestAnimationFrame(drawConnectors));
window.addEventListener('resize', drawConnectors);
document.fonts?.ready.then(drawConnectors);
function chooseLesson(id) {
  if (!lessons.some(lesson => lesson.id === id)) return;
  Object.assign(state, { lesson: id, levels: {} });
  if (id === 'reason-clause') getLevel('root').stage = 1;
  for (const button of document.querySelectorAll('[data-lesson]')) {
    button.classList.toggle('active', button.dataset.lesson === id);
    if (button.dataset.lesson === id) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  }
  render();
  document.querySelector('#sidebar').classList.remove('open');
  document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'instant' });
}
document.querySelector('#navigation').addEventListener('click', (event) => {
  const button = event.target.closest('[data-lesson]');
  if (button) chooseLesson(button.dataset.lesson);
});
main.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.direction) {
    const next = lessons[lessons.indexOf(getLesson()) + Number(button.dataset.direction)];
    if (next) chooseLesson(next.id);
    main.querySelector(`[data-direction="${button.dataset.direction}"]:not(:disabled)`)?.focus({ preventScroll: true });
    return;
  }
  const panel = button.closest('[data-path]');
  if (!panel) return;
  const path = panel.dataset.path;
  const level = getLevel(path);
  let focusSelector;
  if (button.dataset.stage !== undefined) {
    const next = Number(button.dataset.stage);
    if (next !== level.stage) {
      clearDescendants(path);
      Object.assign(level, { stage: next, selected: 0, expanded: null });
    }
    focusSelector = `#panel-${path} > ${button.classList.contains('layer-button') ? '.layer-controls .layer-button' : '.lab-toolbar .segmented button'}[data-stage="${next}"]`;
  } else if (button.dataset.part !== undefined) {
    level.selected = Number(button.dataset.part);
    const selected = getStages(nodeAt(path))[level.stage].parts[level.selected];
    if (selected.children) {
      level.expanded = level.expanded === level.selected ? null : level.selected;
    }
    focusSelector = `#token-${path}-${level.selected}`;
  } else if (button.hasAttribute('data-collapse')) {
    const segments = path.split('-');
    const index = segments.pop();
    const parentPath = segments.join('-');
    getLevel(parentPath).expanded = null;
    focusSelector = `#token-${parentPath}-${index}`;
  } else return;
  render();
  main.querySelector(focusSelector)?.focus({ preventScroll: true });
});
document.querySelector('#menu-toggle').addEventListener('click', () => {
  const open = document.querySelector('#sidebar').classList.toggle('open');
  document.querySelector('#menu-toggle').setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.querySelector('#sidebar').classList.contains('open')) {
    document.querySelector('#sidebar').classList.remove('open');
    document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false');
    document.querySelector('#menu-toggle').focus();
  }
});
renderNavigation();
render();
