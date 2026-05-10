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
    status: "新线索 · 已互动 2 次",
    time: "3 分前",
    unread: true,
    avatar: avatars[0],
    preview: "我刷到你们说女性要先配保障，想先了解下",
    chips: [
      ["新线索", "blue"],
      ["女性保障", "warn"],
      ["待破冰", ""]
    ],
    messages: [
      ["customer", "我刷到你们说女性要先配保障，感觉有点道理，但我还不太懂具体怎么选"],
      ["ai", "微微您好，先不用急着看产品。我先帮您判断适合从哪类保障开始：您现在主要是想给自己做基础保障，还是想顺带了解家庭方案？"],
      ["customer", "主要先给自己了解一下，怕以后生病拖累家里"],
      ["customer", "这种一般要先看预算还是先看保额？"]
    ],
    draftType: "获客破冰"
  },
  {
    id: "lady",
    group: "normal",
    name: "刘女士",
    source: "抖音",
    status: "刚留资 · 待确认需求",
    time: "刚刚",
    unread: true,
    avatar: avatars[1],
    preview: "我想先了解下，一家三口买保险从哪开始？",
    chips: [
      ["新加微", "blue"],
      ["抖音引流", ""],
      ["家庭保障", "warn"]
    ],
    messages: [
      ["customer", "你好，我刚从抖音过来的，想了解一下保险"],
      ["ai", "刘女士您好，欢迎～我先不直接推荐产品，先帮您做个简单判断。您是想先给自己配置，还是一家三口一起看？"],
      ["customer", "一家三口吧，但预算不想太高，想先知道从哪开始比较合适。"]
    ],
    draftType: "来源承接"
  },
  {
    id: "wang",
    group: "normal",
    name: "王先生",
    source: "小红书",
    status: "评论咨询 · 待加深",
    time: "5 分前",
    unread: false,
    avatar: avatars[2],
    preview: "预算一年五六千，适合先买什么？",
    chips: [
      ["已破冰", "blue"],
      ["小红书", ""],
      ["预算试探", "warn"]
    ],
    messages: [
      ["customer", "我看你们笔记里说普通家庭别乱买保险，预算一年五六千的话适合先买什么？"],
      ["ai", "王先生，五六千预算可以先做基础盘点，不一定马上买。通常先看社保、家庭责任、已有保单，再决定重疾/医疗/意外哪个优先。"],
      ["customer", "那我需要先把现有保单发你看吗？"]
    ],
    draftType: "预算试探"
  },
  {
    id: "zhao",
    group: "hot",
    name: "奶爸不躺平(赵先生)",
    source: "抖音",
    status: "私信高频 · 待建档",
    time: "1 分钟",
    unread: true,
    avatar: avatars[3],
    preview: "给孩子买之前，是不是大人也要先看？",
    chips: [
      ["高意向", "hot"],
      ["宝爸", "warn"],
      ["待建档", ""]
    ],
    messages: [
      ["customer", "我本来是想给孩子买保险，但看到你说大人更重要，有点不确定"],
      ["customer", "给孩子买之前，是不是大人也要先看？我和我老婆都有社保。"]
    ],
    draftType: "家庭切入"
  },
  {
    id: "sun",
    group: "hot",
    name: "小花",
    source: "小红书",
    status: "收藏笔记 · 待唤醒",
    time: "今 08:30",
    unread: false,
    avatar: avatars[4],
    preview: "我收藏了你那篇女性保障清单，想晚点看看",
    chips: [
      ["超时未读", "warn"],
      ["收藏线索", ""],
      ["女性保障", "blue"]
    ],
    messages: [
      ["ai", "小花，看到您收藏了女性保障清单。如果您只是先了解，我可以发您一版‘30 秒看懂保障顺序’，不用先看具体产品。"],
      ["customer", "可以，我晚点看。主要想知道像我这种单身女生有没有必要买。"]
    ],
    draftType: "轻跟进"
  },
  {
    id: "zhou",
    group: "hot",
    name: "小吕",
    source: "系统",
    status: "老线索唤醒 · 待回复",
    time: "昨天",
    unread: false,
    avatar: avatars[5],
    preview: "之前说的养老话题我还想了解，但现在不急着买",
    chips: [
      ["待唤醒", "warn"],
      ["养老关注", ""],
      ["低压沟通", "blue"]
    ],
    messages: [
      ["customer", "之前说的养老话题我还想了解，但现在不急着买"],
      ["ai", "明白小吕，那我先不给您推方案。可以先发您一张养老资金准备的思路图，您有空看完再决定要不要细聊。"]
    ],
    draftType: "老线索唤醒"
  }
];

const templates = [
  {
    label: "来源确认",
    text: "我先确认下，您是从哪条内容过来的？是想了解基础保障，还是已经有具体产品想对比？"
  },
  {
    label: "轻问预算",
    text: "先不急着定产品，我想了解下您希望每年保费控制在什么范围内，这样我能帮您判断适合从哪类保障开始。"
  },
  {
    label: "需求试探",
    text: "您现在更担心哪一类风险：大病治疗费、收入中断、孩子保障，还是父母养老医疗？我先按重点给您梳理。"
  },
  {
    label: "引导建档",
    text: "为了不乱推荐，我先帮您做个简单保障建档：年龄、是否有社保、家庭成员、已有保单和大概预算，确认完再给建议。"
  }
];

