'use client'
import React, { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout";
import axios from "axios";
import { getJwtToken } from "../../utils";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51NrNOGGLXzXpdEz5VdJ52FARjWR4JAe2Y8xiKXmAJQJe4ntELEngRXKknHT8FEYwyZSSYQcvkEcgwTU6P37Z88QN00EqzUnnaO");

interface PageProps {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

const Payment = ({ params, searchParams }: PageProps ) => {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        async function getPaymentIntent() {
            const jwtToken = await getJwtToken();
            axios.post(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + '/payment/provider', {TotalBill: 123}, {
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

        getPaymentIntent();
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