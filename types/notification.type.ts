export type Notification = {
    _id: string;
    message: string;
    from: string;
    to: string;
    link: string;
    isRead: boolean;
    isFlag: boolean;
    type?: string;
    ventureTitle: string | undefined,
    ventureId: string | undefined,
    moduleId: string | undefined,
    videoId: string | undefined,
    videoTitle: string | undefined,
    collaborationId: string | undefined,
    tabId: string | undefined,
    createdAt: string;
}