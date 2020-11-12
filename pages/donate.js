import Head from "next/head";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";

export default function Donate() {
  useEffect(() => {
    let Script = document.createElement("script");
    let Form = document.getElementById('donateForm');
    Script.setAttribute('src','https://checkout.razorpay.com/v1/payment-button.js')
    Script.setAttribute('data-payment_button_id','pl_FzqIGx0YAqCvUH')
    Form.appendChild(Script);
  }, []);
  return (
    <div>
      <Head>
        <title>Donate</title>
        <meta name="viewport" content="width=device-width"></meta>
      </Head>
      <Navbar />
      <h1>Donation Page</h1>
      <form id='donateForm' ></form>
    </div>
  );
}
