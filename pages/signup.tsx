import React from 'react'
import dynamic from "next/dynamic"
import Layout from '../components/Layout/Layout'

export default function signUp() {
    const SignUpPage = dynamic(() => import('../components/noSSRPages/SignUpPage'), {
        ssr: false
    })

    return (
        <Layout>
            <SignUpPage />
        </Layout>
    )
}
