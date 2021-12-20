import clsx from 'clsx'
import { Button } from '../Button'
import Link from 'next/link'
import styles from './Room.module.scss'
import { useEffect, useRef, useState } from 'react'
import { Speaker } from '../Speaker'
import { useRouter } from 'next/router'
import io, { Socket } from 'socket.io-client'
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
    const socket = useSocket();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            socket.emit('CLIENT@ROOMS:JOIN', {
                user,
                roomId: router.query.id
            })

            socket.on('SERVER@ROOMS:LEAVE', (leaveUser) => {
                setUsers(prev => prev.filter(obj => obj.id !== leaveUser.id))
            })

            socket.on('SERVER@ROOMS:JOIN', users => {
                setUsers(users)
            })

            // setUsers(prev => [...prev, user])
        }

        return () => {
            socket.disconnect();
        }
    }, [])

    return (
        <div className={styles.wrapper}>
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

