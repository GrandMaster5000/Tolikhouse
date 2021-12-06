import Axios from '../../core/axios';
import { BackButton } from '../../components/BackButton';
import { Header } from '../../components/Header';
import { Room } from '../../components/Room';
import { Api } from '../../api';

export default function RoomPage({ room }) {
    return (
        <>
            <Header/>
            <div className='container mt-40'>
                <BackButton
                    title='All rooms'
                    href='/rooms'
                />
            </div>
            <Room title={room.title}/>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    try {
        const roomId = ctx.query.id;
        const room = await Api(ctx).getRoom(roomId);
        
        return {
            props: {
                room
            }
        }
    } catch(e) {
        console.log('ERROR');
        return {
            props:{},
            redirect: {
                destination: '/rooms',
                permanent: false
            }
        }
    }
}