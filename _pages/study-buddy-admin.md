---
layout: single
title: "Study Buddy — Add Lecture Content"
permalink: /studybuddy-admin/
author_profile: false
---

{% include base_path %}

<div id="sb-admin-signin-card" class="sb-card sb-signin-card">
  <h2>Study Buddy admin</h2>
  <p class="sb-subtitle">Sign in with your Google account to add or manage lecture content.</p>
  <button id="sb-signin-button" class="sb-button sb-button--primary">Sign in with Google</button>
  <p id="sb-signin-message" class="sb-message" aria-live="polite"></p>
</div>

<div id="sb-admin-app" class="sb-admin-app sb-admin-app--locked">
  <div class="sb-card">
    <div class="sb-admin-header">
      <div>
        <h2>Add a lecture</h2>
        <p class="sb-subtitle">Signed in as <strong id="sb-admin-email"></strong></p>
      </div>
      <button id="sb-signout-button" class="sb-button sb-button--light">Sign out</button>
    </div>

    <label class="sb-field-label" for="sb-lecture-date">Lecture date</label>
    <input id="sb-lecture-date" class="sb-input" type="date" />

    <label class="sb-field-label" for="sb-lecture-title">Lecture title</label>
    <input id="sb-lecture-title" class="sb-input" type="text" placeholder="e.g. Training Neural Networks" />

    <label class="sb-field-label" for="sb-lecture-pdf">Slides (PDF)</label>
    <input id="sb-lecture-pdf" class="sb-input" type="file" accept="application/pdf" />
    <button id="sb-extract-button" class="sb-button sb-button--light" disabled>Extract text from PDF</button>

    <label class="sb-field-label" for="sb-lecture-preview">Extracted text (review/edit before uploading)</label>
    <textarea id="sb-lecture-preview" class="sb-textarea" rows="10" placeholder="Extracted text will appear here…"></textarea>
    <p id="sb-extract-warning" class="sb-warning" aria-live="polite"></p>

    <button id="sb-upload-button" class="sb-button sb-button--primary" disabled>Upload to Study Buddy</button>
    <p id="sb-upload-message" class="sb-message" aria-live="polite"></p>
  </div>

  <div class="sb-card">
    <h2>Already ingested</h2>
    <ul id="sb-lecture-list" class="sb-lecture-list"></ul>
  </div>
</div>

<style>
  .sb-card {
    background: #ffffff;
    border: 1px solid #d9e1e8;
    border-radius: 14px;
    padding: 1.25rem;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
    margin-bottom: 1rem;
  }

  .sb-signin-card {
    max-width: 480px;
    margin: 3rem auto;
    text-align: center;
  }

  .sb-subtitle {
    color: #4b5563;
    margin-top: 0.25rem;
  }

  .sb-button {
    padding: 0.85rem 1.25rem;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 0.75rem;
  }

  .sb-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .sb-button--primary {
    background: #111827;
    color: #ffffff;
  }

  .sb-button--light {
    background: #e5e7eb;
    color: #111827;
  }

  .sb-admin-app--locked {
    display: none;
  }

  .sb-admin-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .sb-field-label {
    display: block;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 0.35rem;
  }

  .sb-input,
  .sb-textarea {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 1rem;
    font-family: inherit;
    box-sizing: border-box;
  }

  .sb-textarea {
    resize: vertical;
  }

  .sb-message {
    margin-top: 0.75rem;
    font-weight: 600;
    color: #1f2937;
    min-height: 1.2em;
  }

  .sb-warning {
    margin-top: 0.5rem;
    color: #b45309;
    font-weight: 600;
    min-height: 1.2em;
  }

  .sb-lecture-list {
    list-style: none;
    margin: 0.5rem 0 0;
    padding: 0;
  }

  .sb-lecture-list li {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid #eef2f6;
  }

  .sb-lecture-list li:last-child {
    border-bottom: none;
  }
</style>

<script>
  window.STUDY_BUDDY_API_BASE = "https://study-buddy-worker.quiet-forest-6b67.workers.dev";
  window.STUDY_BUDDY_FIREBASE_CONFIG = {
    apiKey: "AIzaSyBU_1GwzgN9Db4GrEICN79mGijh6aDHprw",
    authDomain: "lecture-feedback-e758b.firebaseapp.com",
    databaseURL: "https://lecture-feedback-e758b-default-rtdb.firebaseio.com",
    projectId: "lecture-feedback-e758b",
    storageBucket: "lecture-feedback-e758b.firebasestorage.app",
    messagingSenderId: "832755872153",
    appId: "1:832755872153:web:0d2b546fcccfad7a296308",
    measurementId: "G-ZG84ZD9VGV"
  };
  window.STUDY_BUDDY_ADMIN_EMAIL = "kishanbellur@gmail.com";
</script>
<script src="https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.13.0/firebase-auth-compat.js"></script>
<script type="module" src="{{ base_path }}/assets/js/study-buddy-admin.js"></script>
