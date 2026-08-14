// Pinned to 4.10.38 (not the latest 6.x) because pdf.js versions after
// March 2026 use Math.sumPrecise internally, which Safari doesn't support yet
// and crashes the worker with "Math.sumPrecise is not a function".
import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

const apiBase = window.SAM_API_BASE;
const adminEmail = window.SAM_ADMIN_EMAIL;
const firebaseConfig = window.SAM_FIREBASE_CONFIG || {};

const signinCard = document.getElementById("sb-admin-signin-card");
const signinButton = document.getElementById("sb-signin-button");
const signinMessage = document.getElementById("sb-signin-message");
const adminApp = document.getElementById("sb-admin-app");
const signoutButton = document.getElementById("sb-signout-button");
const adminEmailEl = document.getElementById("sb-admin-email");

const dateInput = document.getElementById("sb-lecture-date");
const titleInput = document.getElementById("sb-lecture-title");
const pdfInput = document.getElementById("sb-lecture-pdf");
const extractButton = document.getElementById("sb-extract-button");
const previewTextarea = document.getElementById("sb-lecture-preview");
const extractWarning = document.getElementById("sb-extract-warning");
const uploadButton = document.getElementById("sb-upload-button");
const uploadMessage = document.getElementById("sb-upload-message");
const lectureList = document.getElementById("sb-lecture-list");

let currentUser = null;
let selectedFile = null;

function hasValidFirebaseConfig() {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    typeof firebase !== "undefined"
  );
}

function showSignedOut(message) {
  signinCard.style.display = "block";
  adminApp.classList.add("sb-admin-app--locked");
  if (message) {
    signinMessage.textContent = message;
  }
}

function showSignedIn(user) {
  signinCard.style.display = "none";
  adminApp.classList.remove("sb-admin-app--locked");
  adminEmailEl.textContent = user.email;
  loadLectureList();
}

async function handleAuthStateChanged(user) {
  if (!user) {
    currentUser = null;
    showSignedOut("");
    return;
  }

  if (user.email !== adminEmail || !user.emailVerified) {
    await firebase.auth().signOut();
    currentUser = null;
    showSignedOut("This account is not authorized to manage SAM content.");
    return;
  }

  currentUser = user;
  showSignedIn(user);
}

async function signIn() {
  signinMessage.textContent = "";
  try {
    await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  } catch (error) {
    signinMessage.textContent = "Sign-in failed: " + error.message;
  }
}

async function signOut() {
  await firebase.auth().signOut();
}

function onPdfSelected() {
  selectedFile = pdfInput.files[0] || null;
  extractButton.disabled = !selectedFile;
  extractWarning.textContent = "";
}

async function extractPdfText() {
  if (!selectedFile) return;

  extractButton.disabled = true;
  extractButton.textContent = "Extracting…";
  extractWarning.textContent = "";

  try {
    const arrayBuffer = await selectedFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageTexts = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      pageTexts.push(`[Page ${pageNum}]\n${pageText}`);
    }

    const fullText = pageTexts.join("\n\n");
    previewTextarea.value = fullText;

    const avgCharsPerPage = fullText.length / pdf.numPages;
    if (avgCharsPerPage < 20) {
      extractWarning.textContent =
        "Very little text was extracted — this PDF may be scanned/image-only slides. Try exporting directly from your slide software instead.";
    }

    updateUploadButtonState();
  } catch (error) {
    extractWarning.textContent = "Couldn't extract text from this PDF: " + error.message;
  } finally {
    extractButton.disabled = false;
    extractButton.textContent = "Extract text from PDF";
  }
}

function updateUploadButtonState() {
  uploadButton.disabled = !(
    dateInput.value &&
    titleInput.value.trim() &&
    previewTextarea.value.trim()
  );
}

async function uploadLecture() {
  if (!currentUser) return;

  uploadButton.disabled = true;
  uploadMessage.textContent = "Uploading…";

  try {
    const idToken = await currentUser.getIdToken(true);
    const response = await fetch(`${apiBase}/api/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        lecture_date: dateInput.value,
        lecture_title: titleInput.value.trim(),
        source_filename: selectedFile ? selectedFile.name : null,
        extracted_text: previewTextarea.value.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      uploadMessage.textContent = data.error || "Upload failed.";
      return;
    }

    uploadMessage.textContent = "Lecture added successfully.";
    dateInput.value = "";
    titleInput.value = "";
    previewTextarea.value = "";
    pdfInput.value = "";
    selectedFile = null;
    extractButton.disabled = true;
    loadLectureList();
  } catch (error) {
    uploadMessage.textContent = "Upload failed: " + error.message;
  } finally {
    updateUploadButtonState();
  }
}

async function loadLectureList() {
  if (!currentUser) return;

  try {
    const idToken = await currentUser.getIdToken();
    const response = await fetch(`${apiBase}/api/lectures`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    const data = await response.json();

    lectureList.innerHTML = "";
    (data.lectures || []).forEach((lecture) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${lecture.lecture_date} — ${lecture.lecture_title}</span>`;
      lectureList.appendChild(li);
    });
  } catch (error) {
    lectureList.innerHTML = `<li>Couldn't load lecture list: ${error.message}</li>`;
  }
}

function attachListeners() {
  signinButton.addEventListener("click", signIn);
  signoutButton.addEventListener("click", signOut);
  pdfInput.addEventListener("change", onPdfSelected);
  extractButton.addEventListener("click", extractPdfText);
  uploadButton.addEventListener("click", uploadLecture);
  [dateInput, titleInput, previewTextarea].forEach((el) =>
    el.addEventListener("input", updateUploadButtonState)
  );
}

if (!apiBase || apiBase.includes("YOUR-SUBDOMAIN")) {
  showSignedOut("SAM isn't configured yet — set SAM_API_BASE once the Worker is deployed.");
} else if (!hasValidFirebaseConfig()) {
  showSignedOut("Firebase isn't configured for this page.");
} else {
  firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged(handleAuthStateChanged);
}

attachListeners();
