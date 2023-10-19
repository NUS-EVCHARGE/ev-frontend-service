'use client'
import { Button, Card, Col, Row } from 'antd'
import { useRouter } from 'next/router'
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { Calendar, theme } from 'antd';
import type { CalendarProps } from 'antd';
import { Flex } from '@aws-amplify/ui-react';

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
};

export interface Booking {
    id: number
    hour: string
    min: string
    status: boolean
}

const minInterval = ["00", "15", "30", "45"]
const hourInterval = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "00", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"]
const stubBooking: Array<Booking> = []

for (var h of hourInterval) {
    let id = 0
    for (var m of minInterval) {
        stubBooking.push(
            {
                id: id,
                hour: h,
                min: m,
                status: false
            }
        )
        id++
    }
}
export default function ChargerBooking({ params }: { params: { slug: string } }) {
    const [selectedDate, setSelectedDate] = useState<Dayjs>()
    const [bookingList, setBookingList] = useState([]);
    const { token } = theme.useToken();

    async function GetBookingByDate() {
        // get booking 
    }

    const onDateSelect = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
        console.log(value.format('YYYY-MM-DD'), mode);
        setSelectedDate(value)
    };
    const wrapperStyle: React.CSSProperties = {
        width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };

    return (
        <Flex wrap="wrap" gap="small">
            <div style={wrapperStyle}>
                <Calendar fullscreen={false}
                    onSelect={(date: Dayjs, { source }) => {
                        if (source === 'date') {
                            console.log('Panel Select:', date.format('YYYY-MM-DD'));
                            setSelectedDate(date)
                        }
                    }} />

            </div>
            {selectedDate && <div style={{
                width: '30vw',
                maxHeight: '100%',
                overflow: 'auto'
            }} title="booking">
                {Array.from(stubBooking, (b, _) => (
                    <Row>
                        <Col span={6}>
                        </Col>
                        <Col span={18}>
                            {b.status ? <Button disabled key={b.id}>
                                Booked
                            </Button> : <Button key={b.id} type="primary">
                                Book now!
                            </Button>}

                        </Col>
                    </Row>
                ))}
            </div>}

        </Flex>

    );

    // return <Card title="Booking Calendar">

    // </Card>
}