---
layout: single
title: "LecturePulse"
permalink: /lecturepulse/
author_profile: false
---

{% include base_path %}

<div class="lecture-pulse-app">
  <div class="lecture-pulse-card">
    <h2>LecturePulse</h2>
    <p class="lecture-pulse-subtitle">Choose the color that matches how you feel about the current topic.</p>
    <div class="lecture-pulse-buttons">
      <button class="lecture-pulse-button lecture-pulse-button--green" data-vote="green">🟢 Green — I’m following</button>
      <button class="lecture-pulse-button lecture-pulse-button--yellow" data-vote="yellow">🟡 Yellow — I’m getting there</button>
      <button class="lecture-pulse-button lecture-pulse-button--red" data-vote="red">🔴 Red — I need help</button>
    </div>
    <p id="lecture-pulse-status" class="lecture-pulse-status" aria-live="polite">Waiting for your vote…</p>
  </div>
</div>

<style>
  .lecture-pulse-app {
    display: grid;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .lecture-pulse-card {
    background: #ffffff;
    border: 1px solid #d9e1e8;
    border-radius: 14px;
    padding: 1.25rem;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  }

  .lecture-pulse-subtitle {
    margin-top: 0;
    color: #4b5563;
  }

  .lecture-pulse-buttons {
    display: grid;
    gap: 0.75rem;
  }

  .lecture-pulse-button {
    width: 100%;
    padding: 0.95rem 1rem;
    border: none;
    border-radius: 12px;
    color: #111827;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .lecture-pulse-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
  }

  .lecture-pulse-button--green { background: #86efac; }
  .lecture-pulse-button--yellow { background: #fde68a; }
  .lecture-pulse-button--red { background: #fca5a5; }

  .lecture-pulse-status {
    margin-top: 1rem;
    font-weight: 600;
    color: #1f2937;
  }
</style>

<script>
  window.LECTURE_PULSE_FIREBASE_CONFIG = {
    apiKey: "AIzaSyBU_1GwzgN9Db4GrEICN79mGijh6aDHprw",
    authDomain: "lecture-feedback-e758b.firebaseapp.com",
    databaseURL: "https://lecture-feedback-e758b-default-rtdb.firebaseio.com",
    projectId: "lecture-feedback-e758b",
    storageBucket: "lecture-feedback-e758b.firebasestorage.app",
    messagingSenderId: "832755872153",
    appId: "1:832755872153:web:0d2b546fcccfad7a296308",
    measurementId: "G-ZG84ZD9VGV"
  };
</script>
<script src="https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.13.0/firebase-database-compat.js"></script>
<script src="{{ base_path }}/assets/js/student-check-in.js"></script>
