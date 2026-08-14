(function () {
  const codeStorageKey = "study-buddy-class-code";
  const apiBase = window.STUDY_BUDDY_API_BASE;

  const overlay = document.getElementById("sb-code-overlay");
  const codeInput = document.getElementById("sb-code-input");
  const codeSubmit = document.getElementById("sb-code-submit");
  const codeMessage = document.getElementById("sb-code-message");
  const chatApp = document.getElementById("sb-chat-app");
  const messagesEl = document.getElementById("sb-chat-messages");
  const chatInput = document.getElementById("sb-chat-input");
  const chatSend = document.getElementById("sb-chat-send");

  let classCode = localStorage.getItem(codeStorageKey) || "";
  let sending = false;

  function unlock() {
    overlay.style.display = "none";
    chatApp.classList.remove("sb-chat-app--locked");
  }

  function lock(message) {
    overlay.style.display = "flex";
    chatApp.classList.add("sb-chat-app--locked");
    codeMessage.textContent = message || "";
  }

  function addBubble(text, kind) {
    const bubble = document.createElement("div");
    bubble.className = "sb-chat-bubble sb-chat-bubble--" + kind;
    bubble.textContent = text;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  async function sendQuestion(question) {
    if (sending) return;
    sending = true;
    chatSend.disabled = true;

    addBubble(question, "student");
    const thinkingBubble = addBubble("Thinking…", "assistant");

    try {
      const response = await fetch(apiBase + "/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classCode: classCode, question: question }),
      });

      const data = await response.json();

      if (response.status === 401) {
        thinkingBubble.remove();
        localStorage.removeItem(codeStorageKey);
        lock(data.error || "Invalid class access code. Please try again.");
        return;
      }

      if (!response.ok) {
        thinkingBubble.className = "sb-chat-bubble sb-chat-bubble--error";
        thinkingBubble.textContent = data.error || "Something went wrong. Please try again.";
        return;
      }

      thinkingBubble.textContent = data.answer;
    } catch (error) {
      thinkingBubble.className = "sb-chat-bubble sb-chat-bubble--error";
      thinkingBubble.textContent = "Couldn't reach Study Buddy: " + error.message;
    } finally {
      sending = false;
      chatSend.disabled = false;
    }
  }

  function handleSend() {
    const question = chatInput.value.trim();
    if (!question) return;
    chatInput.value = "";
    sendQuestion(question);
  }

  function handleCodeSubmit() {
    const entered = codeInput.value.trim();
    if (!entered) {
      codeMessage.textContent = "Please enter a class code.";
      return;
    }
    classCode = entered;
    localStorage.setItem(codeStorageKey, entered);
    unlock();
  }

  codeSubmit.addEventListener("click", handleCodeSubmit);
  codeInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCodeSubmit();
    }
  });

  chatSend.addEventListener("click", handleSend);
  chatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  });

  if (!apiBase || apiBase.indexOf("YOUR-SUBDOMAIN") !== -1) {
    lock("Study Buddy isn't configured yet — check back once the professor has finished setup.");
  } else if (classCode) {
    unlock();
  } else {
    lock("");
  }
})();
