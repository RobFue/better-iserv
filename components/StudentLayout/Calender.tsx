import React, { useEffect, useState } from 'react'
import { getDate } from "../../lib/helperFunctions"
import styles from "../../styles/Calender.module.scss"
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'

export default function Date() {
    const [date, setDate] = useState(null)

    useEffect(() => {
        onChange(getDate())
    }, [])

    const onChange = date => {
        setDate(date)
    }

    return (
        <div className={styles.container}>
            <Calendar onChange={onChange} value={date} className="react-calendar"/>
        </div>
    )
}
