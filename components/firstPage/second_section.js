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
            showThumbs={false}
            showIndicators={false}
            swipeable
            dynamicHeight
            useKeyboardArrows
            id={styles.carousel}
          >
            {Gallery.map((gallery) => {
              return (
                <div key={gallery._id} className={styles.carousel}>
                  <Image src={gallery.imagesPath[0]} width={600} height={400} />
                  <Link href={`/${gallery.type}/${gallery._id}`}>
                  <p className={styles.postRead}>
                    <span><b>{`${gallery.heading}`}</b></span><br/> <span> <Icon name='calendar outline' /> {`${gallery.date.split("-").reverse().join("-")}`}</span>
                    <br/>
                    
                      
                    
                  </p>
                  </Link>
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
