import { User } from '@/types/user.type';

export type NinetyVideo = {
    title: string | '',
    author: User,
    description: string | '',
    video: {
        url: string,
        assetId: string,
        name: string,
        publicId: string
    },
    createdAt: any,
    expireAt: any,
    updatedAt: any,
    comments: VideoComment[] | [],
    status: string,
    type: number,
    _id: string
};
  
export type VideoComment = {
    problem: string | '',
    helpee: string | '',
    reason: string | '',
    solution: string | '',
    user?: User,
    createdAt?: any,
    status?: string,
    emotion?: number
};

export type EmotionFeedback = {
    emotion: number,
    user?: User,
    createdAt?: any,
};