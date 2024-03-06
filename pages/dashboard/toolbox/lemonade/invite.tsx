import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Swal from 'sweetalert2';


const Invite = ({
    isAllowed, err, from, image, isFull, lemonadeId
}: {
    isAllowed: boolean, err: string, from: string, image: string, isFull: boolean, lemonadeId: string
}) => {
    const router = useRouter();
    useEffect(() => {
        if (isAllowed) {
            if (!isFull) {
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome!',
                    text: `${from} has invited you to Coffee Chat.`,
                    imageUrl: image,
                    imageAlt: 'Custom image'
                })
                    .then(() => { 
                        router.push(`/dashboard/toolbox/lemonade/${lemonadeId}`) 
                    })
                    .catch(err => console.log(err));
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Welcome!',
                    text: `This Coffee Chat is full. You may initiate a Coffee Chat to start a new one`,
                    imageUrl: image,
                    imageAlt: 'Custom image'
                })
                    .then(() => { 
                        router.push(`/dashboard/toolbox/lemonade/add`) 
                    })
                    .catch(err => console.log(err));
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err,
            })
                .then(() => router.push("/"))
                .catch(err => console.log(err));
        }
    }, [isAllowed])
}

export const getServerSideProps = async (context: any) => {
    const { id } = context.query;
    const response = await fetch(`${process.env.HOME_URL}/api/checklemonadeinvite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            linkId: id
        }),
    });

    if (!response.ok) {
        const { err } = await response.json()
        return { props: { isAllowed: false, err: err } };
    }
    const { isFull, from, image, lemonadeId } = await response.json();
    return { props: { isAllowed: true, from, image, isFull, lemonadeId } };
}

export default Invite;