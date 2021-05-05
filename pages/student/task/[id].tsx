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
    const [taskData, setTaskData] = useState<TaskData>()
    const [submission, setSubmission] = useState("")
    const [feedback, setFeedback] = useState("")
    const [submitStatus, setSubmitStatus] = useState("")

    const { currentUser } = useAuth()
    
    const router = useRouter()
    const id = router.query.id

    useEffect(() => {
        db.collection("classes").doc(currentUser.class).collection("tasks").doc(id as string).get().then((doc) => {
            setTaskData(doc.data() as TaskData)
        })

        db.collection("classes").doc(currentUser.class).collection("tasks").doc(id as string).collection("submissions").doc(currentUser.email).get().then((doc) => {
            if (doc.exists) {
                setSubmission(doc.data().submission)
                setFeedback(doc.data().feedback)
            }
        })
    }, [])

    const submitResults = () => {
        db.collection("classes").doc(currentUser.class).collection("tasks").doc(id as string).collection("submissions").doc(currentUser.email).set({
            student: currentUser.fullName,
            submission: submission,
            feedback: ""
        })

        db.collection("students").doc(currentUser.email).collection("completedExercises").doc(id as string).get().then((doc) => {
            if (!doc.exists) {
                db.collection("students").doc(currentUser.email).collection("completedExercises").doc(id as string).set({
                    teacher: taskData && taskData.teacher,
                    subject: taskData && taskData.subject,
                    submission: submission
                })
            }
        }).then(() => {
            setSubmitStatus("✔ Success")
        }).catch(() => {
            setSubmitStatus("X Error")
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
                                    <p className={styles.teacher}>{taskData.teacher}</p>
                                    <div className={styles.taskTopLine}>
                                        <h2 className={styles.title}>{taskData.title}</h2>
                                        <h3 className={styles.deadline}>{taskData.deadline}</h3>
                                    </div>
                                    <p className={styles.description}>{taskData.description}</p>
                                </div>
                            </div>
                            <div className={styles.uploadContainer}>
                                <div className={styles.innerUploadContainer}>
                                    <p className={styles.teacher}>Your Results</p>
                                    <div className={styles.taskTopLine}>
                                        <h2 className={styles.title}>Submit Results</h2>
                                    </div>
                                    <div style={{ marginTop: "30px" }}>
                                        <textarea 
                                            className={formStyles.textarea} 
                                            onChange={(event) => setSubmission(event.target.value)} 
                                            value={submission}
                                        />
                                    </div>
                                    <p className={styles.submitStatus}>{submitStatus}</p>
                                    <div className={styles.submitButton} onClick={submitResults}>
                                        <AiOutlineCheck size={20} style={{ marginRight: "10px" }}/>
                                        <p style={{ marginRight: "10px" }}>Submit</p>
                                    </div>
                                </div>
                                { feedback && <div className={styles.innerUploadContainer} style={{ marginTop: "20px", height: "40%" }}>
                                    <div className={styles.taskTopLine}>
                                        <h2 className={styles.title}>Feedback</h2>
                                    </div>
                                    <textarea 
                                        className={formStyles.textarea}
                                        style={{ background: "white", border: "none", maxHeight: "80%" }} 
                                        readOnly
                                        onChange={(event) => setSubmission(event.target.value)} 
                                        value={feedback}
                                    />
                                </div>}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </Layout>
    )
}
