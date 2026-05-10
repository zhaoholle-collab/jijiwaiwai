const avatars = [
  "./assets/avatar-1.svg",
  "./assets/avatar-2.svg",
  "./assets/avatar-3.svg",
  "./assets/avatar-4.svg",
  "./assets/avatar-5.svg",
  "./assets/avatar-6.svg"
];

const customers = [
  {
    id: "liu",
    group: "normal",
    name: "微微",
    source: "系统",
    status: "已加微 5 天",
    time: "3 分前",
    unread: true,
    avatar: avatars[0],
    preview: "如果选 30 年交，中途身体出问题还能继续保吗？",
    chips: [
      ["高意向", "hot"],
      ["重疾险", "warn"],
      ["已婚", ""]
    ],
    messages: [
      ["customer", "上次那份重疾方案我和我老公看了，50 万保额这个方向我们能接受"],
      ["ai", "好的微微，我先帮您把核心点捋一下：这版主要解决大病治疗费和收入中断风险，保额 50 万，轻中症也有对应赔付。"],
      ["customer", "我主要担心交费时间太长，万一后面身体出问题或者收入不稳定怎么办"],
      ["customer", "如果选 30 年交，中途身体出问题还能继续保吗？"]
    ],
    draftType: "缴费期异议"
  },
  {
    id: "lady",
    group: "normal",
    name: "刘女士",
    source: "抖音",
    status: "加微通过",
    time: "刚刚",
    unread: true,
    avatar: avatars[1],
    preview: "我想先了解下，一家三口怎么买比较合适？",
    chips: [
      ["新加微", "blue"],
      ["抖音引流", ""]
    ],
    messages: [
      ["customer", "你好，我刚从抖音过来的，想了解一下保险"],
      ["ai", "刘女士您好，我先不直接推荐产品。想先确认三件事：家里几口人、目前有没有社保、每年能接受的保费预算大概多少？"],
      ["customer", "一家三口，孩子 4 岁，我和老公都有社保。预算不想太高，先做基础保障。"]
    ],
    draftType: "开场破冰"
  },
  {
    id: "wang",
    group: "normal",
    name: "王先生",
    source: "小红书",
    status: "已关注 2 天",
    time: "5 分前",
    unread: false,
    avatar: avatars[2],
    preview: "预算一年五六千，重疾险还能配到多少保额？",
    chips: [
      ["已破冰", "blue"],
      ["小红书", ""]
    ],
    messages: [
      ["customer", "我看你们笔记里说的重疾险，预算不多能买吗？"],
      ["ai", "可以配，但建议先别追求“大而全”。如果一年预算五六千，优先把重疾保额做到 30-50 万，再看医疗险和意外险是否齐。"],
      ["customer", "那如果我有甲状腺结节，会不会买不了？"]
    ],
    draftType: "预算咨询"
  },
  {
    id: "zhao",
    group: "hot",
    name: "奶爸不躺平(赵先生)",
    source: "抖音",
    status: "已婚 1 孩",
    time: "1 分钟",
    unread: true,
    avatar: avatars[3],
    preview: "投保的时候是直接付给保险公司吗？合同多久能看到？",
    chips: [
      ["成交信号", "hot"],
      ["重疾 50w", "warn"],
      ["已婚 1孩", ""]
    ],
    messages: [
      ["customer", "我跟家里人聊了一下，50 万保额差不多，保费也在预算内"],
      ["customer", "投保的时候是直接付给保险公司吗？合同多久能看到？我老婆想确认一下流程。"]
    ],
    draftType: "成交推进"
  },
  {
    id: "sun",
    group: "hot",
    name: "小花",
    source: "小红书",
    status: "方案已发",
    time: "今 08:30",
    unread: false,
    avatar: avatars[4],
    preview: "两套方案我看了，A 方案贵一点，差别主要在哪？",
    chips: [
      ["超时未读", "warn"],
      ["方案已发", ""]
    ],
    messages: [
      ["ai", "小花，我给您整理了两套方案：A 方案重疾保额更高，B 方案每年保费压力更低。您可以先看哪套更贴近家庭现金流。"],
      ["customer", "两套方案我看了，A 方案贵一点，差别主要在哪？"]
    ],
    draftType: "跟进提醒"
  },
  {
    id: "zhou",
    group: "hot",
    name: "小吕",
    source: "系统",
    status: "关注养老险",
    time: "昨天",
    unread: false,
    avatar: avatars[5],
    preview: "养老年金我主要想看以后每年能领多少，别太复杂",
    chips: [
      ["对比中", "warn"],
      ["养老险", ""]
    ],
    messages: [
      ["customer", "养老年金我主要想看以后每年能领多少，别太复杂"],
      ["ai", "明白小吕，我会按 60 岁开始领、65 岁开始领两种方式给您看现金流，不只看总收益，也看每年领取是否稳定。"]
    ],
    draftType: "养老险对比"
  }
];

