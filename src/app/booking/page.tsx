
'use client'
import React, { useEffect, useState } from 'react';
import { Avatar, List, Radio, Space } from 'antd';
import { get } from 'http';
import axios from 'axios';
import { getJwtToken } from '../utils';

const data = [
    {
        title: 'Ant Design Title 1',
    },
    {
        title: 'Ant Design Title 2',
    },
    {
        title: 'Ant Design Title 3',
    },
    {
        title: 'Ant Design Title 4',
    },
];
// declare booking interfaces
const bookingOptions = ['upcoming booking', 'past booking'];
const bookingUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "/booking"

function Booking() {
    const [bookingList, setBookingList] = useState()
    const [bookingOption, setBookingOption] = useState('upcoming booking')

    async function GetUserBooking() {
        const jwtToken = await getJwtToken();
        console.log(jwtToken)
        if (bookingOption == 'upcoming booking') {
            const { data } = await axios.get(bookingUrl, {
                headers: {
                    Accept: 'application/json',
                    Authentication: jwtToken?.toString()
                }
            })
            console.log(data)
        }
        // todo: set data to markers here
        // setBookingList(data)
    }

    useEffect(() => {
        GetUserBooking()
    }, [])


    return (
        <>
            <Space direction="vertical" style={{ marginBottom: '20px' }} size="middle">
                <Space>
                    <Radio.Group
                        optionType="button"
                        value={bookingOption}
                        onChange={(e) => {
                            setBookingOption(e.target.value)
                            console.log(e.target.value);
                        }}
                    >
                        {bookingOptions.map((item) => (
                            <Radio.Button key={item} value={item}>
                                {item}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Space>
            </Space>
            <List
                pagination={{ position: 'bottom', align: 'center' }}
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                            }
                            title={<a href="https://ant.design">{item.title}</a>}
                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                    </List.Item>
                )}
            />
        </>
    );
}
export default Booking