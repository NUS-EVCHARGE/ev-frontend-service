'use client'
import { useEffect, useState } from "react";
import { Card, Descriptions, DescriptionsProps, Button } from "antd"

// pass user as props
function ProviderEarningDetails({ user }: any) {
    const [earningInfo, setEarningInfo] = useState<DescriptionsProps['items']>([
        {
            key: '1',
            label: 'Net earnings',
            children: "$10000",
        },
        {
            key: '2',
            label: 'total earnings',
            children: "$15000",
        },
        {
            key: '3',
            label: 'platform fee',
            children: "$5000",
        }])

    useEffect(() => {
        // get earning details
    }, [])
    return (
        <Card type="inner" title="Earnings" extra={<Button> Cash out</Button>}>
            <Descriptions title={user?.earnings} items={earningInfo!} />
        </Card>
    )
}

export default ProviderEarningDetails