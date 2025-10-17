// Firebase設定ファイル
// ステップ1-4で取得した設定情報をここに貼り付けてください

const firebaseConfig = {
  apiKey: "AIzaSyCjhPYdx_imKpIbqAk2usJKgRBxiD80uCc",
  authDomain: "realtime-board-naru.firebaseapp.com",
  projectId: "realtime-board-naru",
  storageBucket: "realtime-board-naru.firebasestorage.app",
  messagingSenderId: "753457834727",
  appId: "1:753457834727:web:61686689b3b2c8c7fa9042"
};

// Firebaseを初期化
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
