import React, { useEffect, useState } from 'react'
import styles from "../../styles/NavBar.module.scss"
import NextLink from "next/link"
import { AiOutlineBell, AiOutlineUser, AiOutlineLogout } from "react-icons/ai"
import { useAuth } from '../../lib/authContext'
import { useRouter } from 'next/router'
import { db } from '../../lib/firebase'

export default function NavBar() {
    const [showNotificiations, setShowNotificiations] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [notifications, setNotifications] = useState(null)

    const { currentUser, logout } = useAuth()

    const router = useRouter()

    const handleLogout = async() => {     
        try {
            await logout()
            router.push("/login")
        } catch {
            console.log("logout failed")
        }
    }

    useEffect(() => {
        if (currentUser && currentUser.class) {
            db.collection("students").doc(currentUser.email).collection("notifications").get().then((querySnapshot) => {
                setNotifications(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))) 
            })
        }
    }, [currentUser])

    return (
        <div className={styles.container}>
            <NextLink href={`/${currentUser && currentUser.role && currentUser.role}`}>
                <h1 className={styles.logo}>Logo</h1>
            </NextLink>
            <div style={{ display: "flex" }}>
                <div style={{ display: "flex" }}>
                    <AiOutlineUser className={styles.icon} size={28} onClick={() => {setShowProfile(currState => !currState); setShowNotificiations(false)}}/>
                    { showProfile && 
                        <div className={styles.dropdown}>
                            <div className={styles.logoutContainer} onClick={handleLogout}>
                                <p className={styles.logoutText}>logout</p>
                            </div>
                        </div> 
                    }
                </div>
                <div style={{ display: "flex" }}>
                    <AiOutlineBell className={styles.icon} size={28} onClick={() => {setShowNotificiations(currState => !currState); setShowProfile(false)}}/>
                    { showNotificiations && 
                        <div className={styles.dropdown}>
                            { notifications ? 
                                notifications.map((item) => (
                                    <NextLink href={`/${currentUser && currentUser.role && currentUser.role}/task/[id]`} as={`/${currentUser && currentUser.role && currentUser.role}/task/${item.id}`} key={item.id}>
                                        <div className={styles.notificationContainer}>
                                            <p className={styles.notificationText}>{item.data.text}</p>
                                        </div>
                                    </NextLink>
                                )) 
                                :
                                <p className={styles.notificationText}>No notification at the moment</p>
                            }
                        </div> 
                    }
                </div>
            </div>
        </div>
    )
}
