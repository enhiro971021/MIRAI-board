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

  // アニメーション開始
  setTimeout(() => {
    postCard.classList.add('slide-out');
  }, 100);

  // 2秒後に完了メッセージを表示
  setTimeout(() => {
    completeMessage.classList.add('show');
  }, 2000);

  // 12秒後に掲示板ページに遷移
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 12000);
});
