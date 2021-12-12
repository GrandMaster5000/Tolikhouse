import { BackButton } from '../../components/BackButton';
import { Header } from '../../components/Header';
import { Room } from '../../components/Room';
import { Api } from '../../api';
import { wrapper } from '../../redux/store';
import { checkAuth } from '../../utils/checkAuth';



export default function RoomPage({ room, user }) {
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

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    try {
        const user = await checkAuth(ctx, store);

        if(!user) {
            return {
                props: { room: {}, user: {} },
                redirect: {
                    permanent: false,
                    destination: '/',
                },
            };
        }
        

        const roomId = ctx.query.id;
        const room = await Api(ctx).getRoom(roomId as string);
        
        return { props: {
            room,
            user
        } }
    } catch (e) {
        console.log('ERROR');
        return {
            props: {},
            redirect: {
                destination: '/rooms',
                permanent: false
            }
        }
    }
})