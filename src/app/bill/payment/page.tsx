'use client'
import React, { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout";
import axios from "axios";
import { getJwtToken } from "../../utils";
import { UserPaymentItem } from "../page";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_REACT_STRIPE_PUBLISABLE_API ?? "");

interface PageProps {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

const Payment = ({ params, searchParams }: PageProps ) => {
    const [clientSecret, setClientSecret] = useState("");
    const booking: number = typeof searchParams['bookingId'] === 'string' ? parseInt(searchParams['bookingId']) : 0;
    useEffect(() => {

        async function getAllUserPayment() {
            const jwtToken = await getJwtToken()
            axios.get(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + '/payment/user/getAllBooking', {
                headers: {
                    Accept: 'application/json',
                    Authentication: jwtToken?.toString()
                }
            }).then((res) => {
                const data = res.data['pending'] as UserPaymentItem[];
                console.log(data);
                const filteredData = data.filter((item) => item.bookingId == booking)
                console.log(filteredData);
                console.log(booking);
                if (filteredData.length > 0) {
                    getPaymentIntent(filteredData[0])
                } else {
                    console.log('No booking found')
                }
            }).catch((err) => {
                console.log(err);
            })
        }

        // Create PaymentIntent as soon as the page loads
        async function getPaymentIntent(item: UserPaymentItem) {
            const jwtToken = await getJwtToken();
            axios.post(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + '/payment/provider', item, {
                headers: {
                    Accept: 'application/json',
                    Authentication: jwtToken?.toString()
                }   
            }).then((res) => {
                console.log(res)
                setClientSecret(res.data.stripe)
            }).catch((err) => {
                console.log(err);
            });
        }

        getAllUserPayment();

    }, []);

    const appearance = {
        theme: 'stripe' as const,
    };
    const options: StripeElementsOptions = {
        clientSecret,
        appearance,
    };

    return (
        <div className="App">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
};

export default Payment;