'use client'
import { Button, Card, Space, Typography } from "antd"
import { useEffect, useState } from "react"
import ProviderDetails from "./providerDetails"
import ProviderEarningDetails from "./providerEarningDetails"
import ChargerDetails from "./chargerDetails"
import axios from "axios"
import { getJwtToken } from "../utils"

const { Title } = Typography
const dummyData = {
    "company": "test company",
    "earnings": "$15000",
    "email": "test@test.com",
    "role": "admin"
}
type User = {
    user_email: string,
    company_name: string,
    description: string,
    status: string
}

function Admin() {
    const [loading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User>()
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
        // return data["id"]
    };

    async function createProvider() {
        const jwtToken = await getJwtToken();
        console.log(jwtToken)
        const { data } = await axios.post(providerUrl, {}, {
            headers: {
                Accept: 'application/json',
                Authentication: jwtToken?.toString()
            }
        })
        setUser(data)
        console.log(data)
    }

    useEffect(() => {
        // get provider by user
        getProviderDetails()

    }, [])

    useEffect(() => {
        console.log(user)
        if (user != undefined) {
            setIsLoading(false)
        }
    }, [user])

    function onClickCreateProvider() {
        createProvider()
    }

    if (user == undefined) {
        return (
            <Card>
                <Space direction="vertical" align="center">
                    <Title>
                        Not a provider? Be a provider with us!
                    </Title>
                    <Button onClick={createProvider}>
                        Become a provider
                    </Button>
                </Space>
            </Card>
        )
    }
    return (
        <Card loading={loading} title={user.company_name}>
            <Space direction="vertical">
                {user != undefined ? <ProviderDetails user={user} /> : null}
                <ProviderEarningDetails user={user} />
                <ChargerDetails user={user} />
            </Space>
        </Card>
    )
}

export default Admin


