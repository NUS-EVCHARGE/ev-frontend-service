"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Card, Space, Typography } from "antd";
import {
  useStripe, Elements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { UserPaymentItem } from "../page";
import { getJwtToken } from "../../utils";

const { Title, Text } = Typography;

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_REACT_STRIPE_PUBLISABLE_API ?? "");

function PaymentCompletePage() {

  const stripe = useStripe();
  const [message, setMessage] = useState<string>();
  const bookingId = new URLSearchParams(window.location.search).get(
    "bookingId"
  );
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  const getUserPayment = async () => {
    const jwtToken = await getJwtToken()
    const response = axios.get(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + "/payment/user/getAllBooking", {
          headers: {
            Accept: 'application/json',
            Authentication: jwtToken?.toString()
        }
      })
      .then((response) => {
        console.log(response.data);
        return response.data['pending'].find((item: UserPaymentItem) => item.bookingId == Number(bookingId)) as UserPaymentItem;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    return response;
  };

  const updateUserPayment = async (item : UserPaymentItem) => {
    const jwtToken = await getJwtToken()
    const response = axios
      .post(
        process.env.NEXT_PUBLIC_REACT_APP_BASE_URL +
          `/payment/user/completed`, item,
        {
          headers: {
            Accept: "application/json",
            Authentication: jwtToken?.toString(),
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        return response.data as UserPaymentItem;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    return response;
  };

  const updateCompleton = () => {
    getUserPayment().then((response) => {
      console.log(response);
      const userPayment = response as UserPaymentItem;
      userPayment.paymentStatus = "completed";
      updateUserPayment(userPayment);
    }).catch((error) => {
      console.log(error);
    });
  } 

  useEffect(() => {

    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent!.status) {
        case "succeeded":
          console.log("Payment succeeded!");
          setMessage("Payment succeeded!");
          updateCompleton();
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });

  },[clientSecret, stripe]);
  
  return (
      <Card>
        <Space direction="vertical" align="center">
          <Title>{message}</Title>
          <Text>
            Thank you for your payment. We willl send you a confirmation email.
          </Text>
        </Space>
      </Card>
  );
}

export default function PaymentCompletePageWrapper() {
  return (
    <Suspense fallback="loading">
       <Elements stripe={stripePromise}>
      <PaymentCompletePage />
    </Elements>
    </Suspense>
  );
}
