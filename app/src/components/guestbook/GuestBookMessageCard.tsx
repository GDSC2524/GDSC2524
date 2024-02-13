import { IGuestBookMessage } from '@/models';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import ButtonLink from '../ButtonLink';

export type GuestBookMessageCardProps = {
    message: IGuestBookMessage;
};

/** Guest book message card */
export default function GuestBookMessageCard({ message }: GuestBookMessageCardProps) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>Message from {message.author}</Card.Title>
                <Card.Text>{message.message}</Card.Text>
            </Card.Body>
            <Card.Footer>
                <Stack direction="horizontal" gap={3} className="">
                    <p className="font-monospace me-auto my-auto">ID: {message.messageId}</p>
                    <div className="vr"></div>
                    <ButtonLink variant="secondary" href={`/guestbook/${message.messageId}/edit`}>
                        Edit
                    </ButtonLink>
                    <ButtonLink variant="primary" href={`/guestbook/${message.messageId}`}>
                        View
                    </ButtonLink>
                </Stack>
            </Card.Footer>
        </Card>
    );
}
