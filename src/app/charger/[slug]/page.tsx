'use client'
import { Button, Card, Col, Row } from 'antd'
import { useRouter } from 'next/router'
import { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Calendar, theme, Typography } from 'antd';
import type { CalendarProps } from 'antd';
import { Flex } from '@aws-amplify/ui-react';
import axios from 'axios';
import { generateFullTime, getJwtToken, isDateMatch, parseTime } from '@/app/utils';
import { create } from 'domain';
import { start } from 'repl';

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

export interface CreateBookingReqObj {
    charger_id: number
    start_time: string
    end_time: string
}

export interface BookingResponseObj {
    charger_id: number
    email: string
    start_time: string
    end_time: string
    status: string
}

const minInterval = ["00", "15", "30", "45"]
const hourInterval = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "00", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
const stubBooking: Array<Booking> = []
const stubBookingMap: Map<string, Booking> = new Map([])

for (var h of hourInterval) {
    let id = 0
    for (var m of minInterval) {
        stubBookingMap.set(h + ":" + m, {
            id: id,
            hour: h,
            min: m,
            status: false,
            selected: false
        })
        // stubBooking.push(
        //     {
        //         id: id,
        //         hour: h,
        //         min: m,
        //         status: false,
        //         selected: false
        //     }
        // )
        id++
    }
}
const baseUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL)
const getAllBookingUrl = baseUrl + "/booking/all"
const bookingUrl = baseUrl + "/booking"

export default function ChargerBooking({ params }: { params: { slug: number } }) {
    const [selectedDate, setSelectedDate] = useState<Dayjs>()
    const [bookingList, setBookingList] = useState<Map<string, Booking>>(new Map());
    const { token } = theme.useToken();

    useEffect(() => {
        GetAllBooking()
        setBookingList(stubBookingMap)
    }, [])

    async function GetAllBooking() {
        const jwtToken = await getJwtToken();
        const { data } = await axios.get(getAllBookingUrl, {
            headers: {
                Accept: 'application/json',
                Authentication: jwtToken?.toString()
            }
        })
        console.log(data)

        for (let b of data) {
            if (b.Status != 'completed') {
                let setBooking = false
                bookingList.forEach((booking, time) => {

                    if (selectedDate != undefined && isDateMatch(selectedDate, b.start_time)) {
                        setBooking = true
                    }

                    if (selectedDate != undefined && isDateMatch(selectedDate, b.endTime)) {
                        setBooking = false
                    }

                    booking.status = setBooking
                    bookingList.set(time, booking)
                })
                setBookingList(bookingList)
            }
        }
        // get booking 
    }

    async function createBookingReq(bookingReq: CreateBookingReqObj) {
        const jwtToken = await getJwtToken();
        const { data } = await axios.post(bookingUrl, {
            bookingReq
        }, {
            headers: {
                Accept: 'application/json',
                Authentication: jwtToken?.toString()
            }
        })
        console.log(data)
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

    function onBookingSelected(key: string) {
        let b = bookingList.get(key)
        if (b != undefined) {
            b.selected = !b.selected
            bookingList.set(key, b)
        }
        setBookingList(bookingList)
    }

    function createBooking() {
        let startTime: string
        let endTime: string
        let isBooking = false
        bookingList.forEach((booking, time) => {
            if (booking.selected && selectedDate != undefined && !isBooking) {
                startTime = generateFullTime(selectedDate, time)
                isBooking = true
            }
            if (isBooking && !booking.selected && selectedDate != undefined) {
                endTime = generateFullTime(selectedDate, time)
                isBooking = false
                let bookingReq: CreateBookingReqObj = {
                    charger_id: params.slug,
                    start_time: startTime,
                    end_time: endTime
                }
                // todo set loading function
                createBookingReq(bookingReq)
            }
        });
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

                    <Button onClick={createBooking}>
                        book now!
                    </Button>}>

                    {Array.from(bookingList.entries(), (b, index) => (
                        <div key={index}>
                            {b[1].status ? <Button style={{ width: '80%', margin: 'auto' }} disabled key={index}>
                                Booked
                            </Button> : <Button style={{ width: '80%', margin: 'auto' }} key={index} danger={b[1].selected} onClick={function () {
                                onBookingSelected(b[0])
                            }}>
                                {b[0]}
                            </Button>}
                        </div>
                    ))
                    }



                    {/* {Array.from(bookingList, (b, index) => (
                        <div key={index}>
                            {b.status ? <Button style={{ width: '80%', margin: 'auto' }} disabled key={index}>
                                Booked
                            </Button> : <Button style={{ width: '80%', margin: 'auto' }} key={index} danger={b.selected} onClick={function () {
                                onBookingSelected(index)
                            }}>
                                {b.hour}:{b.min}
                            </Button>}
                        </div>
                    ))

                    } */}
                </Card>}

            </Flex>
        </div>
    );

    // return <Card title="Booking Calendar">

    // </Card>
}

function BookingButton() {

}