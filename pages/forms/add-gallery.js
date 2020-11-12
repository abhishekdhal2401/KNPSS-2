import { Field, Formik, useFormik } from "formik";
import {
  Form,
  Segment,
  Label,
  Button,
  Icon,
  Input,
  Select,
  Message,
  Dimmer,
  Loader,
  Header,
  Modal,
} from "semantic-ui-react";
import Head from "next/head";
import { useState } from "react";
import * as Yup from "yup";
import styles from "../../styles/components/forms/AddNews.module.css";

export default function AddGallery() {
  let imageFile = null;
  const [formProcessing, changeFormProcessing] = useState(false);
  const [showModelAfterProcess, changeModelAfterProcess] = useState(null);

  const validationSchema = Yup.object({
    date: Yup.date()
      .max(
        new Date(),
        `date must be less than ${new Date().toISOString().substr(0, 10)}`
      )
      .required("Enter a date please"),
    heading: Yup.string().required("Heading Required"),
  });

  const formik = useFormik({
    initialValues: {
      date: new Date().toISOString().substr(0, 10),
      heading: "",
      images: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(imageFile);
      changeFormProcessing(true);
      const formData = new FormData();
      Object.keys(values).forEach((value) => {
        if (value === "images" || value === "pdfs") {
          Array.from(values[value]).forEach((element) => {
            formData.append(value, element);
          });
        } else {
          formData.append(value, values[value]);
        }
      });
      const api = "/api/formGallery";
      const response = await fetch(api, {
        method: "POST",
        body: formData,
      });

      const res = await response.json();

      changeFormProcessing(false);

      if (res.error|| response.status!=200) {
        // jhol jhaal hai
        changeModelAfterProcess({
          type: "error",
          content: "Sorry could complete the task, \n Reason : " + JSON.stringify(res,null,2),
        });
      } else {
        if (res.result === "success") {
          changeModelAfterProcess({
            type: "success",
            content: "Files added successfully",
          });
          resetForm();
        }
        // console.log(res.result);
      }
    },
  });

  const successModal = () => {
    return (
      <Modal
        basic
        onClose={() => changeModelAfterProcess(null)}
        onOpen={() => changeModelAfterProcess(null)}
        open={showModelAfterProcess != null ? true : false}
        size="small"
      >
        <Header icon>
          <Icon name="check"></Icon>
          {showModelAfterProcess.content}
        </Header>
        <Modal.Actions>
          <Button
            color="green"
            inverted
            onClick={() => changeModelAfterProcess(null)}
          >
            <Icon name="checkmark" /> OK
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  const failureModal = () => {
    return (
      <>
        <Modal
          basic
          onClose={() => changeModelAfterProcess(null)}
          onOpen={() => changeModelAfterProcess(null)}
          open={showModelAfterProcess != null ? true : false}
          size="small"
        >
          <Header icon>
            <Icon name="window close outline"></Icon>
            {showModelAfterProcess.content}
          </Header>
          <Modal.Actions>
            <Button
              color="red"
              inverted
              onClick={() => changeModelAfterProcess(null)}
            >
              <Icon name="checkmark" /> OK
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Gallery Form</title>
      </Head>
      {showModelAfterProcess == null
        ? null
        : showModelAfterProcess.type === "success"
        ? successModal()
        : failureModal()}
      <Dimmer page active={formProcessing}>
        <Loader active={formProcessing}>Sending files. Please wait!!!</Loader>
      </Dimmer>
      <Segment id={styles.mainSegment}>
        <Form onSubmit={formik.handleSubmit}>
          <>
            <Form.Input
              label="Date"
              type="date"
              id="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.date && formik.errors.date
                  ? { content: formik.errors.date }
                  : null
              }
            />
            <Form.Input
              label="Headline"
              type="text"
              placeholder="Heading about the content"
              id="heading"
              name="heading"
              value={formik.values.heading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.heading && formik.errors.heading
                  ? { content: formik.errors.heading }
                  : null
              }
            />

            <Form.Input
              label="Select Images"
              type="file"
              accept="image/*"
              multiple
              required
              onChange={(e) => {
                formik.setFieldValue("images", e.currentTarget.files);                
              }}
            />

            <Button type="submit" positive disabled={formProcessing}>
              Submit
            </Button>
          </>
        </Form>
      </Segment>
    </>
  );
}
