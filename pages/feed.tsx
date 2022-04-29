import type { NextPage } from "next";
import Head from "next/head";
import FeedCard from "../components/feedCard";
import useSWR from "swr";
import { Kudo } from "@slashkudos/kudos-api";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import HeaderSection from "../components/headerSection";
import UserSearchButton from "../components/userSearchButton";
import { SearchKudosByUserResponse } from "./api/kudos/search";
import { useRouter } from "next/router";
import { Utilities } from "../services/utilities";
import { KudosBrowserService } from "../services/kudosBrowserService";
import Scrollable from "../components/scrollable";

interface Props extends PropsWithChildren<{}> {}
interface QueryParams {
  search?: string;
}

const getKudosNextPage = () => {
  console.log("getKudosNextPage");
};

const Feed: NextPage<Props> = () => {
  const router = useRouter();

  const queryParams = router.query as QueryParams;
  const searchQuery = queryParams.search || "";

  const [kudosState, setKudos] = useState(undefined as Kudo[] | undefined);
  const [searchDisplayMessageState, setSearchDisplayMessage] = useState(
    undefined as string | undefined
  );

  const firstUpdate = useRef(!searchQuery);

  const [searchQueryState, setSearchQuery] = useState(searchQuery);

  useEffect(() => {
    if (!searchQuery) return;
    firstUpdate.current = true;
    setSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (kudosState?.length === 0) {
      setSearchDisplayMessage("No kudos found.");
    }
  }, [kudosState]);

  let url = Utilities.API.kudosUrlRelative;
  let fetcher = (url: string): Promise<Kudo[]> => {
    if (firstUpdate.current) {
      console.log("Loading most recent kudos...");
      firstUpdate.current = false;
      return KudosBrowserService.getKudosFetcher(url, setKudos);
    } else {
      return Promise.resolve([]);
    }
  };

  if (searchQueryState) {
    const searchParams = new URLSearchParams({
      username: searchQueryState,
    });
    url = Utilities.API.kudosSearchUrlRelative + "?" + searchParams.toString();
    fetcher = (url: string): Promise<Kudo[]> => {
      if (firstUpdate.current) {
        console.log(`Searching for kudos (query="${searchQueryState}")...`);
        firstUpdate.current = false;
        return KudosBrowserService.searchKudosFetcher(url, setKudos);
      } else {
        return Promise.resolve([]);
      }
    };
  }

  const getKudosResponse = useSWR<Kudo[], any>(url, fetcher);

  if (getKudosResponse.error) return <div>Failed to load</div>;
  if (!kudosState) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>slashkudos</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeaderSection title="Recent kudos" />
      <UserSearchButton
        searchQuery={searchQueryState}
        dispatchers={{
          setSearchQueryDispatcher: setSearchQuery,
          setSearchDisplayMessageDispatcher: setSearchDisplayMessage,
          setResultDispatcher: setKudos,
        }}
      ></UserSearchButton>
      <Scrollable onScrollBottom={getKudosNextPage}>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {kudosState.map((kudo, i) => (
            <FeedCard key={i} kudo={kudo}></FeedCard>
          ))}
          {searchDisplayMessageState}
        </div>
      </Scrollable>
    </>
  );
};

export default Feed;
