import type { NextPage } from "next";
import Head from "next/head";
import FeedCard from "../components/feedCard";

const Feed: NextPage = () => {
  return (
    <>
      <Head>
        <title>/Kudos</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <FeedCard></FeedCard>
      </div>
    </>
  );
};

export default Feed;