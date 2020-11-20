import React from "react";
import styles from "../styles/Blog.module.css";
import { Icon, Image, Divider, Header } from "semantic-ui-react";
import { Carousel } from "react-responsive-carousel";
import Navbar from "../components/navbar";
const Blog = ({ post }) => {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.subcontainer}>
          <div className={styles.logo}>
            <Icon name="blind" size="huge" />
            <span>KNPSS</span>
          </div>
          <Header dividing>{post.heading}</Header>
          <div className={styles.heading}>
            {/* <h1>{post.heading}</h1> */}
            <p>{post.date.split("-").reverse().join("-")}</p>
          </div>
          <Divider />
          <div className={styles.images}>
          <Carousel
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={false}
            dynamicHeight
            showIndicators={true}
            swipeable
            useKeyboardArrows
            // renderThumbs={() =>
            //   imageList.map((image) => (
            //     <img key={`thumbs ${image}`} src={image}></img>
            //   ))
            // }
          >
            {post.imagesPath.map((path) => {
              return (
                <div key={path}>
                  <a href={path} target="_blank" type="image/*">
                    <Image src={decodeURI(path)} width={600} height={400} />
                  </a>
                </div>
              );
            })}
          </Carousel>
          </div>
          <Divider />
          <div className={styles.document}>
            {post.pdfsPath.length > 0 && <h4>Documents</h4>}
            <ul className={styles.pdfs}>
              {post.pdfsPath.length === 0 ? (
                <h4>No Documents Available</h4>
              ) : (
                post.pdfsPath.map((path) => {
                  return (
                    <li className={styles.pdf} key={path}>
                      {" "}
                      <a target="_blank" href={path}>
                        {decodeURI(path.slice(path.search("_") + 1))}
                      </a>{" "}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
          <Divider />
          <div className={styles.content}>
            <p className={styles.paragraph}>{post.content}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
