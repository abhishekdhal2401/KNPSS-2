import { fetchIdList, fetchForId } from "../../../lib/fetchForNews";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import {
  Dimmer,
  Header,
  Segment,
  Form,
  Button,
  Image,
  Icon,
  Loader,
} from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Post({ news }) {
  const [imageList, changeImageList] = useState([]);
  const [pdfList, changePdfList] = useState([]);
  const [processingType, setProcessingType] = useState([false, null]);
  const [inProcessing, setInProcessing] = useState(null);
  const router = useRouter();
  if (router.isFallback) {
    return (
      <div>
        {" "}
        <Dimmer page>
          <Header>Content Loading Please Wait!!</Header>
        </Dimmer>
      </div>
    );
  }
  const [remoteFiles, deleteRemoteFiles] = useState([
    ...news.imagesPath,
    ...news.pdfsPath,
  ]);
  const continueDelete = async (content) => {
    setInProcessing("processing");
    switch (content) {
      case "post":
        // console.log("Post deletion Sequence");
        const deleteResponse = await fetch("/api/deleteBlog", {
          method: "POST",
          body: JSON.stringify({ _id: news._id, type: "news" }),
        });
        // delete from type{new,achievement}
        // delete from gallery
        const delRes = await deleteResponse.json();
        if (delRes.message === "deleted") {
          setInProcessing("processed");
          // delete this route
          router.back();
        }
        break;

      default:
        // just need to delete that file name from images or pdfs list
        deleteRemoteFiles([...formik.values.images, ...formik.values.pdfs]);
        // console.log("File deletion Sequence");
        setInProcessing("processed");
        break;
    }
  };
  const updatePost = async (formData) => {
    //   update the content with the id
    // update the gallery with same id
    const response = await fetch("/api/updateNews", {
      method: "POST",
      body: formData,
    });
    const res = await response.json();
    console.log(res);
    return res;
  };
  const validationSchema = Yup.object({
    date: Yup.date()
      .max(
        new Date(),
        `date must be less than ${new Date().toISOString().substr(0, 10)}`
      )
      .required("Enter a date please"),
    heading: Yup.string().required("Heading Required"),
    content: Yup.string().required("Some Details Required"),
  });
  const formik = useFormik({
    initialValues: {
      date: news.date,
      heading: news.heading,
      content: news.content,
      images: news.imagesPath,
      pdfs: news.pdfsPath,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setInProcessing("processing");

      const formData = new FormData();

      formData.append("_id", news._id);
      // console.log(values);

      Object.keys(values).forEach((value) => {
        if (value === "images" || value === "pdfs") {
          values[value].forEach((path) => {
            formData.append(value, path);
          });
          // formData.append(value, path);
        } else {
          formData.append(value, values[value]);
        }
      });

      imageList[0] != null ? formData.append("imageFile", ...imageList) : null;
      pdfList[0] != null ? formData.append("pdfFile", ...pdfList) : null;

      await updatePost(formData);

      setInProcessing("processed");
    },
  });
  return (
    <div>
      <Head>
        <title>{news.heading}</title>
      </Head>
      <Dimmer page active={inProcessing != null}>
        {inProcessing === "processing" && <Loader active>Loading</Loader>}
        {inProcessing === "processed" && (
          <>
            <Header icon inverted>
              {" "}
              <Icon name="check" color="green" /> Deletion Successfull{" "}
            </Header>
            <br />
            <Button
              onClick={() => {
                setInProcessing(null);
              }}
            >
              {" "}
              Ok
            </Button>
          </>
        )}
      </Dimmer>
      <Dimmer page active={processingType[0]}>
        <Header as="h2" icon inverted>
          <Icon name="delete" />
          Do you want to confirm deletion
          <Header.Subheader>{processingType[1]}</Header.Subheader>
        </Header>
        <br />
        <Button
          negative
          onClick={() => {
            continueDelete(processingType[1]);
            setProcessingType([false, processingType[1]]);
          }}
        >
          Delete
        </Button>
        <Button primary onClick={() => setProcessingType([false, null])}>
          Cancel
        </Button>
      </Dimmer>
      <Segment>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Input
            label="Date"
            id="date"
            type="date"
            {...formik.getFieldProps("date")}
            error={formik.errors.date ? { content: formik.errors.date } : null}
          />
          <Form.Input
            label="Heading"
            id="heading"
            type="text"
            {...formik.getFieldProps("heading")}
            error={
              formik.errors.heading ? { content: formik.errors.heading } : null
            }
          />
          <Form.TextArea
            label="Details"
            id="details"
            type="text"
            {...formik.getFieldProps("content")}
            error={
              formik.errors.content ? { content: formik.errors.content } : null
            }
          />
          <Header>Images</Header>
          <Segment key="image">
            <div>
              {formik.values.images.map((image) => {
                return (
                  <div key={image}>
                    <Image
                      src={image}
                      size="small"
                      style={{ display: "inline" }}
                    ></Image>
                    <Icon
                      name="close"
                      color="red"
                      style={{ marginLeft: "10px" }}
                      onClick={() => {
                        const index = formik.values.images.indexOf(image);
                        formik.values.images.splice(index, 1);
                        setProcessingType([true, image]);
                      }}
                    ></Icon>
                    {/* <FinalizeModal type="image" /> */}
                  </div>
                );
              })}
              <br />

              <Form.Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  changeImageList(e.currentTarget.files);
                  // console.log(imageList);
                }}
              />
              <Button
                type="button"
                icon="close"
                labelPosition="left"
                content="Clear Files"
                color="red"
                onClick={(e) => {
                  // console.log(e.target.form[3].value);
                  e.target.form[3].value = "";
                }}
              />
            </div>
          </Segment>
          <Header>Pdfs</Header>
          <Segment key="pdf">
            <div>
              {formik.values.pdfs.map((pdf) => {
                return (
                  <div key={pdf}>
                    <a href={pdf}>{pdf.slice(pdf.search("_") + 1)}</a>
                    <Icon
                      name="close"
                      color="red"
                      style={{ marginLeft: "10px" }}
                      onClick={() => {
                        const index = formik.values.pdfs.indexOf(pdf);
                        formik.values.pdfs.splice(index, 1);
                        setProcessingType([true, pdf]);
                      }}
                    ></Icon>
                    {/* <FinalizeModal type="pdf" /> */}
                  </div>
                );
              })}

              <br />
              <Form.Input
                type="file"
                accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf"
                multiple
                id="pdfMultiple"
                onChange={(e) => {
                  changePdfList(e.currentTarget.files);
                  // console.log(pdfList);
                }}
                style={{ display: "inline" }}
              />
              <Button
                type="button"
                icon="close"
                labelPosition="left"
                content="Clear Files"
                color="red"
                onClick={(e) => {
                  // console.log(e.target.form[5].value);
                  e.target.form[5].value = "";
                }}
              />
            </div>
          </Segment>
          <Button type="submit" positive>
            Update
          </Button>
          <Button
            negative
            type="button"
            floated="right"
            onClick={() => {
              setProcessingType([!processingType[0], "post"]);
            }}
          >
            Delete Blog
          </Button>
        </Form>
      </Segment>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = await fetchIdList();
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const news = JSON.parse(await fetchForId(params.id));
  return {
    props: {
      news: news[0],
    },
  };
}
