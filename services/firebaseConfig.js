import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBSZ3KuuEr4CB70Ff1D0z2hs9AU_VKd_YQ",
  authDomain: "quorum-board.firebaseapp.com",
  projectId: "quorum-board",
  storageBucket: "quorum-board.firebasestorage.app",
  messagingSenderId: "713983317137",
  appId: "1:713983317137:web:361d846be94eabe7685b30"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
