import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Peer from 'simple-peer';
import styles from './Room.module.scss'
import { Button } from '../Button'
import { Speaker } from '../Speaker'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { selectUserData } from '../../redux/selectors'
import { UserData } from '../../pages'
import { useSocket } from '../../hooks/useSocket'

interface RoomProps {
    title: string;
}

export const Room = ({ title }: RoomProps) => {
    const user = useSelector(selectUserData)
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const roomId = router.query.id;
    const socket = useSocket();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then((stream) => {
                const peerIncome = new Peer({
                    initiator: true,
                    trickle: false,
                    stream
                });

                peerIncome.on('signal', signal => {
                    socket.emit('CLIENT@ROOMS:CALL', {
                        user,
                        roomId,
                        signal
                    })
                })

                socket.on('SERVER@ROOMS:CALL', ({user: callerUser, signal}) => {
                    const peerOutcome = new Peer({
                        initiator: false,
                        trickle: false
                    });

                    peerOutcome.signal(signal);

                    peerOutcome.on('stream', (stream) => {
                        document.querySelector('audio').srcObject = stream;
                        document.querySelector('audio').play();
                    }).on('signal', (signal) => {
                        socket.emit('CLIENT@ROOMS:ANSWER', {
                            targetUserId: callerUser,
                            roomId,
                            signal
                        })
                    })
                })

                socket.on('SERVER@ROOMS:ANSWER', ({targetUserId, signal}) => {
                    if(user.id === targetUserId) {
                       peerIncome.signal(signal); 
                    }
                })
            })
            .catch(() => console.error('No access to microphone'))

            socket.emit('CLIENT@ROOMS:JOIN', {
                user,
                roomId: roomId
            })

            socket.on('SERVER@ROOMS:LEAVE', (leaveUser) => {
                setUsers(prev => prev.filter(obj => obj.id !== leaveUser.id))
            })

            socket.on('SERVER@ROOMS:JOIN', users => {
                setUsers(users)
            })
        }
    }, [])

    return (
        <div className={styles.wrapper}>
            <audio controls/>
            <div className='d-flex align-items-center justify-content-between'>
                <h2>{title}</h2>
                <div className={clsx('d-flex align-items-center', styles.actionButtons)}>
                    <Link href='/rooms'>
                        <a>
                            <Button color='gray' className={styles.leaveButton}>
                                <img src="/static/peace.png" alt="Hand black" width={18} height={18} />
                                Leave quielty
                            </Button>
                        </a>
                    </Link>
                </div>
            </div>

            <div className={styles.user}>
                {users.map((user, i) => (
                    <Speaker key={i} {...user}/>
                ))}
            </div>
        </div>
    )
}

