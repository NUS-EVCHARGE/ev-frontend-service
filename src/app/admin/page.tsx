'use client'
import { Card, Space } from "antd"
import { useEffect, useState } from "react"
import ProviderDetails from "./providerDetails"
import ProviderEarningDetails from "./providerEarningDetails"
import ChargerDetails from "./chargerDetails"
import axios from "axios"
import { getJwtToken } from "../utils"

const dummyData = {
    "company": "test company",
    "earnings": "$15000",
    "email": "test@test.com",
    "role": "admin"
}

function Admin() {
    const [loading, setIsLoading] = useState(true)
    const [user, setUser] = useState()
    const providerUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "/provider"

    async function getProviderDetails() {
        const jwtToken = await getJwtToken();
        console.log(providerUrl)
        const { data } = await axios.get(providerUrl, {
            headers: {
                Accept: 'application/json',
                Authentication: jwtToken?.toString()
            }
        })
        setUser(data)
    };

    useEffect(() => {
        // get provider by user
        getProviderDetails()

        // if user is not admin jump out
        return (
            setIsLoading(false)
        )
    }, [])

    useEffect(() => {
        console.log(user)
    }, user)
    return (
        <div>

        </div>
        // <Card loading={loading} title={user.company}>
        //     <Space direction="vertical">
        //         {user.role == "admin" ? <ProviderDetails user={user} /> : null}
        //         <ProviderEarningDetails user={user} />
        //         <ChargerDetails user={user} />
        //     </Space>
        // </Card>
    )
}

export default Admin


