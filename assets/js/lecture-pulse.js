(function () {
  const DEFAULT_COUNTS = {
    green: 0,
    yellow: 0,
    red: 0,
  };

  const voteStorageKey = 'lecture-pulse-selected-vote';
  const countsStorageKey = 'lecture-pulse-counts';
  const broadcastChannelName = 'lecture-pulse-demo';

  const statusEl = document.getElementById('lecture-pulse-status');
  const countEls = {
    green: document.getElementById('count-green'),
    yellow: document.getElementById('count-yellow'),
    red: document.getElementById('count-red'),
    total: document.getElementById('count-total'),
  };
  const barEls = {
    green: document.getElementById('bar-green'),
    yellow: document.getElementById('bar-yellow'),
    red: document.getElementById('bar-red'),
  };
  const resetButton = document.getElementById('lecture-pulse-reset');
  const authOverlay = document.getElementById('teacher-auth-overlay');
  const authSubmit = document.getElementById('teacher-auth-submit');
  const authCodeInput = document.getElementById('teacher-access-code');
  const authMessage = document.getElementById('teacher-auth-message');
  const pulseApp = document.getElementById('teacher-pulse-app');
  const teacherCode = window.LECTURE_PULSE_TEACHER_CODE || 'classroom2026';

  const firebaseConfig = window.LECTURE_PULSE_FIREBASE_CONFIG || {};

  let counts = loadCounts();
  let databaseRef = null;
  let usingFirebase = false;
  let previousVote = localStorage.getItem(voteStorageKey);
  let channel = null;

  function loadCounts() {
    try {
      const stored = JSON.parse(localStorage.getItem(countsStorageKey) || '{}');
      return {
        green: Number(stored.green || 0),
        yellow: Number(stored.yellow || 0),
        red: Number(stored.red || 0),
      };
    } catch (error) {
      return { ...DEFAULT_COUNTS };
    }
  }

  function saveCounts() {
    localStorage.setItem(countsStorageKey, JSON.stringify(counts));
  }

  function renderCounts() {
    const total = counts.green + counts.yellow + counts.red;
    const safeTotal = total || 1;

    countEls.green.textContent = counts.green;
    countEls.yellow.textContent = counts.yellow;
    countEls.red.textContent = counts.red;
    countEls.total.textContent = total;

    barEls.green.style.width = Math.round((counts.green / safeTotal) * 100) + '%';
    barEls.yellow.style.width = Math.round((counts.yellow / safeTotal) * 100) + '%';
    barEls.red.style.width = Math.round((counts.red / safeTotal) * 100) + '%';
  }

  function normalizeCounts(data) {
    return {
      green: Number(data.green || 0),
      yellow: Number(data.yellow || 0),
      red: Number(data.red || 0),
    };
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function unlockTeacherView() {
    if (!authOverlay || !pulseApp) {
      return;
    }

    authOverlay.style.display = 'none';
    pulseApp.classList.remove('teacher-pulse-app--locked');
  }

  function handleTeacherAuth() {
    const enteredCode = String(authCodeInput.value || '').trim().toLowerCase();
    const expectedCode = String(teacherCode || '').trim().toLowerCase();

    if (enteredCode === expectedCode) {
      unlockTeacherView();
      authMessage.textContent = '';
      return;
    }

    authMessage.textContent = 'Incorrect access code. Please try again.';
  }

  function initializeDemoBroadcast() {
    if (typeof BroadcastChannel === 'undefined') {
      return;
    }

    channel = new BroadcastChannel(broadcastChannelName);
    channel.onmessage = function (event) {
      const incoming = event.data || {};
      if (incoming.type === 'count-update') {
        counts = incoming.counts;
        saveCounts();
        renderCounts();
      }
    };
  }

  function publishDemoCounts() {
    if (channel) {
      channel.postMessage({
        type: 'count-update',
        counts: counts,
      });
    }
  }

  function updateDemoCounts(vote) {
    if (previousVote && previousVote !== vote) {
      counts[previousVote] = Math.max(0, counts[previousVote] - 1);
    }

    if (!previousVote || previousVote !== vote) {
      counts[vote] += 1;
      previousVote = vote;
      localStorage.setItem(voteStorageKey, vote);
    }

    saveCounts();
    renderCounts();
    publishDemoCounts();
  }

  function initFirebase() {
    const hasValidConfig = firebaseConfig.apiKey &&
      firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
      firebaseConfig.databaseURL &&
      firebaseConfig.databaseURL !== 'https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com';

    if (!hasValidConfig || typeof firebase === 'undefined') {
      return false;
    }

    firebase.initializeApp(firebaseConfig);
    databaseRef = firebase.database().ref('lecture-pulse/counts');

    databaseRef.once('value', function (snapshot) {
      if (!snapshot.exists()) {
        databaseRef.set(DEFAULT_COUNTS);
      }
    });

    databaseRef.on('value', function (snapshot) {
      const data = snapshot.val() || DEFAULT_COUNTS;
      counts = normalizeCounts(data);
      saveCounts();
      renderCounts();
    });

    usingFirebase = true;
    setStatus('Realtime Firebase mode is active. Students can vote live.');
    return true;
  }

  function handleVote(vote) {
    if (usingFirebase && databaseRef) {
      const updates = {};

      if (previousVote && previousVote !== vote) {
        updates[previousVote] = firebase.database.ServerValue.increment(-1);
      }

      if (!previousVote || previousVote !== vote) {
        updates[vote] = firebase.database.ServerValue.increment(1);
        databaseRef.update(updates);
        localStorage.setItem(voteStorageKey, vote);
        previousVote = vote;
        setStatus('Your response has been recorded.');
      } else {
        setStatus('You already submitted this response.');
      }
      return;
    }

    if (!previousVote || previousVote !== vote) {
      updateDemoCounts(vote);
      setStatus('Demo mode: your vote was stored locally and pushed to other open tabs.');
    } else {
      setStatus('You already submitted this response.');
    }
  }

  function resetCounts() {
    counts = { ...DEFAULT_COUNTS };
    saveCounts();
    renderCounts();
    publishDemoCounts();

    if (usingFirebase && databaseRef) {
      databaseRef.set(DEFAULT_COUNTS);
      setStatus('Live counts were reset.');
    } else {
      setStatus('Demo counts were reset.');
    }
  }

  function attachListeners() {
    if (authSubmit && authCodeInput && authMessage) {
      authSubmit.addEventListener('click', handleTeacherAuth);

      authCodeInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleTeacherAuth();
        }
      });
    }

    document.querySelectorAll('[data-vote]').forEach(function (button) {
      button.addEventListener('click', function () {
        handleVote(button.dataset.vote);
      });
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        resetCounts();
      });
    }
  }

  renderCounts();
  initializeDemoBroadcast();

  if (!initFirebase()) {
    setStatus('Demo mode is active. Replace the Firebase placeholders in the app script with your real project settings for live student voting across devices.');
  }

  attachListeners();
})();
