import React, { useState } from 'react'
import styles from "../../styles/NavBar.module.scss"
import NextLink from "next/link"
import { AiOutlineBell, AiOutlineUser, AiOutlineLogout } from "react-icons/ai"
import { useAuth } from '../../lib/authContext'
import { useRouter } from 'next/router'

export default function NavBar() {
    const [showMenu, setShowMenu] = useState(false)

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

    return (
        <div className={styles.container}>
            <NextLink href={`/${currentUser && currentUser.role && currentUser.role}`}>
                <h1 className={styles.logo}>Logo</h1>
            </NextLink>
            <div>
                <AiOutlineUser className={styles.icon} size={28} onClick={() => setShowMenu(true)}/>
                <AiOutlineBell className={styles.icon} size={28}/>
                <button onClick={() => handleLogout()}>Logout</button>
                {/* { currentUser && <div className={styles.dropdownMenu} style={{ display: showMenu ? "flex" : "none" }}>
                    <h2>{currentUser.fullName}</h2>
                    <div className={styles.logoutContainer} onClick={handleLogout}>
                        <AiOutlineLogout />
                        <p className={styles.logout}>Logout</p>
                    </div>
                </div>} */}
            </div>
        </div>
    )
}
