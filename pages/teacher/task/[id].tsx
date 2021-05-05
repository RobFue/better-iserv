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
import NextLink from "next/link"

interface TaskData {
    title: string;
    description: string;
    subject: string;
    teacher: string;
    deadline: string;
    schoolClass: string;
}

export default function Task() {
    const [taskData, setTaskData] = useState<TaskData>(null)
    const [submissions, setSubmissions] = useState([])

    const { currentUser } = useAuth()
    
    const router = useRouter()
    const id = router.query.id

    useEffect(() => {
        db.collection("teachers").doc(currentUser.email).collection("createdExercises").doc(id as string).get().then((doc) => {
            setTaskData(doc.data() as TaskData)
        })
    }, [])

    useEffect(() => {
        if (taskData) {
            db.collection("classes").doc(taskData.schoolClass).collection("tasks").doc(id as string).collection("submissions").get().then((querySnapshot) => {
                setSubmissions(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
            })
        }
    }, [taskData])

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
                                    <p className={styles.teacher}>Number: {submissions.length}</p>
                                    <div className={styles.taskTopLine} style={{ marginBottom: "20px" }}>
                                        <h2 className={styles.title}>Submissions</h2>
                                    </div>
                                    { submissions && submissions.map((item) => (
                                        <NextLink  
                                            href={`/${currentUser && currentUser.role && currentUser.role}/submission/[student]`} 
                                            as={`/${currentUser && currentUser.role && currentUser.role}/submission/${id}-${item.id}`} 
                                            key={item.data.student}
                                        >
                                            <p style={{ margin: 0, fontWeight: 500, cursor: "pointer" }}>{item.data.student}</p>
                                        </NextLink>
                                    )) }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </Layout>
    )
}
