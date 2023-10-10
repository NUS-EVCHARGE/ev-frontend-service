
'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Button, List, Radio, Space } from 'antd';
import { useRouter } from 'next/navigation';
import axios, { AxiosRequestHeaders } from 'axios';
import { getJwtToken } from '../utils';

const billOption = ['outstanding', 'completed'];
// const defaultBookingOption = 'upcoming booking'

function Bill() {
    const [billList, setBillList] = useState<Booking[]>([])
    const [currentBillOption, setBillOptions] = useState('outstanding')
    const router = useRouter()

    type Booking = {
        id: number,
        charger_id: number,
        Email: string,
        start_time: string,
        end_time: string,
        Status: string,
    }

    useEffect(() => {
        async function getAllBooking() {
            const jwtToken = await getJwtToken()
            const headers: AxiosRequestHeaders = {
                'Content-Type': 'application/json',
              };
              if (jwtToken) {
                headers['Authentication'] = jwtToken;
              }
            axios.get(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + '/booking', {
                headers: headers
            }).then((res) => {
                const data : Booking[] = res.data.filter((item: Booking) => {
                    if (item.Status == "completed") {
                        return {
                            item
                        }
                    }
                });
                setBillList(data);
            }).catch((err) => {
                console.log(err);
            })
        }
        getAllBooking()
    }, [])

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
                dataSource={billList}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                            }
                            title={<a href="https://ant.design">Booking: {item.id} - Charger: {item.charger_id}</a>}
                            description={`Start time: ${item.start_time} - End time: ${item.end_time}`}
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