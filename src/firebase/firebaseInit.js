import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfuCU9kdl4b9LDdI4qLz69hJ2J70rtes4",
  authDomain: "fireblogs-2fc7b.firebaseapp.com",
  projectId: "fireblogs-2fc7b",
  storageBucket: "fireblogs-2fc7b.appspot.com",
  messagingSenderId: "527116495416",
  appId: "1:527116495416:web:286471c59e3d5d0e8614cd",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { timestamp };
export default firebaseApp.firestore();
