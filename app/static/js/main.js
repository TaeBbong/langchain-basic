// API base URL is not needed as we are serving from the same origin
const API_BASE_URL = "";

// === Chat ===

function setChatStatus(text, isError = false) {
  const el = document.getElementById("chat-status");
  if (el) {
    el.textContent = text;
    el.classList.toggle("text-danger", isError);
    el.classList.toggle("text-secondary", !isError);
  }
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

  setChatStatus("Sending...");
  box.classList.remove("empty");
  content.textContent = "Thinking...";

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
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const reply = data.reply ?? "(Invalid response format)";
    content.textContent = reply;
    setChatStatus("Done");
  } catch (err) {
    console.error(err);
    content.textContent = "An error occurred. Please check the console.";
    setChatStatus(`Error: ${err.message}`, true);
  } finally {
    buttonEls.forEach((b) => (b.disabled = false));
  }
}

// === Study Plan ===

function setPlanStatus(text, isError = false) {
  const el = document.getElementById("plan-status");
  if (el) {
    el.textContent = text;
    el.classList.toggle("text-danger", isError);
    el.classList.toggle("text-secondary", !isError);
  }
}

function clearPlanOutput() {
  const rendered = document.getElementById("plan-output-rendered");
  const raw = document.getElementById("plan-output-raw");
  const box = document.getElementById("plan-output");

  rendered.innerHTML =
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
      "The 'plan' object is missing. Please check the FastAPI response structure.";
    raw.textContent = "";
    return;
  }

  const { title, total_hours, focus_topic, slots = [], tips = [] } = plan;

  const metaHtml = `
    <h6 class="card-subtitle mb-2">${title ?? "Untitled Plan"}</h6>
    <div class="mb-3">
      <span class="badge bg-primary me-1">Total: ${
        total_hours ?? "?"
      }h</span>
      ${
        focus_topic
          ? `<span class="badge bg-info">${focus_topic}</span>`
          : ""
      }
    </div>
  `;

  const slotsHtml =
    slots.length > 0
      ? `
    <div>
      <h6 class="small mb-2">Time Slots</h6>
      <ul class="list-group list-group-flush">
        ${slots
          .map((s) => {
            const start = s.start_time ?? "?";
            const end = s.end_time ?? "?";
            const task = s.task ?? "";
            const category = s.category ?? "";
            return `
              <li class="list-group-item bg-transparent px-0 py-2">
                <div class="d-flex w-100 justify-content-between">
                  <p class="mb-1">${task}</p>
                  <small class="text-nowrap ps-2">${start}–${end}</small>
                </div>
                ${
                  category
                    ? `<small class="text-secondary">${category}</small>`
                    : ""
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
    <div class="mt-3">
      <h6 class="small mb-2">Tips</h6>
      <ul class="list-unstyled small">
        ${tips.map((t) => `<li class="mb-1">💡 ${t}</li>`).join("")}
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
    alert("Please enter a goal.");
    return;
  }

  const available_hours = parseFloat(hoursValue) || 1;

  const box = document.getElementById("plan-output");
  const rendered = document.getElementById("plan-output-rendered");
  const raw = document.getElementById("plan-output-raw");

  box.classList.remove("empty");
  rendered.innerHTML = "Generating plan...";
  raw.textContent = "";
  setPlanStatus("Generating...");

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
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const plan = data.plan ?? data; // Fallback if 'plan' key is missing
    renderPlan(plan);
    setPlanStatus("Done");
  } catch (err) {
    console.error(err);
    rendered.textContent = "An error occurred. Please check the console.";
    raw.textContent = "";
    setPlanStatus(`Error: ${err.message}`, true);
  } finally {
    buttonEls.forEach((b) => (b.disabled = false));
  }
}