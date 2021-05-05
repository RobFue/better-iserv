import React, { useEffect, useState } from 'react'
import styles from "../../styles/Tasks.module.scss"
import { AiFillCheckCircle } from "react-icons/ai"
import { useAuth } from '../../lib/authContext'
import { db } from '../../lib/firebase'
import NextLink from "next/link"

export default function CreatedTasks({ tasks }) {
    const { currentUser, logout } = useAuth()

    return (
        <div className={styles.container}>
            <div className={styles.columnNameContainer}>
                <h2 className={styles.columnName}>Name</h2>
                <p className={styles.columnName}>Subject</p>
                <p className={styles.columnName}>Teacher</p>
                <p className={styles.columnName}>Deadline</p>
                {/* <p className={styles.columnName}>Status</p>*/}
            </div>
            <div className={styles.tasksContainer}>
                { tasks && tasks.map((item) => (
                    <NextLink href={`/${currentUser && currentUser.role && currentUser.role}/task/[id]`} as={`/${currentUser && currentUser.role && currentUser.role}/task/${item.id}`} key={item.id}>
                        <div className={styles.taskContainer} key={item.id}>
                            <h2 className={styles.taskTitle}>{ item.data.title.slice(0, 18) }{ item.data.title.length > 18 ? "..." : "" }</h2>
                            <p className={styles.taskText}>{ item.data.subject }</p>
                            <p className={styles.taskText}>{ item.data.teacher }</p>
                            <p className={styles.taskText}>{ item.data.deadline }</p>
                            {/* { myCompletedTasks && myCompletedTasks.includes(item.id) ? <AiFillCheckCircle className={styles.checkIcon} size={25}/> : <></> } */}
                        </div>
                    </NextLink>
                )) }
            </div>
        </div>
    )
}
