import firebase from 'firebase/app'
import 'firebase/database'


const config = {
  apiKey: "AIzaSyATcElo8oACK6_sQ7zWgRXQGSQrX4SP_ms",
  authDomain: "groub-video-chats.firebaseapp.com",
  databaseURL: "https://groub-video-chats-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "groub-video-chats",
  storageBucket: "groub-video-chats.appspot.com",
  messagingSenderId: "405760083556",
  appId: "1:405760083556:web:0628a3f3acfd139041c171",
  measurementId: "G-KPJM8REDZC"
};
firebase.initializeApp(config)
const database = firebase.database()
export default database
