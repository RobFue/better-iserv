// @ts-nocheck

import React, { useEffect, useRef, useState } from 'react'
import styles from "../../styles/CompletedTasks.module.scss"
import { Doughnut } from "react-chartjs-2"
import Loader from 'react-loader-spinner'

export default function CompletedTasks({ tasks, completedTasks }) {
    const [completed, setCompleted] = useState(0)
    const [notCompleted, setNotCompleted] = useState(0)
    const [percentage, setPercentage] = useState(0)

    const getPercentage = (number1, number2) => {
        if (number1 === 0) {
            return 100
        }

        const percentage = number1 * 100 / number2
        if (percentage > 100) {
            return 100
        }
        return percentage
    }

    useEffect(() => {
        setCompleted(0)
        setNotCompleted(0)

        tasks.forEach((item) => {
            if (completedTasks.includes(item.id)) {
                setCompleted(currState => currState + 1)
            } else {
                setNotCompleted(currState => currState + 1)
            }
        })
    }, [tasks])

    useEffect(() => {
        setPercentage(getPercentage(notCompleted, completed))
    }, [completed, notCompleted])

    return (
        <div className={styles.container}>
            { completed !== 0 || notCompleted !== 0 ? 
                <>
                    <p className={styles.percentCompleted}>{percentage}% Completed</p>
                    <Doughnut 
                        id="doughnutChart"
                        data={{
                            datasets: [
                                {
                                    label: 'Exercises Completed',
                                    data: [completed, notCompleted],
                                    backgroundColor: [
                                        "#8f73f3",
                                        '#c899fe',
                                    ],
                                    borderColor: [
                                        'white',
                                        'white',
                                    ],
                                    hoverBorderColor: [
                                        'white',
                                        'white',
                                    ],
                                    hoverBackgroundColor: [
                                        '#8f73f3',
                                        '#c899fe',
                                    ],
                                    borderWidth: 5,
                                },
                            ],
                        }}
                        height={400}
                        width={600}
                        options={{
                            maintainAspectRatio: false,
                            legend: {
                                labels: {
                                    drawBorder: false,
                                },
                            },
                        }}
                    />
                </>
                :
                <Loader type="TailSpin" color="#8f73f3" height={80} width={80} />
            }
        </div>
    )
}
