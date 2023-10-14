
'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Button, List, Radio, Space } from 'antd';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getJwtToken } from '../utils';

const billOption = ['outstanding', 'completed'];    

type UserPaymentItem = {
    id: number,
    charger_id: number,
    chargerAddress : string,
    TotalBill: number,
    FinalBill: number,
    Coupon: string,
    Email: string,
    start_time: string,
    end_time: string,
    Status: string,
    normalRate: number,
    bookingId: number,
    UserEmail: string,
    paymentStatus: string
}

function Bill() {
    type billInfosType = Record<string, UserPaymentItem[]>
    const [billList, setBillList] = useState<billInfosType>()
    const [currentBillOption, setBillOptions] = useState('outstanding')
    const router = useRouter()

    function getFilteredBillList() {
        if (!billList) {
            return []
        }
        if (currentBillOption == 'outstanding') {
            const pendingList = billList['pending']
            if (pendingList) {
                return pendingList.filter((item) => item.paymentStatus == 'pending')
            }
        } else {
            const pendingList = billList['completed']
            if (pendingList) {
                return pendingList.filter((item) => item.paymentStatus == 'completed')
            }
        }
    }

    useEffect(() => {

        async function getAllUserPayment() {
            const jwtToken = await getJwtToken()
            axios.get(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + '/payment/user/getAllBooking', {
                headers: {
                    Accept: 'application/json',
                    Authentication: jwtToken?.toString()
                }
            }).then((res) => {
                const data: billInfosType = res.data
                setBillList(data);
            }).catch((err) => {
                console.log(err);
            })
        }

        getAllUserPayment()
    },[]);

    return (
        <>
            <Space direction="vertical" style={{ marginBottom: '20px' }} size="middle">
                <Space>
                    <Radio.Group
                        optionType="button"
                        value={currentBillOption}
                        onChange={(e) => {
                            setBillOptions(e.target.value)
                            console.log(e.target.value);
                        }}
                    >
                        {billOption.map((item) => (
                            <Radio.Button key={item} value={item}>
                                {item}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Space>
            </Space>
            <List
                pagination={{ position: 'bottom', align: 'center' }}
                dataSource={getFilteredBillList()}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                            }
                            title={<a href="https://ant.design">Bookng Number: {item.id}
                            <br/> Total Bill: ${item.TotalBill}</a>}    
                            description={
                            <a>Start time: {new Date(item.start_time).toLocaleString("en-SG")} - End time: {new Date(item.end_time).toLocaleString("en-SG")}
                            <br/>Location: {item.chargerAddress}
                            </a>
                            }
                        />
                        {currentBillOption == "outstanding" ? <Button onClick={() => {
                            router.push("/bill/payment")
                        }}>
                            Pay
                        </Button> : <Button>
                            Receipt
                        </Button>}
                    </List.Item>
                )}
            />
        </>
    );
}
export default Bill
export type { UserPaymentItem }