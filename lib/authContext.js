import React, { useContext, useEffect, useState } from 'react'
import { auth, db, firebase } from "./firebase"

const AuthContext = React.createContext(null)

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [currentUserInformation, setCurrentUserInformation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState([])

    const signup = (email, password, fullName, schoolClass, role) => {
        if (role === "teacher") {
            db.collection("teachers").doc(email.toLowerCase()).set({
                fullName: fullName,
                email: email.toLowerCase(),
                role: "teacher"
            })
        } else {
            db.collection("classes").doc(schoolClass).collection("students").doc(email.toLowerCase()).set({
                fullName: fullName,
                class: schoolClass,
                email: email.toLowerCase(),
                role: "student"
            })

            db.collection("students").doc(email.toLowerCase()).set({
                fullName: fullName,
                class: schoolClass,
                email: email.toLowerCase(),
                role: "student"
            })
        }

        return firebase.auth().createUserWithEmailAndPassword(email, password)
    }

    const login = (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    }

    const logout = () => {
        return firebase.auth().signOut()
    }

    const resetPassword = (email) => {
        return firebase.auth().sendPasswordResetEmail(email)
    }

    const getCurrentStudentInformation = (email, setData) => {
        db.collection("students").doc(email).get().then((doc) => {
            if(doc.exists) {
                setData(doc.data())
            } else {
                db.collection("teachers").doc(email).get().then((doc) => {
                    if(doc.exists) {
                        setData(doc.data())
                    }
                })
            }

            return
        })
    }

    useEffect(() => { 
        const unsubcribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                getCurrentStudentInformation(user.email, setCurrentUserInformation)
            }
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubcribe
    }, [])

    useEffect(() => {
        setCurrentUser(currState => ({...currState, ...currentUserInformation}))
    }, [currentUserInformation])

    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        getCurrentStudentInformation,
    }

    return (
        <AuthContext.Provider value={value}>
            { !loading && children }
        </AuthContext.Provider>
    )
}
