import React from "react";
import styles from "../../styles/components/homePage/SecondSection.module.css";
import { Button, Icon } from "semantic-ui-react";
import Link from "next/link";
import Image from 'next/image';

import { Carousel } from "react-responsive-carousel";

export default function SecondSection({ Achievements }) {
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
            {Achievements.map((achievement) => {
              return (
                <div key={achievement._id} className={styles.carousel}>
                  <Image src={achievement.imagesPath[0]} width={600} height={400} />
                  <Link href={`/achievement/${achievement._id}`}>
                  <p className={styles.postRead}>
                    <span><b>{`${achievement.heading}`}</b></span><br/> <span> <Icon name='calendar outline' /> {`${achievement.date.split("-").reverse().join("-")}`}</span>
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
