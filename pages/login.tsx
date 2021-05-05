import dynamic from 'next/dynamic'
import React from 'react'
import Layout from '../components/Layout/Layout'

export default function login() {
    const LogInPage = dynamic(() => import('../components/noSSRPages/LogInPage'), {
        ssr: false
    })

    return (
        <Layout>
            <LogInPage />
        </Layout>
    )
}
