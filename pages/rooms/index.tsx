import { Button } from "../../components/Button";
import { ConversationCard } from "../../components/ConversationsCard";
import { Header } from "../../components/Header";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { checkAuth } from "../../utils/checkAuth";
import { StartRoomModal } from '../../components/StartRoomModal';
import { Api } from '../../api';
import { selectRooms } from '../../redux/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { wrapper } from '../../redux/store';
import { setRooms } from '../../redux/slices/roomSlice';
import { setUserData } from '../../redux/slices/userSlice';
import { useSocket } from '../../hooks/useSocket';

const RoomsPage = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const rooms = useSelector(selectRooms);
  const dispatch = useDispatch()
  const socket = useSocket();

  useEffect(() => {
    socket.on('SERVER@ROOMS:HOME', ({ speakers, roomId }) => {

    })
  }, [])

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
          <Button onClick={() => setVisibleModal(true)} color="green">+ Start room</Button>
        </div>
        {visibleModal && <StartRoomModal onClose={() => setVisibleModal(false)}/>}
        <div className="grid mt-30">
          {rooms.map((obj) => (
            <Link key={obj.id} href={`/rooms/${obj.id}`}>
              <a className="d-flex">
                <ConversationCard
                  title={obj.title}
                  speakers={obj.speakers || []}
                  listenersCount={obj.listenersCount}
                />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};


export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  try {
    const user = await checkAuth(ctx, store);

    if (!user) {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    const rooms = await Api(ctx).getRooms();

    store.dispatch(setRooms(rooms));
    store.dispatch(setUserData(user));

    return { props: {} }
  } catch (e) {
    console.log('Error');
    return { props: {} }
  }
});
export default RoomsPage;
