'use client'
import { useEffect, useState } from "react";
import { Card, Descriptions, DescriptionsProps, Button } from "antd"
import { User } from "./page";

interface ProviderDetailsProps {
    user: User
}

// pass user as props
function ProviderDetails({ user }: ProviderDetailsProps) {
    const [generalInfo, setGeneralInfo] = useState<DescriptionsProps['items']>([
        {
            key: '1',
            label: 'comapny',
            children: user.company_name,
        },
        {
            key: '2',
            label: 'e-mail',
            children: user.user_email,
        },
        {
            key: '3',
            label: 'contact number',
            children: "97342138",
        }])
    useEffect(() => {
        // get provider details
    }, [])
    return (
        <Card type="inner" title="Provider">
            <Descriptions title={user?.user_email} items={generalInfo!} />
        </Card>
    )
}

export default ProviderDetails