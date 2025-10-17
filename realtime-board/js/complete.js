// 送信完了ページのスクリプト

document.addEventListener('DOMContentLoaded', async function() {
  const params = new URLSearchParams(window.location.search);
  const questionId = parseInt(params.get('questionId'), 10);
  const content = params.get('content');
  const name = params.get('name') || '';
  const submissionId = params.get('submissionId');
  const submissionKey = submissionId ? `submissionStatus:${submissionId}` : null;

  const postCard = document.getElementById('postCard');
  const cardBg = document.getElementById('cardBg');
  const cardText = document.getElementById('cardText');
  const cardName = document.getElementById('cardName');
  const completeMessage = document.getElementById('completeMessage');

  const SLIDE_DURATION = 2000;
  const REDIRECT_DELAY = 12000;

  function getSessionState() {
    if (!submissionKey) {
      return null;
    }

    const raw = sessionStorage.getItem(submissionKey);

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (error) {
      return { status: raw };
    }

    return null;
  }

  function updateSessionState(status, docId) {
    if (!submissionKey) {
      return;
    }

    const nextState = { status };

    if (docId) {
      nextState.docId = docId;
    }

    sessionStorage.setItem(submissionKey, JSON.stringify(nextState));
  }

  function showError(message) {
    postCard.style.display = 'none';
    postCard.dataset.animating = 'true';
    completeMessage.textContent = message;
    completeMessage.classList.add('show');
  }

  async function publishPost(docId) {
    if (typeof db === 'undefined' || !db) {
      updateSessionState('saved', docId);
      completeMessage.textContent = '送信は完了しましたが、掲示板への反映に失敗しました。時間をおいて再度ご確認ください。';
      return;
    }

    try {
      await db.collection('posts').doc(docId).update({
        isPublished: true
      });
      updateSessionState('published', docId);
    } catch (error) {
      console.error('公開エラー:', error);
      updateSessionState('saved', docId);
      completeMessage.textContent = '送信は完了しましたが、掲示板への反映に失敗しました。時間をおいて再度ご確認ください。';
    }
  }

  function startCompletionAnimation(docId, shouldPublish) {
    if (postCard.dataset.animating === 'true') {
      return;
    }

    postCard.dataset.animating = 'true';
    completeMessage.textContent = '送信完了！';

    requestAnimationFrame(() => {
      postCard.classList.add('slide-out');
    });

    setTimeout(async () => {
      postCard.style.display = 'none';
      completeMessage.classList.add('show');

      if (shouldPublish && docId) {
        await publishPost(docId);
      }
    }, SLIDE_DURATION);

    setTimeout(() => {
      window.location.href = 'index.html';
    }, REDIRECT_DELAY);
  }

  if (!content || Number.isNaN(questionId)) {
    updateSessionState('failed');
    showError('投稿データが見つかりません。ブラウザの戻るボタンで入力画面へお戻りください。');
    return;
  }

  cardBg.src = `images/question${questionId}-bg.png`;
  cardText.textContent = content;

  if (name) {
    cardName.textContent = name;
    cardName.style.display = 'block';
  } else {
    cardName.style.display = 'none';
  }

  if (!submissionKey) {
    startCompletionAnimation(null, false);
    return;
  }

  const sessionState = getSessionState();
  const sessionStatus = sessionState?.status || null;
  const sessionDocId = sessionState?.docId || null;

  if (sessionStatus === 'published') {
    startCompletionAnimation(sessionDocId, false);
    return;
  }

  if (sessionStatus === 'saved' || sessionStatus === 'submitted') {
    startCompletionAnimation(sessionDocId, true);
    return;
  }

  if (sessionStatus === 'failed') {
    showError('送信に失敗しました。ブラウザの戻るボタンで再度お試しください。');
    return;
  }

  if (typeof db === 'undefined' || !db) {
    updateSessionState('failed');
    showError('送信に失敗しました。ブラウザの戻るボタンで再度お試しください。');
    return;
  }

  try {
    const docRef = await db.collection('posts').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      questionId: questionId,
      content: content,
      name: name,
      isPublished: false
    });

    updateSessionState('saved', docRef.id);
    startCompletionAnimation(docRef.id, true);
  } catch (error) {
    console.error('送信エラー:', error);
    updateSessionState('failed');
    showError('送信に失敗しました。ブラウザの戻るボタンで再度お試しください。');
  }
});
