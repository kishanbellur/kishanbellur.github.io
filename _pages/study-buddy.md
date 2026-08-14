---
layout: single
title: "Study Buddy"
permalink: /studybuddy/
author_profile: false
---

{% include base_path %}

<div id="sb-code-overlay" class="sb-overlay">
  <div class="sb-card sb-overlay-card">
    <h2>Class access required</h2>
    <p class="sb-subtitle">Enter the class access code your professor shared to start asking Study Buddy questions.</p>
    <input id="sb-code-input" class="sb-input" type="password" placeholder="Enter class code" />
    <button id="sb-code-submit" class="sb-button sb-button--primary">Unlock Study Buddy</button>
    <p id="sb-code-message" class="sb-message" aria-live="polite"></p>
  </div>
</div>

<div id="sb-chat-app" class="sb-chat-app sb-chat-app--locked">
  <div class="sb-card sb-chat-card">
    <h2>Study Buddy</h2>
    <p class="sb-subtitle">Ask about anything covered in lecture — Study Buddy only answers from the material your professor has uploaded.</p>
    <div id="sb-chat-messages" class="sb-chat-messages"></div>
    <div class="sb-chat-input-row">
      <input id="sb-chat-input" class="sb-input" type="text" placeholder="Ask a question…" />
      <button id="sb-chat-send" class="sb-button sb-button--primary">Send</button>
    </div>
  </div>
</div>

<style>
  .sb-overlay {
    position: fixed;
    inset: 0;
    background: rgba(17, 24, 39, 0.78);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 1rem;
  }

  .sb-overlay-card {
    width: min(100%, 420px);
    text-align: center;
  }

  .sb-card {
    background: #ffffff;
    border: 1px solid #d9e1e8;
    border-radius: 14px;
    padding: 1.25rem;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  }

  .sb-subtitle {
    color: #4b5563;
    margin-top: 0.25rem;
  }

  .sb-input {
    width: 100%;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    font-size: 1rem;
    box-sizing: border-box;
    margin: 0.5rem 0;
  }

  .sb-button {
    padding: 0.85rem 1.25rem;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .sb-button--primary {
    background: #111827;
    color: #ffffff;
    width: 100%;
  }

  .sb-message {
    margin-top: 0.75rem;
    font-weight: 600;
    color: #b91c1c;
    min-height: 1.2em;
  }

  .sb-chat-app--locked {
    display: none;
  }

  .sb-chat-card {
    max-width: 720px;
    margin: 1.5rem auto;
  }

  .sb-chat-messages {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1rem 0;
    max-height: 55vh;
    overflow-y: auto;
  }

  .sb-chat-bubble {
    padding: 0.75rem 1rem;
    border-radius: 12px;
    max-width: 85%;
    white-space: pre-wrap;
    line-height: 1.45;
  }

  .sb-chat-bubble--student {
    align-self: flex-end;
    background: #111827;
    color: #ffffff;
  }

  .sb-chat-bubble--assistant {
    align-self: flex-start;
    background: #f1f5f9;
    color: #1f2937;
  }

  .sb-chat-bubble--error {
    align-self: flex-start;
    background: #fee2e2;
    color: #991b1b;
  }

  .sb-chat-input-row {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .sb-chat-input-row .sb-input {
    margin: 0;
  }

  .sb-chat-input-row .sb-button {
    width: auto;
    white-space: nowrap;
  }
</style>

<script>
  window.STUDY_BUDDY_API_BASE = "https://study-buddy-worker.quiet-forest-6b67.workers.dev";
</script>
<script src="{{ base_path }}/assets/js/study-buddy.js"></script>
