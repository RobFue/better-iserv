import React, { useState } from 'react'
import NextLink from "next/link"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from "../lib/authContext"
import { useRouter } from "next/router"
import styles from "../styles/Form.module.scss"
import Layout from '../components/Layout/Layout';

export default function ForgotPassword() {
    const { resetPassword, currentUser } = useAuth()
    const [message, setMessage] = useState(null)

    return (
        <Layout>
            <div className={styles.container}>
                <h1 className={styles.heading}>Password Reset</h1>
                <Formik
                    initialValues={{ email: '' }}
                    validateOnChange={false}
                    validateOnBlur={false}
                    validate={values => {
                        const errors:any = {};
                        if (!values.email) {
                            errors.email = 'Required';
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                            errors.email = 'Invalid email address';
                        }

                        return errors;
                    }}
                    onSubmit={async(values, { setSubmitting }) => {
                        try {
                            setMessage("")
                            await resetPassword(values.email)
                            setMessage("Email sent")
                        } catch {
                            console.log("Failed to reset password")
                        }

                        setSubmitting(false)
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
                    }) => (
                        <form onSubmit={handleSubmit} className={styles.inputContainer}>
                            <input
                                className={styles.input}
                                placeholder="email"
                                type="email"
                                name="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                            />
                            <p className={styles.error}>{ message }</p>
                            <button type="submit" disabled={isSubmitting} className={styles.button}>
                                Reset Password
                            </button>
                        </form>
                    )}
                </Formik>
                <NextLink href="/login">
                    <p className={styles.bottomLink}>Login</p>
                </NextLink>
            </div>
            <div className={styles.bottomBottomLinkContainer}>
                <NextLink href="/signup">
                    <p className={styles.bottomLink}>Need an Account?</p>
                </NextLink>
            </div>
        </Layout>
    )
}
