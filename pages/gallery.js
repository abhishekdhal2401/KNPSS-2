import { Divider, Header, Grid, Icon, Modal, Button } from "semantic-ui-react";
import { fetchAllGallery } from "../lib/fetchForGallery";
import Navbar from "../components/navbar";
import Head from "next/head";
import styles from "../styles/Gallery.module.css";
import Image from "next/image";
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";

export default function Gallery({ Gallery }) {
  const [openModal, setOpenModal] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [imageHeader, setImageHeader] = useState();
  const GalleryModal = () => {
    return (
      <Modal
        basic
        closeIcon
        closeOnDimmerClick={false}
        onClose={() => setOpenModal(false)}
        onOpen={() => setOpenModal(true)}
        open={openModal}
        size="small"
      >
        <Header icon><br/>{imageHeader}</Header>
        <Modal.Content>
          <Carousel
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={true}
            dynamicHeight
            showIndicators={false}
            swipeable
            useKeyboardArrows
            renderThumbs={() =>
              imageList.map((image) => (
                <img key={`thumbs ${image}`} src={image}></img>
              ))
            }
          >
            {imageList.map((path) => {
              return (
                <div key={path}>
                  <a href={decodeURI(path)} target="_blank" type="image/*">
                    <Image src={decodeURI(path)} width={600} height={400} as='a' />
                  </a>
                </div>
              );
            })}
          </Carousel>
        </Modal.Content>
       
      </Modal>
    );
  };
  const SingleGrid = ({ gallery, onClick }) => {
    return (
      <Grid
        centered
        divided
        id={styles.grid}
        textAlign="left"
        onClick={onClick}
        onClick={() => {
          setImageList(gallery.imagesPath);
          setImageHeader(gallery.heading);
          setOpenModal(true);
        }}
      >
        <Grid.Row id={styles.gridRowImage}>
          <Image
            src={decodeURI(gallery.imagesPath[0])}
            id={styles.imageGallery}
            width={200}
            height={200}
            style={{
              'border':"2px solid green"
            }}
          />
        </Grid.Row>
        <Grid.Row id={styles.belowImage}>
          <Header sub>{gallery.heading}</Header>
        </Grid.Row>
        <Grid.Row id={styles.belowImage}>
          {" "}
          <Header as="h6">
            {" "}
            <Icon name="calendar outline" />
            <Header.Content> {gallery.date}</Header.Content>{" "}
          </Header>{" "}
        </Grid.Row>
      </Grid>
    );
  };

  return (
    <div>
      <Head>
        <title>Gallery</title>
      </Head>
      <Navbar />
      {openModal && <GalleryModal />}
      <div className={styles.mainDiv}>
        <Divider id={styles.galleryDivider} horizontal>
          <Header as="h1">Gallery Section</Header>
        </Divider>
        <Grid id={styles.mainGrid} >
          {Gallery.map((gallery) => {
            return (
              <Grid.Column
                id={styles.eachGrid}
                mobile={16}
                tablet={8}
                computer={4}
                key={gallery._id}
              >
                <SingleGrid gallery={gallery} />
              </Grid.Column>
            );
          })}
        </Grid>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const Gallery = JSON.parse(await fetchAllGallery());
  return {
    props: {
      Gallery,
    },
    revalidate: 1,
  };
}
