import axios from "axios"

export const getCoronaData = async(setData) => {
    
    try {
        const { data: { confirmed, recovered, deaths, lastUpdate } } = await axios.get("https://covid19.mathdro.id/api")

        setData({ confirmed, recovered, deaths, lastUpdate })
    } catch {

    }
}

export const getDailyCoronaData = async(setData) => {
    try {
        const { data } = await axios.get(`https://covid19.mathdro.id/api/daily`)
        
        const modifiedData = data.map((dailyData: any) => ({
            confirmed: dailyData.confirmed.total,
            deaths: dailyData.deaths.total,
            date: dailyData.reportDate,
        }))

        setData(modifiedData)
    } catch (error) {
        
    }
}