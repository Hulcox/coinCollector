import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC-FDy5A1N5kx3DHfvmPaVKHlIpQwBlmFU",
  authDomain: "coincollector-36153.firebaseapp.com",
  projectId: "coincollector-36153",
  storageBucket: "coincollector-36153.appspot.com",
  messagingSenderId: "569445721400",
  appId: "1:569445721400:web:1569a4dc64bf7a2e02cdcd",
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
export const db = getFirestore(app);
