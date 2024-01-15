export type Lemonade = {
    _id: string,
    name: string,
    updatedAt: any,
    createdAt: any,
    description: string,
    pillar: string,
    participants: Participant[] | [],
    comments: any[],
    isCompleted: boolean,
    pitch: string
}

export type Participant = {
    email: string
    name: string
    image: string
    _id: string
    isInitiator: boolean
    commentCount: number,
    hasPitch: boolean
}