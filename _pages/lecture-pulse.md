---
layout: single
title: "Teacher Live Pulse"
permalink: /lecturepulse-admin/
author_profile: false
---

{% include base_path %}

<div id="teacher-auth-overlay" class="teacher-auth-overlay">
  <div class="teacher-auth-card">
    <h2>Teacher access required</h2>
    <p>Enter the classroom access code to open the live pulse monitor.</p>
    <input id="teacher-access-code" class="teacher-access-input" type="password" placeholder="Enter access code" />
    <button id="teacher-auth-submit" class="teacher-auth-submit">Unlock teacher view</button>
    <p id="teacher-auth-message" class="teacher-auth-message" aria-live="polite"></p>
  </div>
</div>

<div id="teacher-pulse-app" class="lecture-pulse-app teacher-pulse-app--locked">
  <div class="lecture-pulse-card lecture-pulse-card--teacher">
    <h2>Live classroom pulse</h2>
    <p class="lecture-pulse-subtitle">This panel updates in real time when students submit their responses.</p>
    <p id="lecture-pulse-status" class="lecture-pulse-status" aria-live="polite">Waiting for the next response…</p>

    <div class="lecture-pulse-bar-chart">
      <div class="lecture-pulse-bar-row">
        <div class="lecture-pulse-bar-label">Green</div>
        <div class="lecture-pulse-bar-track">
          <div id="bar-green" class="lecture-pulse-bar lecture-pulse-bar--green" style="width: 0%"></div>
        </div>
        <div id="count-green" class="lecture-pulse-bar-value">0</div>
      </div>
      <div class="lecture-pulse-bar-row">
        <div class="lecture-pulse-bar-label">Yellow</div>
        <div class="lecture-pulse-bar-track">
          <div id="bar-yellow" class="lecture-pulse-bar lecture-pulse-bar--yellow" style="width: 0%"></div>
        </div>
        <div id="count-yellow" class="lecture-pulse-bar-value">0</div>
      </div>
      <div class="lecture-pulse-bar-row">
        <div class="lecture-pulse-bar-label">Red</div>
        <div class="lecture-pulse-bar-track">
          <div id="bar-red" class="lecture-pulse-bar lecture-pulse-bar--red" style="width: 0%"></div>
        </div>
        <div id="count-red" class="lecture-pulse-bar-value">0</div>
      </div>
    </div>

    <div class="lecture-pulse-total-row">
      <span>Total responses</span>
      <strong id="count-total">0</strong>
    </div>

    <button id="lecture-pulse-reset" class="lecture-pulse-reset">Reset counts</button>
  </div>
</div>

<style>
  .teacher-auth-overlay {
    position: fixed;
    inset: 0;
    background: rgba(17, 24, 39, 0.78);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 1rem;
  }

  .teacher-auth-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 1.5rem;
    width: min(100%, 420px);
    box-shadow: 0 16px 44px rgba(0, 0, 0, 0.2);
  }

  .teacher-access-input {
    width: 100%;
    padding: 0.9rem 1rem;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    margin: 0.75rem 0;
    font-size: 1rem;
  }

  .teacher-auth-submit {
    width: 100%;
    padding: 0.9rem 1rem;
    border: none;
    border-radius: 10px;
    background: #111827;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
  }

  .teacher-auth-message {
    margin-top: 0.75rem;
    color: #b91c1c;
    font-weight: 600;
  }

  .lecture-pulse-app {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .teacher-pulse-app--locked {
    display: none;
  }

  .lecture-pulse-card {
    background: #ffffff;
    border: 1px solid #d9e1e8;
    border-radius: 14px;
    padding: 1.25rem;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  }

  .lecture-pulse-card--teacher {
    background: linear-gradient(180deg, #fffdf2 0%, #ffffff 100%);
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

  .lecture-pulse-bar-chart {
    display: grid;
    gap: 0.9rem;
    margin-top: 1rem;
  }

  .lecture-pulse-bar-row {
    display: grid;
    grid-template-columns: 78px 1fr 42px;
    align-items: center;
    gap: 0.75rem;
  }

  .lecture-pulse-bar-label {
    font-weight: 700;
  }

  .lecture-pulse-bar-track {
    width: 100%;
    height: 18px;
    background: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
  }

  .lecture-pulse-bar {
    height: 100%;
    border-radius: 999px;
    transition: width 0.25s ease;
  }

  .lecture-pulse-bar--green { background: #22c55e; }
  .lecture-pulse-bar--yellow { background: #facc15; }
  .lecture-pulse-bar--red { background: #ef4444; }

  .lecture-pulse-bar-value {
    text-align: right;
    font-weight: 800;
  }

  .lecture-pulse-total-row {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 700;
    border-top: 1px solid #d9e1e8;
    padding-top: 0.75rem;
  }

  .lecture-pulse-reset {
    width: 100%;
    margin-top: 1rem;
    border: none;
    border-radius: 10px;
    background: #111827;
    color: #ffffff;
    padding: 0.8rem 1rem;
    font-weight: 700;
    cursor: pointer;
  }

  @media (max-width: 680px) {
    .lecture-pulse-stat-grid {
      grid-template-columns: 1fr;
    }
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
  window.LECTURE_PULSE_TEACHER_CODE = "F26";
</script>
<script src="https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.13.0/firebase-database-compat.js"></script>
<script src="{{ base_path }}/assets/js/lecture-pulse.js"></script>
