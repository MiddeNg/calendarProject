import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBgOildxi-zV6MRLt5RNPfNlCZNBYzA3vI",
  authDomain: "phonic-jetty-443009-q8.firebaseapp.com",
  projectId: "phonic-jetty-443009-q8",
  storageBucket: "phonic-jetty-443009-q8.firebasestorage.app",
  messagingSenderId: "674326963056",
  appId: "1:674326963056:web:7a9d366b84a1cf63c565b5",
  measurementId: "G-3ZR9T13GBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
