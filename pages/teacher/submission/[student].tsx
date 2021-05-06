import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout/Layout'
import Sidebar from '../../../components/Layout/Sidebar'
import { useAuth } from '../../../lib/authContext'
import { db } from '../../../lib/firebase'
import homeStyles from "../../../styles/Home.module.scss"
import styles from "../../../styles/Task.module.scss"
import formStyles from "../../../styles/Form.module.scss"
import { AiOutlineArrowLeft, AiOutlineCheck } from "react-icons/ai"


interface TaskData {
    title: string;
    description: string;
    subject: string;
    teacher: string;
    deadline: string;
    schoolClass: string;
}

export default function Task() {
    const [taskData, setTaskData] = useState(null)
    const [submission, setSubmission] = useState(null)
    const [submitStatus, setSubmitStatus] = useState(null)
    const [student, setStudent] = useState(null)
    const [feedback, setFeedback] = useState(null)

    const { currentUser } = useAuth()
    
    const router = useRouter()
    const queryData = router.query.student
    const splittedQueryData = String(queryData).split("-")
    const taskId = splittedQueryData[0] 
    const studentEmail = splittedQueryData[1]


    useEffect(() => {
        db.collection("teachers").doc(currentUser.email).collection("createdExercises").doc(taskId as string).get().then((doc) => {
            setTaskData(doc.data() as TaskData)
        })
    }, [])

    useEffect(() => {
        if (taskData) {
            db.collection("classes").doc(taskData.schoolClass).collection("tasks").doc(taskId as string).collection("submissions").doc(studentEmail).get().then((doc) => {
                setSubmission(doc.data())
            })

            db.collection("students").doc(studentEmail).get().then((doc) => {
                setStudent(doc.data())
            })
        }
    }, [taskData])

    useEffect(() => {
        if (student) {
            db.collection("classes").doc(student.class).collection("tasks").doc(taskId as string).collection("submissions").doc(student.email).get().then((doc) => {
                if (doc.exists) {
                    setFeedback(doc.data().feedback)
                }
            })
        }
    }, [student])


    const submitResults = () => {
        if (!currentUser) {
            return
        }

        db.collection("classes").doc(student.class).collection("tasks").doc(taskId as string).collection("submissions").doc(student.email).update({
            feedback: feedback
        }).then(() => {
            setSubmitStatus("✔ Success")
        }).catch(() => {
            setSubmitStatus("X Error")
        })

        db.collection("students").doc(student.email).collection("notifications").doc(taskId).set({
            text: `${currentUser.fullName} just gave feedback to your submission`,
        })
    }

    return (
        <Layout>
            <div className={homeStyles.container}>
                <Sidebar />
                <div className={homeStyles.innerContainer} style={{ flexDirection: "column", justifyContent: "flex-start" }}>
                    <div className={styles.backButton} onClick={() => router.back()}>
                        <AiOutlineArrowLeft size={20} style={{ marginRight: "10px" }}/>
                        <p style={{ marginRight: "10px" }}>Back</p>
                    </div>
                    {taskData && 
                        <div style={{ display: "flex" }}>
                            <div className={styles.taskContainer}>
                                <div className={styles.innerTaskContainer}>
                                    <p className={styles.teacher}>Submission</p>
                                    <div className={styles.taskTopLine}>
                                        <h2 className={styles.title}>{student && student.fullName}</h2>
                                    </div>
                                    <p className={styles.description}>{submission && submission.submission}</p>
                                </div>
                            </div>
                            <div className={styles.uploadContainer}>
                                <div className={styles.innerUploadContainer}>
                                    <p className={styles.teacher}>Your</p>
                                    <div className={styles.taskTopLine}>
                                        <h2 className={styles.title}>Feedback</h2>
                                    </div>
                                    <textarea 
                                        className={formStyles.textarea} 
                                        onChange={(event) => setFeedback(event.target.value)} 
                                        value={feedback}
                                    />
                                    <p className={styles.submitStatus}>{submitStatus && submitStatus}</p>
                                    <div className={styles.submitButton} onClick={submitResults}>
                                        <AiOutlineCheck size={20} style={{ marginRight: "10px" }}/>
                                        <p style={{ marginRight: "10px" }}>Give Feedback</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </Layout>
    )
}
