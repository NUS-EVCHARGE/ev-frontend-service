
'use client'
import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Radio, Space } from 'antd';
import { get } from 'http';
import { useRouter } from 'next/navigation';

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

const billOption = ['outstanding', 'completed'];
// const defaultBookingOption = 'upcoming booking'

function Bill() {
    const [billList, setBillList] = useState()
    const [currentBillOption, setBillOptions] = useState('outstanding')
    const router = useRouter()
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