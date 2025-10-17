// 掲示板ページのスクリプト

document.addEventListener('DOMContentLoaded', function() {
  const postsGrid = document.getElementById('postsGrid');
  let isInitialLoad = true;

  function shouldDisplayPost(post) {
    return post.isPublished !== false;
  }

  function removeNoPostsMessage() {
    const noPostsMsg = postsGrid.querySelector('.no-posts');
    if (noPostsMsg) {
      noPostsMsg.remove();
    }
  }

  function ensureNoPostsMessage() {
    if (postsGrid.querySelector('.board-post-card')) {
      return;
    }
    postsGrid.innerHTML = '<div class="no-posts">まだ投稿がありません</div>';
  }

  function updatePostCard(card, post) {
    const bg = card.querySelector('.board-post-bg');
    const text = card.querySelector('.board-post-text');
    const name = card.querySelector('.board-post-name');

    if (bg) {
      bg.src = `images/question${post.questionId}-bg.png`;
      bg.alt = `質問${post.questionId}`;
    }

    if (text) {
      text.textContent = post.content;
    }

    if (name) {
      if (post.name) {
        name.textContent = post.name;
        name.style.display = 'block';
      } else {
        name.textContent = '';
        name.style.display = 'none';
      }
    }
  }

  function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'board-post-card';
    card.dataset.postId = post.id;

    const bg = document.createElement('img');
    bg.className = 'board-post-bg';
    card.appendChild(bg);

    const content = document.createElement('div');
    content.className = 'board-post-content';

    const text = document.createElement('div');
    text.className = 'board-post-text';

    const name = document.createElement('div');
    name.className = 'board-post-name';

    content.appendChild(text);
    content.appendChild(name);
    card.appendChild(content);

    updatePostCard(card, post);

    return card;
  }

  function removePostCard(postId) {
    const existingCard = postsGrid.querySelector(`[data-post-id="${postId}"]`);
    if (existingCard) {
      existingCard.remove();
      ensureNoPostsMessage();
    }
  }

  function renderPost(post) {
    if (!shouldDisplayPost(post)) {
      removePostCard(post.id);
      return;
    }

    removeNoPostsMessage();

    let card = postsGrid.querySelector(`[data-post-id="${post.id}"]`);

    if (!card) {
      card = createPostCard(post);

      if (!isInitialLoad) {
        postsGrid.insertBefore(card, postsGrid.firstChild || null);
      } else {
        postsGrid.appendChild(card);
      }
      return;
    }

    updatePostCard(card, post);
  }

  db.collection('posts')
    .orderBy('timestamp', 'desc')
    .onSnapshot((snapshot) => {
      if (isInitialLoad) {
        postsGrid.innerHTML = '';

        let hasPublished = false;

        snapshot.forEach((doc) => {
          const post = {
            id: doc.id,
            ...doc.data()
          };

          if (shouldDisplayPost(post)) {
            renderPost(post);
            hasPublished = true;
          }
        });

        if (!hasPublished) {
          ensureNoPostsMessage();
        }

        isInitialLoad = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        const post = {
          id: change.doc.id,
          ...change.doc.data()
        };

        if (change.type === 'added' || change.type === 'modified') {
          renderPost(post);
        } else if (change.type === 'removed') {
          removePostCard(post.id);
        }
      });

      if (!postsGrid.querySelector('.board-post-card')) {
        ensureNoPostsMessage();
      }
    }, (error) => {
      console.error('データ取得エラー:', error);
      postsGrid.innerHTML = '<div class="no-posts">データの読み込みに失敗しました</div>';
    });
});
