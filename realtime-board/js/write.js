// 書き込みページのスクリプト

document.addEventListener('DOMContentLoaded', function() {
  const contentInput = document.getElementById('content');
  const nameInput = document.getElementById('name');
  const submitBtn = document.getElementById('submitBtn');
  const errorMessage = document.getElementById('errorMessage');

  // 入力内容の検証
  function validateContent() {
    const content = contentInput.value.trim();
    const length = content.length;

    if (length > 160) {
      errorMessage.classList.add('show');
      submitBtn.disabled = true;
      return false;
    } else {
      errorMessage.classList.remove('show');
    }

    if (length >= 5 && length <= 160) {
      submitBtn.disabled = false;
      return true;
    } else {
      submitBtn.disabled = true;
      return false;
    }
  }

  // 入力時のイベントリスナー
  contentInput.addEventListener('input', validateContent);

  // 送信ボタンのクリックイベント
  submitBtn.addEventListener('click', async function() {
    if (!validateContent()) {
      return;
    }

    const content = contentInput.value.trim();
    const name = nameInput.value.trim();
    const questionId = window.QUESTION_ID;

    // ボタンを無効化（二重送信防止）
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    try {
      // Firestoreに保存
      await db.collection('posts').add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        questionId: questionId,
        content: content,
        name: name
      });

      // 送信完了ページに遷移
      const params = new URLSearchParams({
        questionId: questionId,
        content: content,
        name: name
      });
      window.location.href = `complete.html?${params.toString()}`;

    } catch (error) {
      console.error('送信エラー:', error);
      alert('送信に失敗しました。もう一度お試しください。');
      submitBtn.disabled = false;
      submitBtn.textContent = '送信';
    }
  });
});
