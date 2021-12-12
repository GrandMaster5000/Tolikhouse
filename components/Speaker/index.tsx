import { Avatar } from '../Avatar'

export interface SpeakerProps {
    fullname: string;
    avatarUrl: string;
}

export const Speaker = ({ fullname, avatarUrl }: SpeakerProps) => {
    return (
        <div className="d-i-flex flex-column align-items-center mr-40 mb-40">
            <Avatar 
                src={avatarUrl} 
                height="100px" 
                width="100px"
            />
            <div>
                <b>{fullname}</b>
            </div>
        </div>
    )
}