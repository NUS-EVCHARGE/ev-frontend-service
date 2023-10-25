
'use client'
import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Radio, Space } from 'antd';
import { get } from 'http';
import axios from 'axios';
import { getJwtToken } from '../utils';
import { Booking, BookingResponseObj } from '../charger/[slug]/page';
import { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';

// declare booking interfaces
const bookingOptions = ['upcoming booking', 'past booking'];
const bookingUrl = String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL) + "/booking"

function BookingView() {
    const [bookingList, setBookingList] = useState<BookingResponseObj[]>([])
    const [bookingOption, setBookingOption] = useState('upcoming booking')
    const [isOngoingBooking, setIsOngoingBooking] = useState(false)
    const router = useRouter()

    async function GetUserBooking(option: string) {
        const jwtToken = await getJwtToken();
        console.log(jwtToken)
        const { data } = await axios.get(bookingUrl, {
            headers: {
                Accept: 'application/json',
                Authentication: jwtToken?.toString()
            }
        })
        console.log(data)
        let newBookingList: BookingResponseObj[] = []
        data.forEach((booking: BookingResponseObj, index: number) => {
            console.log(booking, bookingOption)
            if (option != "upcoming booking" && booking.Status == "completed") {
                // when it is history option
                newBookingList.push(booking)
            } else if (booking.Status == "ongoing") {
                // check if end time < current time 
                setIsOngoingBooking(true)
                newBookingList.push(booking)
            } else if (option == "upcoming booking" && booking.Status != "completed") {
                // when it is history option
                newBookingList.push(booking)
            }
        })
        console.log(newBookingList)

        setBookingList(newBookingList)
    }

    async function UpdateBookingReq(booking: BookingResponseObj) {
        const jwtToken = await getJwtToken();

        const { data } = await axios.patch(bookingUrl, {
            id: booking.id,
            charger_id: booking.charger_id,
            start_time: new Date(booking.start_time),
            end_time: new Date(booking.end_time),
            Status: booking.Status
        }, {
            headers: {
                Accept: 'application/json',
                Authentication: jwtToken?.toString()
            }
        })
        console.log(data)
        setIsOngoingBooking(true)
    }

    async function DeleteBookingReq(id: number) {
        const jwtToken = await getJwtToken();

        const { data } = await axios.delete(bookingUrl + "/" + id, {
            headers: {
                Accept: 'application/json',
                Authentication: jwtToken?.toString()
            }
        })
        console.log("delete res: ", data)
    }

    useEffect(() => {
        GetUserBooking(bookingOption)
        // check for ongoing complete is it completed.. if completed call update booking api to change it to completed
    }, [])

    useEffect(() => {
        console.log(bookingList)
        // check for ongoing complete is it completed.. if completed call update booking api to change it to completed
    }, [bookingList])

    function updateBooking(index: number, status: string) {
        let newBookingList = new Array<BookingResponseObj>(...bookingList)
        let booking = newBookingList[index]
        booking.Status = status
        UpdateBookingReq(booking)
        newBookingList[index] = booking
        setBookingList(newBookingList)
    }

    function endCharging(index: number) {
        bookingList[index].Status = "completed"
        setIsOngoingBooking(false)
        setBookingList(bookingList)
    }

    function deleteBooking(index: number) {
        DeleteBookingReq(bookingList[index].id)
        let newBookingList = new Array<BookingResponseObj>(...bookingList)
        newBookingList.splice(index, 1)
        setBookingList(newBookingList)
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
                            GetUserBooking(e.target.value)
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
                            title={"[" + item.start_time + "] to [" + item.end_time + "]"}
                            description={item.Status}
                        />

                        {!isOngoingBooking && bookingOption != "past booking" && <Button onClick={function () {
                            updateBooking(index, "ongoing")
                        }}>
                            Start
                        </Button>}

                        {isOngoingBooking && bookingOption != "past booking" && <Button onClick={function () {
                            updateBooking(index, "completed")
                        }}>
                            End Charging
                        </Button>
                        }

                        {!isOngoingBooking && bookingOption != "past booking" && <Button style={{ margin: '5px' }} danger onClick={function () {
                            deleteBooking(index)
                        }}>
                            Delete
                        </Button>}

                        {bookingOption == "past booking" && <Button onClick={function () {
                            router.push("/bill")
                        }}>
                            Bill
                        </Button>}
                    </List.Item>
                )}
            />
        </>
    );
}
export default BookingView