const templates = [
  {
    label: "预算确认",
    text: "我先按不影响家庭现金流的方式帮您倒推保额。您这边每年保费预算大概希望控制在多少以内？"
  },
  {
    label: "健康告知",
    text: "投保前健康告知一定要如实填，我可以先帮您看下既往体检异常是否影响承保，比如结节、住院史、长期用药这些。"
  },
  {
    label: "责任说明",
    text: "这款主要看三块：重疾赔付、轻中症赔付、以及豁免责任。我可以把合同里最关键的保障责任单独标出来给您看。"
  },
  {
    label: "缴费期",
    text: "缴费期可以按现金流来选。30 年交不是交得更多，而是把每年压力摊低，同时保留缴费期内豁免的机会。"
  }
];

const drafts = {
  缴费期异议: "微微，这个担心很实际。30 年交的核心不是“拖很久”，而是把每年压力降下来，同时保留更长的豁免窗口。<br><br>以 50 万保额测算：<ul><li><b>10 年交：每年约 1.85 万</b></li><li><b>20 年交：每年约 1.05 万</b></li><li><b>30 年交：每年约 0.78 万</b></li></ul>如果缴费期内发生合同约定的轻症/中症，后续保费可以豁免，保障继续有效。也就是说，真正要比较的是<b>每年现金流压力 + 豁免责任</b>，不是只看交多少年。",
  开场破冰: "刘女士您好，我先帮您做基础梳理，不急着推产品。一家三口通常先看顺序：大人重疾和医疗险优先，孩子做基础医疗和意外，预算充足再补教育金。您方便说下大人年龄和每年预算区间吗？",
  预算咨询: "王先生，五六千预算可以做，但要先看健康告知。甲状腺结节一般需要看分级、大小、是否复查稳定。建议您先把最近一次体检报告结论发我，我帮您预判是正常承保、除外，还是需要人工核保。",
  成交推进: "赵先生，保费是通过保险公司官方投保链接支付，不会打到个人账户。流程一般是：填写投保信息 → 健康告知 → 支付首期保费 → 保险公司审核 → 电子合同出单。您爱人如果要确认，我可以把每一步截图和注意事项发您。",
  跟进提醒: "小花，A 方案贵一些，主要是重疾保额和轻中症责任更完整；B 方案是控制每年保费压力，适合预算更敏感的家庭。我的建议是先定一个不影响生活的年预算，再反推保额，不要为了保额把现金流压太紧。",
  养老险对比: "小吕，养老年金不用看得太复杂，重点看三件事：什么时候开始领、每年领多少、能不能稳定领一辈子。我建议用 60 岁和 65 岁两个领取方案对比，这样您能直观看到现金流差异。"
};

