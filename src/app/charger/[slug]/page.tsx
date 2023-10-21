'use client'
import { Button, Card, Col, Row } from 'antd'
import { useRouter } from 'next/router'
import { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Calendar, theme, Typography } from 'antd';
import type { CalendarProps } from 'antd';
import { Flex } from '@aws-amplify/ui-react';

const { Text } = Typography
const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
};

export interface Booking {
    id: number
    hour: string
    min: string
    status: boolean
    selected: boolean
}

const minInterval = ["00", "15", "30", "45"]
const hourInterval = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "00", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
const stubBooking: Array<Booking> = []

for (var h of hourInterval) {
    let id = 0
    for (var m of minInterval) {
        stubBooking.push(
            {
                id: id,
                hour: h,
                min: m,
                status: false,
                selected: false
            }
        )
        id++
    }
}
export default function ChargerBooking({ params }: { params: { slug: string } }) {
    const [selectedDate, setSelectedDate] = useState<Dayjs>()
    const [bookingList, setBookingList] = useState<Booking[]>([]);
    const { token } = theme.useToken();

    useEffect(() => {
        setBookingList(stubBooking)
    }, [])

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

    function onBookingSelected(index: number) {
        console.log(bookingList[index].selected)
        bookingList[index].selected = !bookingList[index].selected
        console.log(bookingList[index].selected)
        setBookingList(bookingList)
    }

    return (
        <div style={{ width: '100%' }}>

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
                {selectedDate && <Card style={{
                    margin: 'auto',
                    width: '30vw',
                    maxHeight: '75vh',
                    overflow: 'scroll'
                }} title="booking" extra={
                    <Button >
                        book now!
                    </Button>}>
                    {Array.from(bookingList, (b, index) => (
                        <div key={index}>
                            {b.status ? <Button style={{ width: '80%', margin: 'auto' }} disabled key={index}>
                                Booked
                            </Button> : <Button style={{ width: '80%', margin: 'auto' }} key={index} danger={b.selected} onClick={function () {
                                onBookingSelected(index)
                            }}>
                                {b.hour}:{b.min}
                            </Button>}
                        </div>
                    ))}
                </Card>}

            </Flex>
        </div>
    );

    // return <Card title="Booking Calendar">

    // </Card>
}

function BookingButton() {

}