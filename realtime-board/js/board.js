// 掲示板ページのスクリプト

document.addEventListener('DOMContentLoaded', function() {
  const postsGrid = document.getElementById('postsGrid');
  let isInitialLoad = true;

  // 投稿カードを作成
  function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'board-post-card';
    card.dataset.postId = post.id;

    const bg = document.createElement('img');
    bg.src = `images/question${post.questionId}-bg.png`;
    bg.alt = `質問${post.questionId}`;
    bg.className = 'board-post-bg';

    const content = document.createElement('div');
    content.className = 'board-post-content';

    const text = document.createElement('div');
    text.className = 'board-post-text';
    text.textContent = post.content;

    const name = document.createElement('div');
    name.className = 'board-post-name';
    name.textContent = post.name;

    content.appendChild(text);
    content.appendChild(name);
    card.appendChild(bg);
    card.appendChild(content);

    return card;
  }

  // 投稿を表示
  function displayPost(post, isNew = false) {
    // 「投稿を読み込んでいます...」を削除
    const noPostsMsg = postsGrid.querySelector('.no-posts');
    if (noPostsMsg) {
      noPostsMsg.remove();
    }

    // 既に表示されているか確認
    const existingCard = postsGrid.querySelector(`[data-post-id="${post.id}"]`);
    if (existingCard) {
      return;
    }

    const card = createPostCard(post);

    // 新しい投稿は先頭に追加
    if (isNew && !isInitialLoad) {
      postsGrid.insertBefore(card, postsGrid.firstChild);
    } else {
      postsGrid.appendChild(card);
    }
  }

  // Firestoreからデータを取得してリアルタイム監視
  db.collection('posts')
    .orderBy('timestamp', 'desc')
    .onSnapshot((snapshot) => {
      if (isInitialLoad) {
        // 初回読み込み：全件表示
        postsGrid.innerHTML = '';
        
        if (snapshot.empty) {
          postsGrid.innerHTML = '<div class="no-posts">まだ投稿がありません</div>';
        } else {
          snapshot.forEach((doc) => {
            const post = {
              id: doc.id,
              ...doc.data()
            };
            displayPost(post, false);
          });
        }
        
        isInitialLoad = false;
      } else {
        // リアルタイム更新：新しい投稿のみ追加
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const post = {
              id: change.doc.id,
              ...change.doc.data()
            };
            displayPost(post, true);
          }
        });
      }
    }, (error) => {
      console.error('データ取得エラー:', error);
      postsGrid.innerHTML = '<div class="no-posts">データの読み込みに失敗しました</div>';
    });
});