const customerInsights = {
  liu: {
    score: 88,
    summary: "已明确认可 50 万重疾保额，当前主要异议集中在缴费期和未来收入稳定性，属于高意向、需解释豁免责任的客户。",
    facts: ["38 岁，已婚，家庭共同决策", "有社保，关注成人重疾保障", "预算接受度较高，但重视长期现金流"],
    needs: ["解决大病治疗费和收入中断风险", "需要把 30 年交与豁免责任讲清楚", "希望方案能兼顾夫妻双方意见"],
    risks: ["担心缴费周期长导致中途断缴", "对合同条款和豁免触发条件需要确认", "可能会和其他产品做价格对比"],
    next: ["优先解释轻中症豁免和保障继续有效", "给出 10/20/30 年交费压力对比", "发送合同责任摘要，约定今晚让其爱人一起看"]
  },
  lady: {
    score: 72,
    summary: "新加微客户，需求还在初步确认阶段。她关注一家三口基础保障，适合先做需求盘点，再给轻量家庭方案。",
    facts: ["一家三口，孩子 4 岁", "夫妻双方有社保", "预算敏感，不希望保费太高"],
    needs: ["先搭建家庭基础保障框架", "优先确认大人保障，再补孩子保障", "需要低压力、易理解的方案"],
    risks: ["需求还不清晰，过早推产品容易流失", "预算边界未明确", "可能只想先了解，不一定马上投保"],
    next: ["询问夫妻年龄和年预算区间", "用家庭保障顺序图做解释", "提供基础版和进阶版两档方案"]
  },
  wang: {
    score: 65,
    summary: "客户有明确预算，但存在甲状腺结节健康告知问题。下一步应先做核保预判，而不是直接推进产品。",
    facts: ["预算约每年五六千", "关注重疾险保额能做到多少", "提到甲状腺结节"],
    needs: ["在预算内尽量提高核心保额", "判断健康异常是否影响承保", "需要理解除外、加费、延期等结果"],
    risks: ["健康告知可能影响承保结果", "如果预期管理不足，容易对保险产生不信任", "预算和保额之间存在取舍"],
    next: ["索要最近体检报告结论", "先做智能核保/人工核保路径说明", "推荐可核保友好的备选产品"]
  },
  zhao: {
    score: 91,
    summary: "客户已认可保额和预算，进入投保流程确认阶段。关键是增强支付和合同流程安全感，降低临门一脚阻力。",
    facts: ["已婚 1 孩，家庭决策", "认可 50 万重疾保额", "关注支付账户和合同出单流程"],
    needs: ["确认保费支付给保险公司官方渠道", "了解健康告知、支付、审核、出单步骤", "需要让爱人放心"],
    risks: ["对支付安全和合同可见性有顾虑", "爱人可能提出二次异议", "流程说明不清会导致暂停投保"],
    next: ["发送官方投保流程截图", "说明电子合同查看时间", "提醒健康告知如实填写，必要时电话协助"]
  },
  sun: {
    score: 76,
    summary: "客户已阅读两套方案，正在比较保费与责任差异。适合用预算反推法帮助她做取舍。",
    facts: ["已收到 A/B 两套方案", "关注方案差异和价格原因", "对保费压力较敏感"],
    needs: ["明确 A 方案贵在哪里", "比较保额、轻中症、豁免责任", "找到不影响生活的年预算"],
    risks: ["可能只看价格忽略保障责任", "方案过复杂会拖延决策", "需要避免强推高保费方案"],
    next: ["用一张表对比 A/B 责任差异", "先确认年预算上限", "推荐最适合现金流的一版"]
  },
  zhou: {
    score: 69,
    summary: "客户关注养老年金领取金额，偏理性比较型。应避免复杂收益话术，直接展示不同领取年龄的现金流。",
    facts: ["关注养老年金", "不想看太复杂的演示", "核心问题是未来每年能领多少"],
    needs: ["比较 60 岁和 65 岁领取方案", "确认每年领取金额和领取期限", "理解现金价值和保证领取"],
    risks: ["收益展示过复杂会降低耐心", "可能拿银行理财做对比", "对长期资金锁定有顾虑"],
    next: ["提供两档领取年龄对比", "展示年度现金流表", "解释保证领取和退保现金价值"]
  }
};

let activeId = "liu";
let activeTopic = "变好的人生";
let activeCopyTemplate = "收益展示";

const $ = (selector) => document.querySelector(selector);

function activeCustomer() {
  return customers.find((customer) => customer.id === activeId);
}

function renderLists() {
  renderCustomerList("#customerList", customers.filter((item) => item.group === "normal"));
  renderCustomerList("#hotList", customers.filter((item) => item.group === "hot"));
}

function renderCustomerList(target, list) {
  const root = $(target);
  root.innerHTML = list
    .map(
      (customer) => `
        <button class="customer-card ${customer.id === activeId ? "active" : ""} ${customer.unread ? "unread" : ""}" data-id="${customer.id}">
          <img src="${customer.avatar}" alt="">
          <span>
            <span class="name">${customer.name}</span>
            <span class="preview">${customer.preview}</span>
            <span class="chips">
              ${customer.chips.map(([label, type]) => `<span class="chip ${type}">${label}</span>`).join("")}
            </span>
          </span>
          <span class="time">${customer.time}</span>
        </button>
      `
    )
    .join("");

  root.querySelectorAll(".customer-card").forEach((button) => {
    button.addEventListener("click", () => {
      activeId = button.dataset.id;
      const customer = activeCustomer();
      customer.unread = false;
      renderAll();
    });
  });
}

function renderProfile() {
  const customer = activeCustomer();
  $("#profileAvatar").src = customer.avatar;
  $("#profileName").textContent = customer.name;
  $("#profileSource").textContent = customer.source;
  $("#profileStatus").textContent = customer.status;
}

