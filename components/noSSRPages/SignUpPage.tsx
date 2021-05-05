import React, { useState } from 'react'
import NextLink from "next/link"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from "../../lib/authContext"
import { useRouter } from "next/router"
import styles from "../../styles/Form.module.scss"

export default function SignUp(role) {
    const { signup, currentUser } = useAuth()
    const [values, setValues] = useState(null)

    const router = useRouter()

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>{ role.role === "teacher" ? "Teacher" : "Student" } Sign Up</h1>
            <Formik
                initialValues={{ fullName: '', email: '', password: '', confirmPassword: '', class: '' }}
                validateOnChange={false}
                validateOnBlur={false}
                validate={values => {
                    const errors:any = {};
                    if (!values.fullName) {
                        errors.fullName = "Required"
                    }

                    if (!values.email) {
                        errors.email = 'Required'
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Invalid email address'
                    }

                    if (values.password.length < 7) {
                        errors.password = "Must be at least 6 characters long"
                    }

                    if (values.password !== values.confirmPassword) {
                        errors.confirmPassword = 'Passwords do not match'
                    }

                    return errors;
                }}
                onSubmit={async(values, { setSubmitting }) => {
                    try {
                        await signup(values.email, values.password, values.fullName, values.class, role.role)
                        router.push("/student")
                    } catch {
                        console.log("Failed to create an account")
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
                            type="fullName"
                            name="fullName"
                            placeholder="full name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.fullName}
                        />
                        <p className={styles.error}>{errors.fullName && touched.fullName && errors.fullName}</p>
                        <input
                            className={styles.input}
                            type="email"
                            name="email"
                            placeholder="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                        />
                        <p className={styles.error}>{errors.email && touched.email && errors.email}</p>
                        <input
                            className={styles.input}
                            type="password"
                            name="password"
                            placeholder="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                        />
                        <p className={styles.error}>{errors.password && touched.password && errors.password}</p>
                        <input
                            className={styles.input}
                            type="password"
                            name="confirmPassword"
                            placeholder="confirm password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.confirmPassword}
                        />
                        <p className={styles.error}>{errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}</p>
                        { role.role !== "teacher" && 
                            <select
                                name="class"
                                value={values.class}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={styles.select}
                                style={{ display: 'block' }}
                            >
                                <option className={styles.option} value="" label="Select a class" />
                                <option className={styles.option} value="9a" label="9a" />
                                <option className={styles.option} value="9b" label="9b" />
                                <option className={styles.option} value="9c" label="9c" />
                                <option className={styles.option} value="10a" label="10a" />
                                <option className={styles.option} value="10b" label="10b" />
                                <option className={styles.option} value="10c" label="10c" />
                            </select> 
                        }
                        <button type="submit" disabled={isSubmitting} className={styles.button}>
                            Sign Up
                        </button>
                    </form>
                )}
            </Formik>
            <NextLink href="/login">
                <p className={styles.bottomLink}>Already have an account?</p>
            </NextLink>
        </div>
    )
}
