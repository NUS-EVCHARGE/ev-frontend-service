'use client'
import { useEffect, useState } from "react";
import { Card, Descriptions, DescriptionsProps, Button } from "antd"
import axios from "axios";
import { getJwtToken } from "../utils";
import { UserPaymentItem } from "../bill/page";
import { User } from "./page";
import { getProviderEarningsDetailsUrl } from "../api/config";

interface ProviderEarningDetailsProps {
    user: User
}
// pass user as props
function ProviderEarningDetails({ user }: ProviderEarningDetailsProps) {
    const [totalBill, setTotalBill] = useState<number>(0)
    const [earningInfo, setEarningInfo] = useState<DescriptionsProps['items']>([
        {
            key: '1',
            label: 'Net earnings',
            children: "$0",
        },
        {
            key: '2',
            label: 'total earnings',
            children: "$0",
        },
        {
            key: '3',
            label: 'platform fee',
            children: "$0",
        }])

    useEffect(() => {
        // get earning details
        const getEarningDetails = async () => {
            const jwtToken = await getJwtToken()
            const response = axios.get(getProviderEarningsDetailsUrl(user.id), {
                headers: {
                    Accept: 'application/json',
                    Authentication: jwtToken?.toString()
                }
            })
                .then((response) => {
                    console.log(response.data);
                    const totalBill: number = response.data.TotalEarnings
                    const totalCommission: number = response.data.TotalCommission
                    const netEarnings: number = response.data.NetEarnings
                    if (totalBill && totalCommission && netEarnings) {
                        setEarningInfo([
                            {
                                key: '1',
                                label: 'Net earnings',
                                children: `$${netEarnings.toFixed(2)}`, // added comma here
                            },
                            {
                                key: '2',
                                label: 'Gross earnings',
                                children: `$${totalBill.toFixed(2)}`, // added comma here
                            },
                            {
                                key: '3',
                                label: 'platform fee',
                                children: `$${totalCommission.toFixed(2)}`,
                            }
                        ]);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    return error;
                });
            return response;
        };

        getEarningDetails()

    }, [])
    return (
        <Card type="inner" title="Earnings" extra={<Button> Cash out</Button>}>
            <Descriptions title="" items={earningInfo!} />
        </Card>
    )
}

export default ProviderEarningDetails