function renderMessages() {
  const customer = activeCustomer();
  $("#messages").innerHTML = customer.messages
    .map(([from, text]) => {
      const isCustomer = from === "customer";
      const avatar = isCustomer ? `<img class="message-avatar" src="${customer.avatar}" alt="">` : "<span></span>";
      const label = from === "ai" ? '<span class="ai-label">AI</span>' : "";
      const bubble = `<div class="bubble">${label}${text}<small>00:28</small></div>`;
      return `<div class="message ${from}">${isCustomer ? avatar + bubble : bubble + avatar}</div>`;
    })
    .join("");
  $("#chatScroll").scrollTop = $("#chatScroll").scrollHeight;
}

function renderTemplates() {
  $("#templateRow").innerHTML = templates
    .map((template) => `<button class="template" data-text="${template.text}">${template.label}</button>`)
    .join("");

  document.querySelectorAll(".template").forEach((button) => {
    button.addEventListener("click", () => {
      $("#composerInput").value = button.dataset.text;
      $("#composerHint").textContent = `已套用快捷模板 · ${button.textContent}`;
    });
  });
}

function renderDraft() {
  const customer = activeCustomer();
  $(".ai-step .step-toggle strong").textContent = `应答 · ${customer.draftType}`;
  $("#aiDraft").innerHTML = drafts[customer.draftType];
}

function bindStaticActions() {
  document.querySelectorAll(".rail-item[data-view]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  document.querySelectorAll(".group-title").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest(".platform-group");
      const collapsed = group.classList.toggle("collapsed");
      button.setAttribute("aria-expanded", String(!collapsed));
    });
  });

  document.querySelectorAll(".tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      document.querySelectorAll(".tag").forEach((item) => item.classList.remove("selected"));
      tag.classList.add("selected");
      if (["高意向", "中意向", "低意向"].includes(tag.dataset.intent)) {
        markIntent(tag.dataset.intent);
      }
      $("#composerHint").textContent = `已标记客户为「${tag.dataset.intent}」`;
    });
  });

  document.querySelectorAll(".mode").forEach((mode) => {
    mode.addEventListener("click", () => {
      document.querySelectorAll(".mode").forEach((item) => item.classList.remove("active"));
      mode.classList.add("active");
      const labels = {
        ai: "AI 托管中 · 系统会自动接管已确认草稿",
        assist: "人机协作中 · AI 生成建议，销售确认发送",
        manual: "纯人工模式 · AI 仅保留客户画像"
      };
      $("#composerHint").textContent = labels[mode.dataset.mode];
    });
  });

  $("#sendButton").addEventListener("click", sendComposer);
  $("#approveButton").addEventListener("click", () => {
    $("#composerInput").value = stripHtml($("#aiDraft").innerHTML);
    sendComposer(true);
  });
  $("#rewriteButton").addEventListener("click", () => {
    $("#composerHint").textContent = "AI 已重新生成一版更口语的草稿";
    $("#aiDraft").innerHTML = $("#aiDraft").innerHTML.replace("这个担心很实际", "这个问题问得很关键");
  });
  $("#editDraftButton").addEventListener("click", () => {
    $("#composerInput").value = stripHtml($("#aiDraft").innerHTML);
    $("#composerInput").focus();
    $("#composerHint").textContent = "草稿已放入输入框，可继续编辑";
  });

  $("#insightButton").addEventListener("click", openInsightModal);
  $("#closeInsight").addEventListener("click", closeInsightModal);
  $("#insightModal").addEventListener("click", (event) => {
    if (event.target.id === "insightModal") closeInsightModal();
  });

  document.querySelectorAll(".step-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const step = button.closest(".ai-step");
      const expanded = step.classList.toggle("expanded");
      button.setAttribute("aria-expanded", String(expanded));
    });
  });

  document.querySelectorAll(".trend-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".trend-card").forEach((item) => item.classList.remove("active"));
      card.classList.add("active");
      activeTopic = card.dataset.topic;
      renderCreationIdea();
      renderGeneratedCopy();
    });
  });

  document.querySelectorAll(".copy-template").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".copy-template").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      activeCopyTemplate = button.dataset.template;
      renderGeneratedCopy();
    });
  });

  $("#generateCopyButton").addEventListener("click", renderGeneratedCopy);
  $("#generateCopyTop").addEventListener("click", renderGeneratedCopy);
}

function openInsightModal() {
  renderInsightModal();
  $("#insightModal").classList.remove("hidden");
  $("#insightModal").setAttribute("aria-hidden", "false");
}

function closeInsightModal() {
  $("#insightModal").classList.add("hidden");
  $("#insightModal").setAttribute("aria-hidden", "true");
}

