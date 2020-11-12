import { Divider, Header, Grid } from "semantic-ui-react";
import { fetchAllGallery } from "../lib/fetchForGallery";
import Navbar from "../components/navbar";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Gallery.module.css";
import Image from "next/image";

export default function Gallery({ Gallery }) {
  const SingleGrid = React.forwardRef(({ onClick, href, gallery }, ref) => {
    return (
      <Grid
        centered
        id={styles.grid}
        textAlign="left"
        href={href}
        onClick={onClick}
      >
        <Grid.Row id={styles.belowImage}>
          <Header sub>{gallery.heading}</Header>
        </Grid.Row>
        <Grid.Row>
          <Image
            src={decodeURI(gallery.imagesPath[0])}
            style={{
              backgroundImage:"https://react.semantic-ui.com/images/wireframe/image.png"
            }}
            width={200}
            height={200}
          />
        </Grid.Row>
        <Grid.Row id={styles.belowImage}>{gallery.date}</Grid.Row>
      </Grid>
    );
  });
  return (
    <div>
      <Head>
        <title>Gallery</title>
      </Head>
      <Navbar />
      <div className={styles.mainDiv}>
        <Divider id={styles.galleryDivider} horizontal>
          <Header as="h1">Gallery Section</Header>
        </Divider>
        <Grid divided>
          {Gallery.map((gallery) => {
            return (
              <Grid.Column
                id={styles.eachGrid}
                mobile={16}
                tablet={8}
                computer={4}
                key={gallery._id}
              >
                <Link href={`https://www.facebook.com`} passHref>
                  <SingleGrid gallery={gallery} />
                </Link>
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
