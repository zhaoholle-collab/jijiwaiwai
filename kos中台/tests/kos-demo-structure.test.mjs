import { readFileSync } from 'node:fs';
import { statSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../KOS中台管理页面.html', import.meta.url), 'utf8');

test('KOS demo exposes the optimized marketing workflow surfaces', () => {
  assert.match(html, /key:'tpl'[\s\S]*?label:'写作模板'/);
  assert.match(html, /key:'agent'[\s\S]*?label:'智能体中心'/);

  [
    '发企微计划书',
    '潜客公海池',
    '跨平台查重',
    '转为企业好友',
    '跟进任务',
    '10分钟',
    '3小时',
    '24小时',
    '意向分组成',
    '话术卡片快捷发送',
  ].forEach((label) => {
    assert.match(html, new RegExp(label), `Expected ${label} to be present`);
  });
});

test('hot capture notice lives in creation welcome row without global topbar', () => {
  assert.doesNotMatch(html, /className=\{`kos-tab/);
  assert.doesNotMatch(html, /NAV_ITEMS\.filter\(n => TOP_TABS\.includes\(n\.key\)\)/);
  assert.doesNotMatch(html, /className="kos-topbar"/);
  assert.doesNotMatch(html, /\.kos-topbar\s*\{/);
  assert.match(html, /className="chat-welcome-row"/);
  assert.match(html, /function ChatPage\(\{ onGo, seed, personas = \[\] \}\)[\s\S]*?const \[hotCaptureOpen, setHotCaptureOpen\] = useState\(false\);/);
  assert.match(html, /<HotCaptureNotice\s+open=\{hotCaptureOpen\}/);
  assert.match(html, /\.chat-welcome-row\s*\{[^}]*justify-content:space-between;/);
  assert.match(html, /const HOT_CAPTURE_HISTORY = \[\s*\{\s*time:'刚刚'/);
  assert.match(html, /热点抓取历史/);
  assert.match(html, /最新记录在最上方/);
});

test('topic plaza keeps hot topics centered and inspiration island masonry styled', () => {
  assert.match(html, /\.hot-list\s*\{[^}]*margin:0 auto;/);
  assert.match(html, /\.hot-head\s*\{[^}]*position:sticky;[^}]*top:0;[^}]*z-index:8;/);
  assert.match(html, /\.hot-grid\s*\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\);/);
  assert.match(html, /\.inspi-wrap\s*\{[^}]*margin:0 auto;/);
  assert.match(html, /\.inspi-sticky-head\s*\{[^}]*position:sticky;[^}]*top:0;[^}]*z-index:8;/);
  assert.match(html, /className="inspi-titlebar"/);
  assert.match(html, /\.inspi-grid\s*\{[^}]*grid-template-columns:repeat\(4,minmax\(0,1fr\)\);/);
  assert.match(html, /\.inspi-col\s*\{[^}]*display:flex;[^}]*flex-direction:column;[^}]*gap:14px;/);
  assert.match(html, /const inspiColumns = Array\.from\(\{ length: 4 \}, \(\) => \[\]\);/);
  assert.match(html, /inspiList\.forEach\(\(item, i\) => inspiColumns\[i % 4\]\.push\(item\)\);/);
  assert.match(html, /const \[topicRefreshLeft, setTopicRefreshLeft\] = useState\(3600\);/);
  assert.match(html, /setInterval\(\(\) => \{/);
  assert.match(html, /setTopicRefreshLeft\(s => s <= 1 \? 3600 : s - 1\);/);
  assert.match(html, /const topicRefreshText = `\$\{String\(Math\.floor\(topicRefreshLeft \/ 60\)\)\.padStart\(2,'0'\)\}:\$\{String\(topicRefreshLeft % 60\)\.padStart\(2,'0'\)\}`;/);
  assert.match(html, /数据每小时更新 · 下次刷新/);
  assert.match(html, /height:\s*c\.tall\?178:\(i % 3 === 1 \? 136 : 112\)/);
});

test('right creation toolbar uses fixed labels without hover bubbles', () => {
  assert.match(html, /tip:'营销笔记'/);
  assert.doesNotMatch(html, /小红书笔记/);
  assert.doesNotMatch(html, /rt-tip/);
});

test('sidebar navigation uses a fixed icon column for alignment', () => {
  assert.match(html, /\.kos-nav-item\s*\{[^}]*grid-template-columns: 20px minmax\(0, 1fr\) auto;/);
  assert.match(html, /\.kos-nav-item \.nav-icon\s*\{[^}]*width: 20px;/);
  assert.match(html, /\.kos-nav-item \.nav-icon\.line svg\s*\{[^}]*fill:none;[^}]*stroke:currentColor;/);
  assert.match(html, /\.kos-nav-item \.nav-icon\.solid svg\s*\{[^}]*fill:currentColor;[^}]*stroke:none;/);
  assert.match(html, /function NavIcon\(\{ name, active \}\)/);
  assert.match(html, /<NavIcon name=\{n\.icon\} active=\{page === n\.key\} \/>/);
});

test('sidebar logo uses provided marketing center image asset', () => {
  const stat = statSync(new URL('../图片素材/营销中台图标.webp', import.meta.url));
  assert.ok(stat.size > 0, 'marketing center icon should exist');
  assert.match(html, /<img className="kos-logo-mark" src="图片素材\/营销中台图标\.webp" alt="KOS营销中台" \/>/);
  assert.match(html, /\.kos-logo-mark\s*\{[^}]*object-fit: cover;/);
  assert.doesNotMatch(html, /<div className="kos-logo-mark">✦<\/div>/);
});

test('creation center exposes embedded template and persona configuration panels', () => {
  [
    '模板快捷选择',
    '人设语气',
    '禁区词',
    '销售阶段规则',
    '爆款URL学习',
  ].forEach((label) => {
    assert.match(html, new RegExp(label), `Expected ${label} to be present`);
  });
});

test('creation input box uses a thinner border', () => {
  assert.match(html, /\.input-box-wrap\s*\{[^}]*border: 1px solid #dcdfe6;/);
  assert.match(html, /\.input-box-wrap:focus-within\s*\{[^}]*box-shadow: 0 0 0 1px rgba\(22,93,255,\.08\);/);
});

test('creation quick tasks use local detailed PNG icons', () => {
  [
    'quick-copy.png',
    'quick-video.png',
    'quick-title.png',
    'quick-remix.png',
    'quick-polish.png',
    'quick-compliance.png',
    'quick-calendar.png',
    'quick-plan.png',
  ].forEach((file) => {
    const stat = statSync(new URL(`../assets/quick-icons/${file}`, import.meta.url));
    assert.ok(stat.size > 0, `${file} should exist`);
  });
  assert.match(html, /icon: 'assets\/quick-icons\/quick-copy\.png'/);
  assert.match(html, /\.quick-icon-img\s*\{[^}]*object-fit:cover;/);
  assert.match(html, /<img className="quick-icon-img" src=\{t\.icon\} alt=\{t\.label\} \/>/);
  assert.doesNotMatch(html, /<div className="quick-icon" style=\{\{background: t\.bg\}\}>\{t\.emoji\}<\/div>/);
});

test('AI image empty state uses local skeuomorphic PNG icon', () => {
  const stat = statSync(new URL('../assets/aigen/empty-preview.png', import.meta.url));
  assert.ok(stat.size > 0, 'empty-preview.png should exist');
  assert.match(html, /\.aigen-empty-icon\s*\{[^}]*object-fit:contain;/);
  assert.match(html, /<img className="aigen-empty-icon" src="assets\/aigen\/empty-preview\.png" alt="AI生图预览" \/>/);
  assert.doesNotMatch(html, /<div style=\{\{fontSize:48\}\}>🖼️<\/div>/);
});

test('AI image quality slider removes browser focus outline', () => {
  assert.match(html, /\.quality-slider\s*\{[^}]*outline:none;[^}]*box-shadow:none;/);
  assert.match(html, /\.quality-slider:focus-visible\s*\{[^}]*outline:none;[^}]*box-shadow:none;/);
  assert.match(html, /<input className="quality-slider" type="range"/);
  assert.doesNotMatch(html, /type="range"[\s\S]{0,120}style=\{\{flex:1,accentColor:'#165DFF'\}\}/);
});

test('creation personas use provided avatar material files', () => {
  ['职场专业女性.png', '年轻理财达人.png', '成熟顾问男性.png', '产品介绍团队.webp'].forEach((file) => {
    const stat = statSync(new URL(`../图片素材/头像素材/${file}`, import.meta.url));
    assert.ok(stat.size > 0, `${file} should exist`);
  });
  assert.match(html, /photo: '图片素材\/头像素材\/职场专业女性\.png'/);
  assert.match(html, /photo: '图片素材\/头像素材\/年轻理财达人\.png'/);
  assert.match(html, /photo: '图片素材\/头像素材\/成熟顾问男性\.png'/);
  assert.match(html, /photo: '图片素材\/头像素材\/产品介绍团队\.webp'/);
  assert.match(html, /\.persona-avatar-img\s*\{[^}]*object-fit:cover;/);
  assert.match(html, /<img className="persona-avatar-img" src=\{p\.photo\} alt=\{p\.name\} \/>/);
});

test('product persona is named as introduction team', () => {
  assert.match(html, /name: '产品介绍团队'/);
  assert.doesNotMatch(html, /产品介绍图/);
});

test('insurance business dashboard includes realistic funnel and product data', () => {
  assert.match(html, /\.funnel-steps\s*\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\);/);
  assert.match(html, /\.funnel-step:nth-child\(2n\)::after\s*\{[^}]*display:none;/);
  [
    '保险业务漏斗',
    '计划书发送',
    '计划书打开率',
    '投保链接点击',
    '预估保费',
    '年金险产品转化',
    '蛮好的人生',
    '教育金方案',
    '养老年金方案',
  ].forEach((label) => {
    assert.match(html, new RegExp(label), `Expected ${label} to be present`);
  });
});

test('new conversation button routes users to creation center page', () => {
  assert.match(html, />\+ 新建对话<\/button>/);
  assert.match(html, /onClick=\{\(\) => goPage\('chat'\)\}/);
});

test('sidebar includes recent conversations section', () => {
  [
    '最近对话',
    '降息热点年金文案',
    '计划书发送话术',
    '教育金异议处理',
  ].forEach((label) => {
    assert.match(html, new RegExp(label), `Expected ${label} to be present`);
  });
});

test('recent conversations are collapsible and collapsed by default', () => {
  assert.match(html, /const \[recentOpen, setRecentOpen\] = useState\(false\)/);
  assert.match(html, /最近对话/);
  assert.match(html, /recentOpen &&/);
});

test('agent center content is centered in a bounded wrapper', () => {
  assert.match(html, /\.agent-wrap\s*\{[^}]*width:min\(960px,100%\);[^}]*margin:0 auto;/);
  assert.match(html, /<div className="agent-wrap">/);
});

test('data chart row matches insurance funnel column widths', () => {
  assert.match(html, /--data-two-col: minmax\(0, 1\.2fr\) minmax\(0, 1fr\);/);
  assert.match(html, /\.charts-row\s*\{[^}]*grid-template-columns: var\(--data-two-col\);/);
  assert.match(html, /\.insurance-row\s*\{[^}]*grid-template-columns:var\(--data-two-col\);/);
});

test('inbox speech cards use a less crowded grid layout', () => {
  assert.match(html, /\.speech-card-grid\s*\{[^}]*grid-template-columns:repeat\(4,minmax\(0,1fr\)\);/);
  assert.match(html, /<div className="speech-card-title">话术卡片快捷发送<\/div>/);
  assert.match(html, /\.inbox-ai-panel\s*\{[^}]*max-height:340px;[^}]*display:flex;[^}]*flex-direction:column;/);
  assert.match(html, /\.inbox-ai-scroll\s*\{[^}]*flex:0 1 auto;[^}]*overflow-y:auto;/);
  assert.match(html, /\.inbox-quick-actions\s*\{[^}]*flex-shrink:0;/);
});

test('inbox conversation list groups platform labels with intent badges', () => {
  assert.match(html, /\.inbox-conv-body\s*\{[^}]*display:flex;[^}]*flex-direction:column;[^}]*gap:3px;/);
  assert.match(html, /\.inbox-platform-tag\s*\{[^}]*padding:2px 6px;[^}]*border-radius:8px;/);
  assert.match(html, /<span className="inbox-platform-tag" style=\{\{color:c\.platColor\}\}>\{c\.plat\}<\/span>\s*\{c\.wakeIn/);
  assert.match(html, /\.inbox-conv-item\s*\{[^}]*padding:9px 14px;/);
  assert.match(html, /\.inbox-conv-preview\s*\{[^}]*padding-left:0;[^}]*line-height:1\.35;/);
});

test('inbox thread intent score stays on one line', () => {
  assert.match(html, /\.score-bar-wrap\s*\{[^}]*display:flex;[^}]*align-items:center;[^}]*white-space:nowrap;/);
  assert.match(html, /\.score-bar-bg\s*\{[^}]*width:72px;[^}]*flex-shrink:0;/);
  assert.match(html, /<span className="score-bar-value" style=\{\{color: conv\.intentScore>=70\?'#f53f3f':conv\.intentScore>=40\?'#165DFF':'#86909c'\}\}>\{conv\.intentScore\}<\/span>/);
});

test('inbox quick action buttons append sent messages to the thread', () => {
  assert.match(html, /const \[inboxMessages, setInboxMessages\] = useState\(\(\) => \(\{\}\)\);/);
  assert.match(html, /const activeMsgs = inboxMessages\[activeConv\] \|\| conv\?\.msgs \|\| \[\];/);
  assert.match(html, /const appendInboxMessage = \(text\) => \{/);
  assert.match(html, /setInboxMessages\(prev => \(\{\.\.\.prev, \[activeConv\]: \[\.\.\.\(prev\[activeConv\] \|\| conv\?\.msgs \|\| \[\]\), \{ r:'self', t:text \}\]\}\)\);/);
  assert.match(html, /appendInboxMessage\(conv\.aiReply\);/);
  assert.match(html, /appendInboxMessage\('已发送计划书：利益演示和保障方案已同步给客户。'\);/);
  assert.match(html, /appendInboxMessage\('已发送投保链接：客户可在手机端完成投保流程。'\);/);
  assert.match(html, /appendInboxMessage\(`已发送话术卡片：\$\{text\}`\);/);
  assert.match(html, /appendInboxMessage\('已发起转企业好友邀请，请客户通过后继续承接。'\);/);
  assert.match(html, /activeMsgs\.map\(\(m,i\) => \(/);
});

test('inbox message bubbles stay close to avatars', () => {
  assert.match(html, /\.inbox-msg-item\s*\{[^}]*gap:6px;[^}]*margin-bottom:12px;/);
  assert.match(html, /\.inbox-msg-content\s*\{[^}]*max-width:72%;/);
  assert.match(html, /\.inbox-msg-item\.self \.inbox-msg-content\s*\{[^}]*align-items:flex-end;/);
  assert.match(html, /<div className="inbox-msg-content">/);
});

test('creation center user messages are right aligned', () => {
  assert.match(html, /\.msg-content\s*\{[^}]*display: flex;[^}]*max-width: 82%;/);
  assert.match(html, /\.msg-row\.user \.msg-content\s*\{[^}]*align-items: flex-end;/);
  assert.match(html, /\.msg-bubble\s*\{[^}]*max-width: 100%;/);
  assert.match(html, /<div className="msg-content">/);
  assert.doesNotMatch(html, /<div style=\{\{maxWidth:'82%'\}\}>/);
});

test('inbox customers use portrait avatars instead of letter-only circles', () => {
  assert.match(html, /const CUSTOMER_PORTRAITS = \{/);
  assert.match(html, /function PersonAvatar\(\{ person/);
  assert.match(html, /\.inbox-avatar-img\s*\{[^}]*object-fit:cover;[^}]*border-radius:50%;/);
  assert.match(html, /photo:CUSTOMER_PORTRAITS\.c1/);
  assert.match(html, /<PersonAvatar person=\{c\} \/>/);
  assert.match(html, /<PersonAvatar person=\{conv\} className="inbox-msg-av" size=\{28\} fontSize=\{11\} \/>/);
});

test('operator display name is unified as Yangyang', () => {
  assert.doesNotMatch(html, /千富/);
  assert.match(html, /下午好，阳阳/);
  assert.doesNotMatch(html, /下午好，阳阳 \{cur\.emoji\}/);
  assert.match(html, />阳阳<\/div>/);
  assert.match(html, /<div className="kos-avatar">阳<\/div>/);
});

test('creation center receives content from templates agents hot topics and viral cards', () => {
  assert.match(html, /const \[chatSeed, setChatSeed\]\s*= useState\(null\);/);
  assert.match(html, /const \[addedPersonas, setAddedPersonas\]\s*= useState\(\[\]\);/);
  assert.match(html, /const fillCreationCenter = \(payload\) => \{/);
  assert.match(html, /function ChatPage\(\{ onGo, seed, personas = \[\] \}\)/);
  assert.match(html, /useEffect\(\(\) => \{[\s\S]*?setMsgs\(m => \[[\s\S]*?seed\.prompt[\s\S]*?seed\.reply/);
  assert.match(html, /<TemplatePage onUseTemplate=\{\(tpl, catInfo\) => fillCreationCenter/);
  assert.match(html, /<AgentPage onUseAgent=\{useAgentInCreation\} \/>/);
  assert.match(html, /<TopicPage onUseHot=\{\(hot\) => fillCreationCenter/);
  assert.match(html, /<ViralFloatCard onClose=\{\(\) => setShowViral\(false\)\} onFill=\{\(hot\) => \{/);
});

test('right tools provide chat feedback when clicked', () => {
  assert.match(html, /const handleRightTool = \(tool\) => \{/);
  assert.match(html, /onClick=\{\(\) => handleRightTool\(t\)\}/);
  assert.match(html, /tip:'营销笔记'[\s\S]*?reply:'已按「营销笔记」模式生成/);
  assert.match(html, /tip:'合规检测'[\s\S]*?reply:'合规检测结果/);
  assert.match(html, /tool\.action === 'topic' && onGo/);
});
