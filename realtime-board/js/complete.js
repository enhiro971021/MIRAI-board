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
  const REDIRECT_DELAY = 10000;

  function showError(message) {
    completeMessage.textContent = message;
    completeMessage.classList.add('show');
  }

  function startCompletionAnimation() {
    if (postCard.dataset.animating === 'true') {
      return;
    }

    postCard.dataset.animating = 'true';
    completeMessage.textContent = '送信完了！';

    requestAnimationFrame(() => {
      postCard.classList.add('slide-out');
    });

    setTimeout(() => {
      postCard.style.display = 'none';
      completeMessage.classList.add('show');
    }, SLIDE_DURATION);

    setTimeout(() => {
      window.location.href = 'index.html';
    }, REDIRECT_DELAY);
  }

  if (!content || Number.isNaN(questionId)) {
    postCard.style.display = 'none';
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
    startCompletionAnimation();
    return;
  }

  const status = sessionStorage.getItem(submissionKey);

  if (status === 'submitted') {
    startCompletionAnimation();
    return;
  }

  if (typeof db === 'undefined' || !db) {
    showError('送信に失敗しました。ブラウザの戻るボタンで再度お試しください。');
    return;
  }

  try {
    await db.collection('posts').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      questionId: questionId,
      content: content,
      name: name
    });

    sessionStorage.setItem(submissionKey, 'submitted');
    startCompletionAnimation();
  } catch (error) {
    console.error('送信エラー:', error);
    sessionStorage.setItem(submissionKey, 'failed');
    showError('送信に失敗しました。ブラウザの戻るボタンで再度お試しください。');
  }
});
