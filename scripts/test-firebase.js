import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore";

// Config from src/firebase.js
const firebaseConfig = {
    apiKey: "AIzaSyB1bd9bHck2PRJCtCCOGwiH9wF0RsmFoJE",
    authDomain: "website-89ec8.firebaseapp.com",
    projectId: "website-89ec8",
    storageBucket: "website-89ec8.firebasestorage.app",
    messagingSenderId: "153265244302",
    appId: "1:153265244302:web:8fa8a751fcf0eff2e6e1df",
    measurementId: "G-ECTGPWQDNX"
};

console.log("Initializing Firebase...");
try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log("Firebase initialized.");

    console.log("Attempting to fetch from collection 'appointments'...");
    const q = query(collection(db, "appointments"), limit(5));
    const snapshot = await getDocs(q);

    console.log(`Success! Found ${snapshot.size} documents in 'appointments'.`);

    if (snapshot.size > 0) {
        console.log("First document data:", snapshot.docs[0].data());
    } else {
        console.log("Collection is empty or does not exist (Firestore creates collections implicitly, so empty results mean no data yet).");
    }
} catch (error) {
    console.error("Connection failed:", error);
}
