import clsx from 'clsx'
import { Button } from '../Button'
import Link from 'next/link'
import styles from './Room.module.scss'

interface RoomProps {
    title: string;
}

export const Room = ({ title }: RoomProps) => {
    return (
        <div className={styles.wrapper}>
            <div className='d-flex align-items-center justify-content-between'>
                <h2>{title}</h2>
                <div className={clsx('d-flex align-items-center', styles.actionButtons)}>
                    <Link href='/rooms'>
                        <Button color='gray' className={styles.leaveButton}>
                            <img src="/static/peace.png" alt="Hand black" width={18} height={18} />
                            Leave quielty
                        </Button>
                    </Link>
                </div>
            </div>

            <div className='users'>

            </div>
        </div>
    )
}

