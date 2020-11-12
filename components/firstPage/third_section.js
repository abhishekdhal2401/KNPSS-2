import styles from "../../styles/components/homePage/ThirdSection.module.css";
import { Segment, Header, List, Divider } from "semantic-ui-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ThirdSection({ props }) {
  useEffect(() => {
    const Script = document.createElement("script");
    const anchor = document.getElementById(`${styles.tweetTimeline}`);
    Script.setAttribute("src", "https://platform.twitter.com/widgets.js");
    Script.setAttribute("charSet", "utf-8");
    Script.setAttribute("defer", true);
    anchor.appendChild(Script);
  }, []);
  return (
    <div>
      <div className={styles.thirdDiv}>
        <div className={styles.background}></div>
        <div className={styles.news}>
          <Segment id={styles.segment}>
            <Header as="h3" color="green" id={styles.inTheNewsHeader}>
              In the News
            </Header>
            <Divider clearing />
            <List id={styles.newsList}>
              {props.map((data) => {
                return (
                  <List.Item key={data._id}>
                    <List.Content>
                      <Link href={`/news/${data._id}`}>
                        <a>
                          {data.heading} Dt:- {data.date}
                        </a>
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
              Twitter Updates
            </Header>
            <Divider />
            <List id={styles.tweetList}>
              <a
                className="twitter-timeline"
                href="https://twitter.com/dhal_aswini?ref_src=twsrc%5Etfw"
                data-limit="5"
                id={styles.tweetTimeline}
                data-chrome="nofooter noborders scrollbar noheader"
              >
                Tweets by dhal_aswini
              </a>{" "}
            </List>
          </Segment>
        </div>
      </div>
    </div>
  );
}
