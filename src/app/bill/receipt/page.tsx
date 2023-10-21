"use client";
import React, { useState, useEffect } from "react";
import { Card, Space, Typography } from "antd";
import axios from "axios";
import { getJwtToken } from "../../utils";
import { UserPaymentItem } from "../page";

const { Title, Text } = Typography;

export default function Receipt() {
  const [receipt, setReceipt] = useState<UserPaymentItem | null>(null);
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const bookingId = urlParams.get("bookingId");
    const booking: number =
      typeof bookingId === "string" ? parseInt(bookingId) : 0;

    async function getUserPayment() {
      const jwtToken = await getJwtToken();
      axios
        .get(
          process.env.NEXT_PUBLIC_REACT_APP_BASE_URL +
            "/payment/user/" +
            booking,
          {
            headers: {
              Accept: "application/json",
              Authentication: jwtToken?.toString(),
            },
          }
        )
        .then((res) => {
          if (res.data) {
            setReceipt(res.data[0]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    getUserPayment();
  }, []);

  const data = receipt as UserPaymentItem;
  return receipt ? (
    <Card>
      <Space direction="vertical" align="center">
        <Title>Receipt for Booking Number {receipt?.bookingId}</Title>
        <Text>
            Email: {receipt?.userEmail}
        </Text>
        <Text>
            Charger Address: {receipt?.chargerAddress}
        </Text>
        <Text>
            Charger ID: {receipt?.charger_id}
        </Text>
        <Text>
            Start Date Time: {new Date(receipt?.start_time).toLocaleString("en-SG")} 
        </Text>
        <Text>
            End Date Time: {new Date(receipt?.end_time).toLocaleString("en-SG")} 
        </Text>
        <Text>
            Total Price: {receipt?.TotalBill}
        </Text>
        <Text>
            Payment Status: {receipt?.paymentStatus}
        </Text>
      </Space>
    </Card>
  ) : (
    <></>
  );
}
