import styles from "../../styles/components/homePage/ThirdSection.module.css";
import { Segment, Header, List, Divider } from "semantic-ui-react";
import Link from 'next/link'

export default function ThirdSection({ props }) {
  return (
    <div>
      <div className={styles.thirdDiv}>
        <div className={styles.background}></div>
        <div className={styles.news}>
          <Segment id={styles.segment}>
            <Header as="h3" color="green" id={styles.inTheNewsHeader}>
              In the news
            </Header>
            <Divider clearing />
            <List id={styles.newsList}>
              {props.map((data) => {
                return (
                  <List.Item key={data._id}>
                    <List.Content>
                        <Link href={`/news/${data._id}`} >
                        <a>{data.heading} Dt:- {data.date}</a>
                        </Link>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </Segment>
        </div>
        <div className={styles.video}>
          <iframe
            className={styles.videoFrame}
            src="https://www.youtube.com/embed/47HN6xOwphA"
            frameBorder="0"
            allow="autoplay;"
            allowFullScreen
          ></iframe>
        </div>
        <div className={styles.twitter}>
          <Segment id={styles.segment}>
            <Header as="h3" color="blue" id={styles.inTheNewsHeader}>
              Twitter updates
            </Header>
            <Divider />
            <List id={styles.tweetList}>
              {props.map((data) => {
                return (
                  <List.Item key={data._id}>
                    <List.Content>
                      {data.heading} Dt:- {data.date}
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </Segment>
        </div>
      </div>
    </div>
  );
}
