import { useState, useEffect } from 'react';
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { Notification } from '@/types/notification.type';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "", {
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? "",
});

export const useNotification = ({
    type
}: {
    type?: string | undefined
}) => {
    const { data: session } = useSession();
    const user = session?.user as User;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [newMessagesCount, setNewMessagesCount] = useState<number>(0);
    const [severTime, setServerTime] = useState<string>('');

    useEffect(() => {
        if (session != undefined) {
            getNotifications();
            const channel = pusher.subscribe(`user-${user._id}`);
    
            channel.bind("comment", (data: Notification) => {
                setNotifications((prevNotifications) => [data, ...prevNotifications]);
                setNewMessagesCount((count) => count + 1);
            });
    
            channel.bind("comment-read", (data: Notification) => {
                setNewMessagesCount((count) => count > 0 ? count - 1 : 0);
            });
    
            return () => {
                pusher.unsubscribe(`user-${user._id}`);
            };
        }
    }, []);

    const getNotifications = async () => {
        const response = await fetch("/api/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: user._id,
                type: type != undefined ? type : ''
            }),
        });

        if (!response.ok) {
            const { err } = await response.json();
            console.log(err);
        } else {
            const { notifications, sTime } = await response.json();
            let count = 0;
            notifications.map((notification: Notification) => {
                if (!notification.isRead) {
                    count++;
                }
            });
            setServerTime(sTime);
            setNewMessagesCount(count);
            setNotifications(notifications);
        }
    };

    return { notifications, newMessagesCount, severTime, setNotifications, setNewMessagesCount };
};
