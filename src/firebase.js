import { initializeApp } from "firebase/app";
import { getAnalytics, setAnalyticsCollectionEnabled } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyB1bd9bHck2PRJCtCCOGwiH9wF0RsmFoJE",
    authDomain: "website-89ec8.firebaseapp.com",
    projectId: "website-89ec8",
    storageBucket: "website-89ec8.firebasestorage.app",
    messagingSenderId: "153265244302",
    appId: "1:153265244302:web:8fa8a751fcf0eff2e6e1df",
    measurementId: "G-ECTGPWQDNX"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Disable analytics by default
setAnalyticsCollectionEnabled(analytics, false);

const enableAnalytics = () => {
    setAnalyticsCollectionEnabled(analytics, true);
};

export { app, analytics, enableAnalytics };

