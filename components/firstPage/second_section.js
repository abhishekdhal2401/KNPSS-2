import React from "react";
import styles from "../../styles/components/homePage/SecondSection.module.css";
import { Button, Icon } from "semantic-ui-react";
import Link from "next/link";
import Image from 'next/image';

import { Carousel } from "react-responsive-carousel";

export default function SecondSection({ Gallery }) {
  return (
    <div className={styles.secondDiv}>
      <div className={styles.bgImageSecondDiv}></div>
      <div className={styles.acheivements}>
        <p className={styles.acheivementsHeader}>Our Recent Acheivements</p>
        <div className={styles.acheivementsGallery}>
          <Carousel
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={true}
            showIndicators={true}
            swipeable
            dynamicHeight
            useKeyboardArrows
            id={styles.carousel}
          >
            {Gallery.map((gallery) => {
              return (
                <div key={gallery._id}>
                  <Image src={gallery.imagesPath[0]} width={400} height={400} />
                  <p className={styles.postRead}>
                    <span><b>{`${gallery.heading}`}</b></span><br/> <span>{`Dt: ${gallery.date}`}</span>
                    <br/>
                    <Link href={`/${gallery.type}/${gallery._id}`}>
                      <Button animated>
                        <Button.Content visible>Read More</Button.Content>
                        <Button.Content hidden>
                          <Icon name="arrow right" />
                        </Button.Content>
                      </Button>
                    </Link>
                  </p>
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
