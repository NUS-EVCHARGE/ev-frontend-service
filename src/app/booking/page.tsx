
'use client'
import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Radio, Space } from 'antd';
import { get } from 'http';
import axios from 'axios';
import { getJwtToken } from '../utils';
import { Booking, BookingResponseObj } from '../charger/[slug]/page';
import { Dayjs } from 'dayjs';

// declare booking interfaces
const bookingOptions = ['upcoming booking', 'past booking'];
const bookingUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "/booking"

function Booking() {
    const [bookingList, setBookingList] = useState<BookingResponseObj[]>([])
    const [bookingOption, setBookingOption] = useState('upcoming booking')
    const [isOngoingBooking, setIsOngoingBooking] = useState(false)
    async function GetUserBooking() {
        const jwtToken = await getJwtToken();
        console.log(jwtToken)
        const { data } = await axios.get(bookingUrl, {
            headers: {
                Accept: 'application/json',
                Authentication: jwtToken?.toString()
            }
        })
        console.log(data)

        data.forEach((booking: BookingResponseObj, index: number) => {
            if (bookingOption != "upcoming_booking" && booking.status == "completed") {
                bookingList.push(booking)
            } else if (booking.status == "ongoing") {
                // check if end time < current time 
                let currentDate = new Dayjs()
                console.log("current date: ", currentDate)
                setIsOngoingBooking(true)
            } else {
                // when it is history option
                bookingList.push(booking)
            }
        })
        setBookingList(bookingList)
    }

    async function UpdateBookingReq(booking: BookingResponseObj) {
        const jwtToken = await getJwtToken();
        console.log(jwtToken)

        const { data } = await axios.patch(bookingUrl, {
            booking
        }, {
            headers: {
                Accept: 'application/json',
                Authentication: jwtToken?.toString()
            }
        })
        console.log(data)
    }
    useEffect(() => {
        GetUserBooking()
        // check for ongoing complete is it completed.. if completed call update booking api to change it to completed
    }, [])



    function updateBooking(index: number, status: string) {
        let booking = bookingList[index]
        booking.status = status
        UpdateBookingReq(booking)
        bookingList[index] = booking
        setBookingList(bookingList)
    }

    function endCharging(index: number) {
        bookingList[index].status = "completed"
        setIsOngoingBooking(false)
        setBookingList(bookingList)
    }

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
                dataSource={bookingList}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            title={<a href="https://ant.design">{item.start_time}</a>}
                            description={item.status}
                        />
                        {!isOngoingBooking && <Button onClick={function () {
                            updateBooking(index, "ongoing")
                        }}>
                            Start
                        </Button>}

                        {isOngoingBooking && <Button onClick={function () {
                            updateBooking(index, "completed")
                        }}>
                            End Charging
                        </Button>
                        }
                    </List.Item>
                )}
            />
        </>
    );
}
export default Booking