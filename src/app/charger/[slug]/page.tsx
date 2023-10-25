'use client'
import { Button, Card, Col, Row } from 'antd'
import { useRouter } from 'next/navigation'
import { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Calendar, theme, Typography } from 'antd';
import type { CalendarProps } from 'antd';
import { Flex } from '@aws-amplify/ui-react';
import axios from 'axios';
import { generateFullTime, getJwtToken, isDateMatch, isTimeBeforeNow, isTimeMatch, parseTime } from '@/app/utils';
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
    endMin: string
    status: boolean
    selected: boolean
    statusReason: string
}

export interface CreateBookingReqObj {
    charger_id: number
    start_time: string
    end_time: string
    Status: string
}

export interface BookingResponseObj {
    id: number
    charger_id: number
    email: string
    start_time: string
    end_time: string
    Status: string
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
            endMin: (+m + 14).toString(),
            status: false,
            selected: false,
            statusReason: ""
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
    const [selectedDate, setSelectedDate] = useState<string>()
    const [bookingList, setBookingList] = useState<Map<string, Booking>>(new Map());
    const { token } = theme.useToken();
    const router = useRouter();
    useEffect(() => {
        console.log("use effect trigger")
        GetAllBooking()
        // setBookingList(stubBookingMap)
    }, [selectedDate])

    useEffect(() => {
        console.log(bookingList)
    }, [bookingList])

    async function GetAllBooking() {
        const jwtToken = await getJwtToken();
        const { data } = await axios.get(getAllBookingUrl, {
            headers: {
                Accept: 'application/json',
                Authentication: jwtToken?.toString()
            }
        })
        console.log(data)

        let newBookingList = new Map(stubBookingMap)
        newBookingList.forEach((booking, time) => {
            booking.selected = false
            booking.status = false
        })

        for (let b of data) {
            let setBooking = false
            newBookingList.forEach((booking, time) => {
                console.log("looping: ", b, selectedDate, time)
                if (selectedDate != undefined) {
                    if (isDateMatch(selectedDate, b.start_time) || isDateMatch(selectedDate, b.end_time)) {
                        console.log("date matched")
                        if (isTimeMatch(time, b.start_time)) {
                            console.log("start time matched")

                            booking.status = true
                            booking.statusReason = "booked"
                            setBooking = true
                        } else if (isTimeMatch(booking.hour + ":" + booking.endMin, b.end_time)) {
                            console.log("end time matched")
                            booking.status = false
                            setBooking = false
                        } else if (setBooking) {
                            booking.status = true
                        }
                        console.log(booking)
                        newBookingList.set(time, booking)
                    }
                } else {
                    console.log("selected data is undefined")
                }
                booking.selected = false
            })
        }
        setBookingList(newBookingList)
    }

    async function createBookingReq(bookingReq: CreateBookingReqObj) {
        const jwtToken = await getJwtToken();
        const { data } = await axios.post(bookingUrl, {
            charger_id: bookingReq.charger_id,
            start_time: new Date(bookingReq.start_time),
            end_time: new Date(bookingReq.end_time),
            Status: bookingReq.Status
        }, {
            headers: {
                Accept: 'application/json',
                Authentication: jwtToken?.toString()
            }
        })
        console.log("create booking: ", data)
    }

    const wrapperStyle: React.CSSProperties = {
        width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };

    function onBookingSelected(key: string) {
        const newBookingList = new Map(bookingList)
        let b = newBookingList.get(key)
        if (b != undefined) {
            b.selected = !b.selected
            newBookingList.set(key, b)
        }
        setBookingList(newBookingList)
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
                endTime = generateFullTime(selectedDate, booking.hour + ":" + booking.endMin)
                isBooking = false
                let bookingReq: CreateBookingReqObj = {
                    charger_id: +params.slug,
                    start_time: startTime,
                    end_time: endTime,
                    Status: "waiting"
                }
                console.log(bookingReq)
                // todo set loading function
                createBookingReq(bookingReq)
            }
        });
        router.push("/booking")
    }

    return (
        <div style={{ width: '100%' }}>

            <Flex wrap="wrap" gap="small">
                <div style={wrapperStyle}>
                    <Calendar fullscreen={false}
                        onSelect={(date: Dayjs, { source }) => {
                            if (source === 'date') {
                                console.log('Panel Select:', date.format('YYYY-MM-DD'));
                                setSelectedDate(date.format("YYYY-MM-DD"))
                                // let newBookingList = new Map(bookingList)
                                // newBookingList.forEach((booking, time) => {
                                //     booking.selected = false
                                //     newBookingList.set(time, booking)
                                // })
                                // setBookingList(newBookingList)
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
                                {b[0]} - {b[1].hour}:{b[1].endMin}
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