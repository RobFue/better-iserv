import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import Layout from '../../components/Layout/Layout'
import Sidebar from '../../components/Layout/Sidebar'
import Calender from '../../components/StudentLayout/Calender'
import Tasks from '../../components/StudentLayout/Tasks'
import homeStyles from "../../styles/Home.module.scss"
import taskStyles from "../../styles/Task.module.scss"
import styles from "../../styles/createExercise.module.scss"
import formStyles from "../../styles/Form.module.scss"
import { Formik } from 'formik'
import { useAuth } from '../../lib/authContext'
import { db } from '../../lib/firebase'

export default function createExercise() {
    const { currentUser } = useAuth()

    const router = useRouter()

    useEffect(() => {
        if (!currentUser) {
            router.push("/login")
        }
    
        if (currentUser && currentUser.role === "student") {
            router.push("/student")
        }
    }, [currentUser])

    const createExercise = (title, description, subject, deadline, schoolClass, teacher) => {
        let id = Math.random() * Math.random()

        db.collection("classes").doc(schoolClass).collection("tasks").doc(String(id)).get().then((doc) => {
            if (doc.exists) {
                id = Math.random() * Math.random() * Math.random()
            }
        })

        db.collection("classes").doc(schoolClass).collection("tasks").doc(String(id)).set({
            title: title,
            subject: subject,
            description: description,
            teacher: teacher,
            deadline: deadline,
            schoolClass: schoolClass
        })

        db.collection("teachers").doc(currentUser && currentUser.email).collection("createdExercises").doc(String(id)).set({
            title: title,
            subject: subject,
            description: description,
            teacher: teacher,
            deadline: deadline,
            schoolClass: schoolClass
        })
    }

    return (
        <Layout>
            <div className={homeStyles.container}>
                <Sidebar />
                <div className={homeStyles.innerContainer} style={{ flexDirection: "column", justifyContent: "flex-start" }}> 
                    <div className={taskStyles.backButton} onClick={() => router.back()}>
                        <AiOutlineArrowLeft size={20} style={{ marginRight: "10px" }}/>
                        <p style={{ marginRight: "10px" }}>Back</p>
                    </div>
                    <div className={styles.createExerciseContainer}>
                        <h1 className={styles.heading}>Add Exersice</h1>
                        <Formik
                            initialValues={{ title: '', description: '', subject: '', deadline: '', class: '' }}
                            validateOnChange={false}
                            validateOnBlur={false}
                            validate={values => {
                                const errors:any = {};

                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                try {
                                    createExercise(values.title, values.description, values.subject, values.deadline, values.class, currentUser && currentUser.fullName)
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
                                <form onSubmit={handleSubmit} className={formStyles.inputContainer}>
                                    <select
                                        style={{ marginTop: "0px", display: 'block', width: "800px" }}
                                        name="class"
                                        value={values.class}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={formStyles.select}
                                    >
                                        <option className={styles.option} value="" label="Select a class" />
                                        <option className={styles.option} value="9a" label="9a" />
                                        <option className={styles.option} value="9b" label="9b" />
                                        <option className={styles.option} value="9c" label="9c" />
                                        <option className={styles.option} value="10a" label="10a" />
                                        <option className={styles.option} value="10b" label="10b" />
                                        <option className={styles.option} value="10c" label="10c" />
                                    </select> 
                                    <select
                                        style={{ marginTop: "10px", display: 'block', width: "800px" }}
                                        name="subject"
                                        value={values.subject}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={formStyles.select}
                                    >
                                        <option className={styles.option} value="" label="Select a subject" />
                                        <option className={styles.option} value="Biologie" label="Biologie" />
                                        <option className={styles.option} value="Chemie" label="Chemie" />
                                        <option className={styles.option} value="Deutsch" label="Deutsch" />
                                        <option className={styles.option} value="Englisch" label="Englisch" />
                                        <option className={styles.option} value="Erdkunde" label="Erdkunde" />
                                        <option className={styles.option} value="Französisch" label="Französisch" />
                                        <option className={styles.option} value="Geschichte" label="Geschichte" />
                                        <option className={styles.option} value="Informatik" label="Informatik" />
                                        <option className={styles.option} value="Kunst" label="Kunst" />
                                        <option className={styles.option} value="Latein" label="Latein" />
                                        <option className={styles.option} value="Mathematik" label="Mathematik" />
                                        <option className={styles.option} value="Musik" label="Musik" />
                                        <option className={styles.option} value="Physik" label="Physik" />
                                        <option className={styles.option} value="Spanisch" label="Spanisch" />
                                        <option className={styles.option} value="Sport" label="Sport" />
                                        <option className={styles.option} value="Religion" label="Religion" />
                                    </select> 
                                    <input
                                        style={{ marginTop: "20px", width: "800px" }}
                                        className={formStyles.input}
                                        placeholder="title"
                                        type="title"
                                        name="title"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.title}
                                    />
                                    <input
                                        style={{ marginTop: "10px", width: "800px" }}
                                        className={formStyles.input}
                                        placeholder="deadline"
                                        type="datetime-local"
                                        name="deadline"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.deadline}
                                    />
                                    <textarea
                                        style={{ marginTop: "20px", width: "800px" }}
                                        className={formStyles.textarea}
                                        placeholder="description"
                                        name="description"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.description}
                                    />
                                    <button type="submit" disabled={isSubmitting} className={formStyles.button}>
                                        Publish Exercise
                                    </button>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
