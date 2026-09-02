(function () {
  const statusEl = document.getElementById('lecture-pulse-status');
  const voteStorageKey = 'classroom-check-in-vote';
  const firebaseConfig = window.LECTURE_PULSE_FIREBASE_CONFIG || {};
  let previousVote = localStorage.getItem(voteStorageKey);
  let databaseRef = null;

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
    return true;
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function handleVote(vote) {
    if (previousVote && previousVote === vote) {
      setStatus('You already submitted this response.');
      return;
    }

    if (databaseRef) {
      const updates = {};

      if (previousVote && previousVote !== vote) {
        updates[previousVote] = firebase.database.ServerValue.increment(-1);
      }

      updates[vote] = firebase.database.ServerValue.increment(1);
      databaseRef.update(updates);
      localStorage.setItem(voteStorageKey, vote);
      previousVote = vote;
      setStatus('Your response has been recorded.');
      return;
    }

    setStatus('Demo mode: live backend is not configured yet.');
  }

  document.querySelectorAll('[data-vote]').forEach(function (button) {
    button.addEventListener('click', function () {
      handleVote(button.dataset.vote);
    });
  });

  initFirebase();
})();