function switchView(view) {
  document.querySelectorAll(".rail-item[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  const chatVisible = view === "chat";
  document.querySelector(".inbox").classList.toggle("hidden", !chatVisible);
  document.querySelector(".conversation").classList.toggle("hidden", !chatVisible);
  document.querySelector(".copilot").classList.toggle("hidden", !chatVisible);
  $("#creationWorkspace").classList.toggle("hidden", chatVisible);
}

function sendComposer(fromApproval = false) {
  const input = $("#composerInput");
  const value = input.value.trim();
  if (!value) return;

  const customer = activeCustomer();
  customer.messages.push(["sales", value]);
  customer.preview = fromApproval ? "已审核 AI 草稿并发送" : value;
  customer.time = "刚刚";
  input.value = "";
  $("#composerHint").textContent = fromApproval ? "AI 草稿已审核发送" : "消息已发送";
  renderLists();
  renderMessages();
}

function markIntent(intent) {
  const customer = activeCustomer();
  const style = intent === "高意向" ? "hot" : intent === "中意向" ? "warn" : "";
  customer.chips = customer.chips.filter(([label]) => !["高意向", "中意向", "低意向"].includes(label));
  customer.chips.unshift([intent, style]);
  renderLists();
}

function renderCreationIdea() {
  const ideas = {
    变好的人生: "建议围绕“变好的人生”切入，把保险从“焦虑消费”转为“给未来留选择权”，更适合小红书种草语境。",
    "30岁女性保障": "建议把话题落到“收入稳定后先给自己兜底”，突出女性在家庭责任、职业发展和长期健康上的确定性。",
    普通家庭抗风险: "建议用真实账本视角切入：普通家庭最需要防的是一次大额支出打乱现金流，适合做风险教育型内容。",
    给父母配置保险: "建议强调“别急着买贵的，先看年龄、健康告知和预算”，适合做避坑清单和评论区引导。"
  };
  $("#ideaBox").textContent = ideas[activeTopic] || ideas["变好的人生"];
}

function renderInsightModal() {
  const customer = activeCustomer();
  const insight = customerInsights[customer.id] || customerInsights.liu;
  $("#insightAvatar").src = customer.avatar;
  $("#insightTitle").textContent = `${customer.name} · 用户画像`;
  $("#insightSubtitle").textContent = `${customer.source} · ${customer.status}`;
  $("#insightScore").textContent = insight.score;
  $("#insightSummary").textContent = insight.summary;
  renderInsightList("#profileFacts", insight.facts);
  renderInsightList("#profileNeeds", insight.needs);
  renderInsightList("#profileRisks", insight.risks);
  renderInsightList("#profileNext", insight.next);
}

function renderInsightList(selector, items) {
  $(selector).innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderGeneratedCopy() {
  const product = $("#productName").value.trim() || "悦守一生多倍版";
  const keyword = $("#copyKeyword").value.trim() || "重疾保障 家庭责任";
  const templateLead = {
    收益展示: "适合用“每年压力更小，长期保障更稳”的方式讲清楚。",
    真实案例: "适合用一个普通家庭的真实选择，降低用户理解门槛。",
    产品对比: "适合把保障责任、缴费压力和豁免责任放在一起对比。",
    蹭热点: `适合承接“${activeTopic}”这个热点，把情绪价值转成保障需求。`
  };

  $("#copyOutput").innerHTML = `
    <h3>${activeTopic} × ${product}</h3>
    <p>${templateLead[activeCopyTemplate]}</p>
    <p><b>标题：</b>30岁后我才明白，真正的安全感不是多赚一点，而是风险来时家还能稳住。</p>
    <p><b>正文：</b>最近刷到很多人在聊“${activeTopic}”。其实对普通家庭来说，变好不是突然逆袭，而是每一步都更有底气。</p>
    <p>如果你也在关注${keyword}，可以先看 ${product} 这类重疾保障：重疾多次赔，轻症覆盖，缴费期内还有豁免责任。它不是让生活变复杂，而是帮你把不可控的风险先兜住。</p>
    <ul>
      <li>预算有限：先把核心保额做够</li>
      <li>家庭责任重：优先看重疾和豁免</li>
      <li>想长期稳定：选择适合现金流的缴费期</li>
    </ul>
    <p><b>结尾引导：</b>想知道自己的预算适合怎么配，可以留言“保障”，我帮你按家庭情况拆一版。</p>
  `;
}

function stripHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html.replace(/<li>/g, "\n• ").replace(/<\/p>|<br>/g, "\n");
  return temp.textContent.replace(/\n{3,}/g, "\n\n").trim();
}

function renderAll() {
  renderLists();
  renderProfile();
  renderMessages();
  renderTemplates();
  renderDraft();
  renderCreationIdea();
  renderGeneratedCopy();
}

bindStaticActions();
renderAll();
