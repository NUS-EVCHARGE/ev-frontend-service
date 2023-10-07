'use client'
import { useEffect, useState } from "react";
import { Card, Descriptions, DescriptionsProps, Button } from "antd"

// pass user as props
function ProviderDetails({ user }: any) {
    const [generalInfo, setGeneralInfo] = useState<DescriptionsProps['items']>([
        {
            key: '1',
            label: 'comapny',
            children: "test company",
        },
        {
            key: '2',
            label: 'e-mail',
            children: "test@Test.com",
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
            <Descriptions title={user?.email} items={generalInfo!} />
        </Card>
    )
}

export default ProviderDetails