import React  from 'react'
import styles from "../../styles/Tasks.module.scss"
import { AiFillCheckCircle } from "react-icons/ai"
import { useAuth } from '../../lib/authContext'
import NextLink from "next/link"
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

export default function Tasks({ tasks, completedTasks }) {

    const { currentUser } = useAuth()

    return (
        <div className={styles.container}>
            <div className={styles.columnNameContainer}>
                <h2 className={styles.columnName}>Name</h2>
                <p className={styles.columnName}>Subject</p>
                <p className={styles.columnName}>Teacher</p>
                <p className={styles.columnName}>Deadline</p>
                <p className={styles.columnName}>Status</p>       
            </div>
            <div className={styles.tasksContainer}>
                { tasks[0] ?
                    tasks.map((item) => (
                        <NextLink href={`/${currentUser && currentUser.role && currentUser.role}/task/[id]`} as={`/${currentUser && currentUser.role && currentUser.role}/task/${item.id}`} key={item.id}>
                            <div className={styles.taskContainer} key={item.id}>
                                <h2 className={styles.taskTitle}>{ item.data.title.slice(0, 18) }{ item.data.title.length > 18 ? "..." : "" }</h2>
                                <p className={styles.taskText}>{ item.data.subject }</p>
                                <p className={styles.taskText}>{ item.data.teacher }</p>
                                <p className={styles.taskText}>{ item.data.deadline }</p>
                                { completedTasks && completedTasks.includes(item.id) ? <AiFillCheckCircle className={styles.checkIcon} size={25}/> : <></> }
                            </div>
                        </NextLink>
                    )) 
                    :
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <Loader type="TailSpin" color="#8f73f3" height={80} width={80} />
                    </div>
                }
            </div>
        </div>
    )
}
