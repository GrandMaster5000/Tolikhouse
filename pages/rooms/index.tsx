import { Button } from '../../components/Button'
import { ConversationCard } from '../../components/ConversationsCard'
import { Header } from '../../components/Header'
import Link from 'next/link'
import  Axios  from '../../core/axios'

const Rooms = ({ rooms = []}) => {
   

    return (
        <>
            <Header />
            <div className='container'>
                <div className='mt-40 d-flex align-items-center justify-content-between'>
                    <h1>All conversations</h1>
                    <Button color='green'>+ Start room</Button>
                </div>
                <div className='grid mt-30'>
                    {
                        rooms.map(obj => (
                            <Link key={obj._id} href={`/rooms/${obj._id}`}>
                                <a className='d-flex'>
                                    <ConversationCard
                                        title={obj.title}
                                        avatars={obj.avatars}
                                        guests={obj.guests}
                                        guestsCount={obj.guestsCount}
                                        speakersCount={obj.speakersCount}
                                    />
                                </a>
                            </Link>
                        ))
                    }
                </div>
            </div>

        </>
    )
}

export default Rooms;

export const getServerSideProps = async (ctx) => {
    try {
        const {data} = await Axios.get('/rooms.json')
        return {
            props: {
                rooms: data
            }
        }
    } catch(e) {
        console.log('ERORR');
        return {
            props: {
                rooms: []
            }
        }
    }
}