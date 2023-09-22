'use client'
import { Card, Space } from "antd"
import { useEffect, useState } from "react"
import ProviderDetails from "./providerDetails"
import ProviderEarningDetails from "./providerEarningDetails"
import ChargerDetails from "./chargerDetails"
function Admin() {
    const [loading, setIsLoading] = useState(true)
    const [user, setUser] = useState({
        "company": "test company",
        "earnings": "$15000",
        "email": "test@test.com",
        "role": "admin"
    })

    useEffect(() => {
        // if user is not admin jump out
        return (
            setIsLoading(false)
        )
    }, [])
    return (
        <Card loading={loading} title={user.company}>
            <Space direction="vertical">
                {user.role == "admin" ? <ProviderDetails user={user} /> : null}
                <ProviderEarningDetails user={user} />
                <ChargerDetails user={user} />
            </Space>
        </Card>
    )
}

export default Admin