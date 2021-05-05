import React from 'react'
import NavBar from './NavBar'

export default function Layout({ children }) {
    return (
        <main style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <NavBar />
            { children }
        </main>
    )
}
