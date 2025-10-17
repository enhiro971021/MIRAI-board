// 送信完了ページのスクリプト

document.addEventListener('DOMContentLoaded', function() {
  // URLパラメータを取得
  const params = new URLSearchParams(window.location.search);
  const questionId = parseInt(params.get('questionId'));
  const content = params.get('content');
  const name = params.get('name');

  // 要素を取得
  const postCard = document.getElementById('postCard');
  const cardBg = document.getElementById('cardBg');
  const cardText = document.getElementById('cardText');
  const cardName = document.getElementById('cardName');
  const completeMessage = document.getElementById('completeMessage');

  // 背景画像を設定
  cardBg.src = `images/question${questionId}-bg.png`;

  // テキストを設定
  cardText.textContent = content;
  cardName.textContent = name;

  const SLIDE_DELAY = 2000;
  const SLIDE_DURATION = 2000;

  // アニメーション開始（2秒待機後にスライドアウト）
  setTimeout(() => {
    postCard.classList.add('slide-out');

    // スライドアウト完了後にカードを非表示化してメッセージを中央に配置
    setTimeout(() => {
      postCard.style.display = 'none';
    }, SLIDE_DURATION);
  }, SLIDE_DELAY);

  // 完了メッセージをスライドアウト完了後に表示
  setTimeout(() => {
    completeMessage.classList.add('show');
  }, SLIDE_DELAY + SLIDE_DURATION);

  // 12秒後に掲示板ページに遷移
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 12000);
});
