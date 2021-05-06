// @ts-nocheck

import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { getCoronaData, getDailyCoronaData } from '../../lib/api'
import styles from "../../styles/CoronaCases.module.scss"
import Loader from 'react-loader-spinner'

export default function CoronaCases() {
    const [data, setData] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                fill: true,
                lineTension: 0.35,
                backgroundColor: '#8f73f390',
                borderColor: '#8f73f3',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#8f73f3',
                pointBackgroundColor: '#8f73f3',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#8f73f3',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 50,
                data: [65, 59, 80, 81, 56, 55, 40],
            }
        ],
    })

    const options = {
        maintainAspectRatio: false,
        plugins:{
            legend: {
                display: false
            }
        },
    }

    useEffect(() => {
        // getCoronaData(setData)
        // getDailyCoronaData(setDailyData)
    }, [])

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <div className={styles.container}>
            { data ? 
                <Line data={data} height={150} width={600} options={options} />
                :
                <Loader type="TailSpin" color="#8f73f3" height={80} width={80} />
            }
        </div>
    )
}
