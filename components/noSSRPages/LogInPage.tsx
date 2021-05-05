import React, { useState } from 'react'
import NextLink from "next/link"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from "../../lib/authContext"
import { useRouter } from "next/router"
import styles from "../../styles/Form.module.scss"

export default function LogIn() {
    const { login, currentUser } = useAuth()

    const router = useRouter()

    return (
        <div>
            <div className={styles.container}>
                <h1 className={styles.heading}>Log In</h1>
                <Formik
                    initialValues={{ email: '', password: '', confirmPassword: '' }}
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
                            await login(values.email, values.password)
                            router.push(currentUser && currentUser.role === "teacher" ? "/teacher" : "/student")
                        } catch {
                            console.log("Failed to log in")
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
                            <p className={styles.error}>{errors.email && touched.email && errors.email}</p>
                            <input
                                className={styles.input}
                                placeholder="password"
                                type="password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                            />
                            <p className={styles.error}>{errors.password && touched.password && errors.password}</p>
                            <button type="submit" disabled={isSubmitting} className={styles.button}>
                                Log In
                            </button>
                        </form>
                    )}
                </Formik>
                <NextLink href="/forgot-password">
                    <p className={styles.bottomLink}>Forgot Password?</p>
                </NextLink>
            </div>
            <div className={styles.bottomBottomLinkContainer}>
                <NextLink href="/signup">
                    <p className={styles.bottomLink}>Need an Account?</p>
                </NextLink>
            </div>
        </div>
    )
}