const drafts = {
  获客破冰: "微微，您这个问题很适合作为第一步来聊。获客阶段我先不建议直接看产品，先判断您属于哪种保障优先级：<ul><li><b>自己收入责任重：</b>先看重疾 + 医疗</li><li><b>家庭支出压力大：</b>先看保额够不够</li><li><b>只是想了解：</b>先做基础保障顺序梳理</li></ul>如果方便，您告诉我年龄、有无社保、每年大概预算，我先帮您判断从哪里开始最合适。",
  来源承接: "刘女士您好，我先帮您把一家三口的保障顺序讲清楚，不急着推荐具体产品。一般是<b>先大人、后孩子；先保障、后理财</b>。您可以先给我三个信息：夫妻年龄、孩子年龄、每年大概预算，我给您一版基础配置思路。",
  预算试探: "王先生，五六千预算更适合先做‘基础盘点’，别一上来就买全套。我建议先确认：<ul><li>有没有社保和百万医疗</li><li>家庭主要收入是谁</li><li>已有保单保额是否够</li></ul>确认后再判断重疾、医疗、意外哪个优先。您可以把已有保单类型发我，我帮您看有没有明显缺口。",
  家庭切入: "赵先生，您这个思路是对的。孩子保障要做，但家庭获客沟通里通常会先看大人，因为大人才是家庭收入来源。建议先做一个轻量建档：您和爱人的年龄、职业、有无社保、孩子年龄、每年预算。确认后我会给您一个‘先后顺序’，不是马上推产品。",
  轻跟进: "小花，单身女生是否需要买保险，关键不是婚姻状态，而是有没有收入责任和抗风险资金。您可以先看这三个问题：有没有社保、手里应急金够不够、如果生病 3-6 个月不能工作是否有压力。我先发您一版基础清单，您看完再决定要不要细聊。",
  老线索唤醒: "小吕，明白，咱们不急着买。养老话题在获客阶段可以先看思路：未来想什么时候退休、每月希望补充多少钱、现在能不能接受长期锁定资金。我先发您一张‘养老准备三步图’，您看完觉得有必要我们再继续拆。"
};

const customerInsights = {
  liu: {
    score: 78,
    summary: "来自内容互动的新线索，已有保障意识但尚未建档。适合先轻问需求和预算，避免过早进入产品细节。",
    facts: ["系统线索，已互动 2 次", "关注女性保障和大病风险", "还处于了解阶段，未明确预算"],
    needs: ["先判断保障优先级", "了解社保、年龄、预算等基础信息", "需要低压力的入门解释"],
    risks: ["过早推产品会造成防备", "需求尚不清晰，容易流失", "需要把保险从‘推销’转成‘风险梳理’"],
    next: ["先确认来源内容和关注点", "引导填写年龄/社保/预算", "发送基础保障顺序清单"]
  },
  lady: {
    score: 82,
    summary: "抖音新加微客户，已表达一家三口保障需求。当前目标是承接来源并完成家庭基础建档。",
    facts: ["抖音引流，新加微", "一家三口，孩子 4 岁", "预算敏感，想先了解顺序"],
    needs: ["明确家庭保障配置顺序", "先做预算和成员信息确认", "需要简单、清晰的入门方案"],
    risks: ["信息过多会打断沟通", "直接报价容易让客户退缩", "未确认家庭主要收入来源"],
    next: ["询问夫妻年龄和职业", "确认每年预算区间", "给出基础版保障顺序图"]
  },
  wang: {
    score: 70,
    summary: "小红书评论线索，预算意识明确。适合先做保单盘点和缺口判断，再引导进入方案沟通。",
    facts: ["小红书评论咨询", "预算约每年五六千", "愿意提供已有保单信息"],
    needs: ["判断预算内优先配置项", "盘点已有保障缺口", "理解保障顺序而非产品堆叠"],
    risks: ["只按预算推荐容易失准", "已有保单可能重复或缺口明显", "客户仍在比较多个账号建议"],
    next: ["邀请发送保单类型截图", "确认家庭责任和收入来源", "输出一版保障缺口摘要"]
  },
  zhao: {
    score: 84,
    summary: "宝爸线索，互动频率高，已进入家庭保障认知教育。适合用‘先大人后孩子’切入建档。",
    facts: ["抖音私信高频", "已婚 1 孩", "原始需求是给孩子买保险"],
    needs: ["理解家庭保障优先级", "确认夫妻基础信息", "需要孩子和大人配置顺序建议"],
    risks: ["可能只愿意给孩子买", "对大人优先逻辑还需教育", "家庭预算边界未明确"],
    next: ["解释大人是家庭收入保障核心", "收集夫妻年龄/社保/职业", "提供亲子家庭基础配置顺序"]
  },
  sun: {
    score: 68,
    summary: "收藏型线索，兴趣明确但行动意愿轻。适合低压跟进，用清单内容唤醒，不宜催促。",
    facts: ["收藏女性保障内容", "单身女性，先了解", "回复节奏偏慢"],
    needs: ["判断单身阶段是否需要保障", "获取基础保障清单", "建立对顾问的信任"],
    risks: ["催促会降低好感", "容易只收藏不转化", "尚未形成明确痛点"],
    next: ["发送 30 秒保障顺序清单", "用三个问题引导自测", "晚间轻提醒，不直接推方案"]
  },
  zhou: {
    score: 62,
    summary: "老线索唤醒阶段，客户对养老有兴趣但明确不急买。适合内容型跟进，保持关系温度。",
    facts: ["系统老线索", "关注养老资金准备", "明确表示暂不急买"],
    needs: ["先理解养老准备思路", "低压力获取内容", "后续再决定是否细聊"],
    risks: ["直接推年金会引起反感", "决策周期较长", "需要持续内容触达"],
    next: ["发送养老准备三步图", "询问理想退休年龄", "设置 3 天后轻跟进"]
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
