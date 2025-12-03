// 같은 Origin에서 서빙되기 때문에 굳이 base URL은 필요 없음
const API_BASE_URL = ""; // '' + '/chat' => '/chat'

// === Chat ===

function setChatStatus(text, isError = false) {
  const el = document.getElementById("chat-status");
  el.textContent = text;
  el.classList.toggle("status-error", isError);
}

function clearChatOutput() {
  const box = document.getElementById("chat-output");
  const content = document.getElementById("chat-output-text");
  content.textContent = "아직 응답이 없습니다. 메시지를 보내보세요.";
  box.classList.add("empty");
  setChatStatus("Ready");
}

async function callChat() {
  const systemPrompt = document.getElementById("systemPrompt").value.trim();
  const userMessage = document.getElementById("userMessage").value.trim();
  const box = document.getElementById("chat-output");
  const content = document.getElementById("chat-output-text");

  if (!userMessage) {
    alert("User message를 입력해주세요.");
    return;
  }

  setChatStatus("Sending request...");
  box.classList.remove("empty");
  content.textContent = "생각 중입니다...";

  const buttonEls = document.querySelectorAll("button");
  buttonEls.forEach((b) => (b.disabled = true));

  try {
    const res = await fetch(API_BASE_URL + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_prompt: systemPrompt || undefined,
        user_message: userMessage,
      }),
    });

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const data = await res.json();
    const reply = data.reply ?? "(응답 형식이 예상과 다릅니다.)";
    content.textContent = reply;
    setChatStatus("Done");
  } catch (err) {
    console.error(err);
    content.textContent = "요청 중 오류가 발생했습니다. 콘솔을 확인해주세요.";
    setChatStatus("Error: " + err.message, true);
  } finally {
    buttonEls.forEach((b) => (b.disabled = false));
  }
}

// === Study Plan ===

function setPlanStatus(text, isError = false) {
  const el = document.getElementById("plan-status");
  el.textContent = text;
  el.classList.toggle("status-error", isError);
}

function clearPlanOutput() {
  const rendered = document.getElementById("plan-output-rendered");
  const raw = document.getElementById("plan-output-raw");
  const box = document.getElementById("plan-output");

  rendered.textContent =
    "아직 생성된 계획이 없습니다. 목표와 시간을 입력하고 Generate 버튼을 눌러보세요.";
  raw.textContent = "";
  raw.style.display = "none";
  box.classList.add("empty");
  setPlanStatus("Ready");
}

function toggleRawJson() {
  const raw = document.getElementById("plan-output-raw");
  raw.style.display = raw.style.display === "none" ? "block" : "none";
}

function renderPlan(plan) {
  const box = document.getElementById("plan-output");
  const rendered = document.getElementById("plan-output-rendered");
  const raw = document.getElementById("plan-output-raw");

  box.classList.remove("empty");

  if (!plan) {
    rendered.textContent =
      "plan 객체가 없습니다. FastAPI 응답 구조를 확인해주세요.";
    raw.textContent = "";
    return;
  }

  const { title, total_hours, focus_topic, slots = [], tips = [] } = plan;

  const metaHtml = `
    <div class="plan-meta">
      <div><strong>${title ?? "Untitled Plan"}</strong></div>
      <div class="chips">
        <span class="chip">Total: ${total_hours ?? "?"}h</span>
        ${focus_topic ? `<span class="chip">Focus: ${focus_topic}</span>` : ""}
      </div>
    </div>
  `;

  const slotsHtml =
    slots.length > 0
      ? `
    <div style="margin-top:4px;">
      <div style="font-size:0.78rem; font-weight:500; color:var(--text); margin-bottom:2px;">Time Slots</div>
      <ul class="slots-list">
        ${slots
          .map((s) => {
            const start = s.start_time ?? "?";
            const end = s.end_time ?? "?";
            const task = s.task ?? "";
            const category = s.category ?? "";
            return `
              <li>
                <span class="slot-time">${start}–${end}</span>
                <span class="slot-task">${task}</span>
                ${
                  category ? `<div class="slot-category">${category}</div>` : ""
                }
              </li>
            `;
          })
          .join("")}
      </ul>
    </div>
  `
      : "";

  const tipsHtml =
    tips.length > 0
      ? `
    <div style="margin-top:6px;">
      <div style="font-size:0.78rem; font-weight:500; color:var(--text); margin-bottom:2px;">Tips</div>
      <ul class="tips-list">
        ${tips.map((t) => `<li>${t}</li>`).join("")}
      </ul>
    </div>
  `
      : "";

  rendered.innerHTML = metaHtml + slotsHtml + tipsHtml;

  raw.textContent = JSON.stringify(plan, null, 2);
}

async function callPlan() {
  const goal = document.getElementById("plan-goal").value.trim();
  const hoursValue = document.getElementById("plan-hours").value;
  const level = document.getElementById("plan-level").value;

  if (!goal) {
    alert("Goal을 입력해주세요.");
    return;
  }

  const available_hours = parseFloat(hoursValue) || 1;

  const box = document.getElementById("plan-output");
  const rendered = document.getElementById("plan-output-rendered");
  const raw = document.getElementById("plan-output-raw");

  box.classList.remove("empty");
  rendered.textContent = "계획을 생성하는 중입니다...";
  raw.textContent = "";
  setPlanStatus("Generating plan...");

  const buttonEls = document.querySelectorAll("button");
  buttonEls.forEach((b) => (b.disabled = true));

  try {
    const res = await fetch(API_BASE_URL + "/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal,
        available_hours,
        level,
      }),
    });

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const data = await res.json();
    const plan = data.plan ?? data; // 혹시 plan 키 없이 반환되면 fallback
    renderPlan(plan);
    setPlanStatus("Done");
  } catch (err) {
    console.error(err);
    rendered.textContent = "요청 중 오류가 발생했습니다. 콘솔을 확인해주세요.";
    raw.textContent = "";
    setPlanStatus("Error: " + err.message, true);
  } finally {
    buttonEls.forEach((b) => (b.disabled = false));
  }
}
