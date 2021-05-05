import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
        databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
} else {
    firebase.app(); 
}

const auth = firebase.auth()
const db = firebase.firestore()

export { firebase, auth, db }
