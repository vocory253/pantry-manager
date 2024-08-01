// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from 'firebase/firestore'
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBnqOHMO8XUWY8gDGY5Fh7YA8C4pQ7qozo",
//   authDomain: "inventory-management-b8222.firebaseapp.com",
//   projectId: "inventory-management-b8222",
//   storageBucket: "inventory-management-b8222.appspot.com",
//   messagingSenderId: "569304264427",
//   appId: "1:569304264427:web:fee9d9095ea69d160418ae",
//   measurementId: "G-1FRDK9QLWY"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const firestore = getFirestore(app);

// export { firestore }

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnqOHMO8XUWY8gDGY5Fh7YA8C4pQ7qozo",
  authDomain: "inventory-management-b8222.firebaseapp.com",
  projectId: "inventory-management-b8222",
  storageBucket: "inventory-management-b8222.appspot.com",
  messagingSenderId: "569304264427",
  appId: "1:569304264427:web:fee9d9095ea69d160418ae",
  measurementId: "G-1FRDK9QLWY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conditionally initialize Analytics if supported
let analytics;
if (typeof window !== 'undefined' && isSupported()) {
  analytics = getAnalytics(app);
}

// Initialize Firestore
const firestore = getFirestore(app);

export { firestore };