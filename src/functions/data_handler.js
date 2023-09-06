const firebase = require("firebase");
require("firebase/firestore");

class DataHandler {
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyCWvNywt1Gq8Kkuf0AzpGt1AN_3TEj1RfU",
      authDomain: "ztek-tv.firebaseapp.com",
      databaseURL: "https://ztek-tv-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "ztek-tv",
      storageBucket: "ztek-tv.appspot.com",
      messagingSenderId: "17721318917",
      appId: "1:17721318917:web:ae4907b56f9ecf65a3066c",
      measurementId: "G-X3MK5PJGDL"
    };

    // this.app = firebase.initializeApp(firebaseConfig);
    // this.db = firestore.getFirestore(this.app);
    // this.db = this.app.firestore();
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
  }

  async getUser(uid) {
    let users = this.db.collection('users')
    return userRef;
  }



}

d = new DataHandler()
console.log(d.getUser("testuid"))

exports = { DataHandler }
