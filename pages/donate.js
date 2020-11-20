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
    <div className={styles.mainMainDiv}>
      <Head>
        <title>Donate</title>
        <meta name="viewport" content="width=device-width"></meta>
      </Head>
      <Navbar />
      <Divider id={styles.donateUsHeader} horizontal clearing>
        <Header as="h1">Donate to us</Header>
      </Divider>
        <div className={styles.mainDiv}>
          <div className={styles.contentDiv}>
            <h1>Why should you donate</h1>
            <ul>
              <li>Environment</li>
              <li>Environment</li>
              <li>Environment</li>
              <li>Environment</li>
            </ul>
          </div>
          <div className={styles.nonContentDiv}>
            <div className={styles.imageDiv}>
              <img className={styles.image} src="/ecology.svg"></img>
            </div>
            <div className={styles.buttonDiv}>
              <form id="donateForm"></form>
            </div>
          </div>
      </div>
    </div>
  );
}
