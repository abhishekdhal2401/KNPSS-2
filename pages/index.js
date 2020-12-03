import Head from "next/head";
import LandingSection from "../components/firstPage/landing_section";
import SecondSection from "../components/firstPage/second_section";
import ThirdSection from "../components/firstPage/third_section";
import styles from "../styles/Home.module.css";
import { fetchFirstFive } from "../lib/fetchForNews";
import { fetchFirstFiveAchievement } from "../lib/fetchForAchievement";

export default function Home({ Achievements, data }) {
  return (
    <div className={styles.homeMain} >
      <Head>
        <title>KNPSS</title>
      </Head>
      <LandingSection />
      <SecondSection Achievements={Achievements} />
      <ThirdSection props={data} />
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetchFirstFive();
  const data = JSON.parse(res);
  const Achievements = JSON.parse(await fetchFirstFiveAchievement());
  return {
    props: {
      Achievements,
      data,
    },
    revalidate: 1,
  };
}
