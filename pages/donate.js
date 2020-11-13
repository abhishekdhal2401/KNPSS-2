import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/navbar";
import { Segment, Header, Divider } from "semantic-ui-react";
import { useEffect, useState } from "react";
import styles from "../styles/Donate.module.css";

export default function Donate() {
  useEffect(() => {
    let Script = document.createElement("script");
    let Form = document.getElementById("donateForm");
    Script.setAttribute(
      "src",
      "https://checkout.razorpay.com/v1/payment-button.js"
    );
    Script.setAttribute("data-payment_button_id", "pl_FzqIGx0YAqCvUH");
    if (Form.children.length == 0) {
      Form.appendChild(Script);
    }
  }, []);
  return (
    <div>
      <Head>
        <title>Donate</title>
        <meta name="viewport" content="width=device-width"></meta>
      </Head>
      <Navbar />
      <Divider horizontal>
        <Header>Donate us</Header>
      </Divider>
      <div className={styles.imageDiv} >
      <Image src="/favicon.png" width={200} height={200} className={styles.image} />
      </div>
      <Segment>
        <form id="donateForm"></form>
      </Segment>
    </div>
  );
}
