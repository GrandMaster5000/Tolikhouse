import { useSelector } from 'react-redux';
import { Header } from '../../components/Header';
import { Profile } from '../../components/Profile';
import { selectUserData } from '../../redux/selectors';
import { wrapper } from '../../redux/store';
import { checkAuth } from '../../utils/checkAuth';


export default function ProfilePage() {
    const userData = useSelector(selectUserData)
    return (
        <>
            <Header/>
            <div className='container mt-40'>
            <Profile 
            fullname={userData?.fullname}
            username={userData?.username}
            avatarUrl={userData?.avatarUrl}
            about={'I pidoras, poshli nahui'}
            />
            </div>
        </>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    try {
        const user = await checkAuth(ctx, store);

        if (!user) {
            return {
                props: { },
                redirect: {
                    permanent: false,
                    destination: '/',
                },
            };
        }

        return {
            props: {}
        }
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