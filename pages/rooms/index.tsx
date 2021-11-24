import { Button } from "../../components/Button";
import { ConversationCard } from "../../components/ConversationsCard";
import { Header } from "../../components/Header";
import Link from "next/link";
import Axios from "../../core/axios";
import React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { checkAuth } from "../../utils/checkAuth";

const Rooms = ({ rooms = [] }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Clubhouse: Drop-in audio chat</title>
      </Head>
      <Header />
      <div className="container">
        <div className="mt-40 d-flex align-items-center justify-content-between">
          <h1>All conversations</h1>
          <Button color="green">+ Start room</Button>
        </div>
        <div className="grid mt-30">
          {rooms.map((obj) => (
            <Link key={obj._id} href={`/rooms/${obj._id}`}>
              <a className="d-flex">
                <ConversationCard
                  title={obj.title}
                  avatars={obj.avatars}
                  guests={obj.guests}
                  guestsCount={obj.guestsCount}
                  speakersCount={obj.speakersCount}
                />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Rooms;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const user = await checkAuth(ctx);

    if (!user) {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }

    return {
      props: {
        user,
        rooms: [],
      },
    };
  } catch (e) {
    return {
      props: {
        rooms: [],
      },
    };
  }
};
