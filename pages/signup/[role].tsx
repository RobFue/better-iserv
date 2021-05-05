import React from 'react'
import dynamic from "next/dynamic"
import Layout from '../../components/Layout/Layout'
import { useRouter } from 'next/router'

export default function signUp() {
    const router = useRouter()
    const role = router.query.role

    console.log(role)

    const SignUpPage = dynamic(() => import('../../components/noSSRPages/SignUpPage'), {
        ssr: false
    })

    return (
        <Layout>
            <SignUpPage role={role}/>
        </Layout>
    )
}
