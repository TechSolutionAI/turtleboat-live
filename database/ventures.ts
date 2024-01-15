import { Venture } from '@/types/venture.type';
interface DummyModule {
    title: string,
    content: string,
    item: string,
}

interface DummyCourse {
    title: string,
    modules: {
        module: DummyModule,
        access: boolean,
    }[],
    ventures: number,
    description: string,
}


interface DummyVenture {
    title: string,
    update: string,
    course: DummyCourse,
    description: string,
}

export const ventures: DummyVenture[] = [
    {
        title: 'Ventus',
        update: '5/14/23',
        course: {
            title: 'asfsdfsdf',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfgstrinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription',
    },
    {
        title: 'sdadsf',
        update: '5/14/23',
        course: {
            title: 'uiyiyit',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'saaae',
        update: '5/14/23',
        course: {
            title: 'cxbvxbb',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'Ventus',
        update: '5/14/23',
        course: {
            title: 'asfsdfsdf',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'sdadsf',
        update: '5/14/23',
        course: {
            title: 'uiyiyit',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'saaae',
        update: '5/14/23',
        course: {
            title: 'cxbvxbb',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'Ventus',
        update: '5/14/23',
        course: {
            title: 'asfsdfsdf',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'sdadsf',
        update: '5/14/23',
        course: {
            title: 'uiyiyit',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'saaae',
        update: '5/14/23',
        course: {
            title: 'cxbvxbb',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'Ventus',
        update: '5/14/23',
        course: {
            title: 'asfsdfsdf',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'sdadsf',
        update: '5/14/23',
        course: {
            title: 'uiyiyit',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'saaae',
        update: '5/14/23',
        course: {
            title: 'cxbvxbb',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'Ventus',
        update: '5/14/23',
        course: {
            title: 'asfsdfsdf',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'sdadsf',
        update: '5/14/23',
        course: {
            title: 'uiyiyit',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'saaae',
        update: '5/14/23',
        course: {
            title: 'cxbvxbb',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'Ventus',
        update: '5/14/23',
        course: {
            title: 'asfsdfsdf',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'sdadsf',
        update: '5/14/23',
        course: {
            title: 'uiyiyit',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'saaae',
        update: '5/14/23',
        course: {
            title: 'cxbvxbb',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'Ventus',
        update: '5/14/23',
        course: {
            title: 'asfsdfsdf',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'sdadsf',
        update: '5/14/23',
        course: {
            title: 'uiyiyit',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
    {
        title: 'saaae',
        update: '5/14/23',
        course: {
            title: 'cxbvxbb',
            modules: [
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: false,
                },
                {
                    module: {
                        title: 'Circle of Resources',
                        content: 'asdsdafsdf',
                        item: 'Character',
                    },
                    access: true,
                }
    
    
            ],
            description: 'strinsdfsadfsafdfg',
            ventures: 12,
        },
        description: 'description',
    },
]

export const DUMMY_VENTURE: Venture = {
    _id: "6483571833d1838f8c4af311",
    title: "Friday Venture #1",
    course: {
        _id: "647f3cc619f0f99312a0086b",
        title: "Test Course for Milestone 5",
        modules: [
            {
                module: {
                    _id: "646a5c31dcc5f4e4e8b60e36",
                    title: "Wonder Square 1, Solution Pillar",
                    content: "<p><strong>Solution Pillar, Wonder Square 1</strong></p><p>&nbsp;</p><p>&nbsp;</p>",
                    item: "Solution",
                    files: [
                        {
                            url: "https://res.cloudinary.com/ddonojtwz/raw/upload/v1685029322/modules/ycity_files/leveraging%20CoR%20to%20get%20higher%20valuation%20wo%20dilution_infographic.png",
                            assetId: "6bd4840bf086ff35803b876388d55ead",
                            name: "leveraging CoR to get higher valuation wo dilution_infographic.png",
                            publicId: "modules/ycity_files/leveraging CoR to get higher valuation wo dilution_infographic.png"
                        }
                    ]
                },
                isLock: false,
                isCheck: true,
                isCheckedOff: false
            },
            {
                module: {
                    _id: "646a5c5bdcc5f4e4e8b60e37",
                    title: "Connection to the Character(s)",
                    content: "<p>This module should be affiliated with Character Pillar, Wonder Square 1</p>",
                    item: "Character",
                    files: [
                        {
                            url: "https://res.cloudinary.com/ddonojtwz/raw/upload/v1684337725/modules/ycity_files/happy_birthday.jpg",
                            assetId: "af2d3781fb6bc27af01d64ba2c9676ff",
                            name: "happy_birthday.jpg",
                            publicId: "modules/ycity_files/happy_birthday.jpg"
                        }
                    ]
                },
                isLock: false,
                isCheck: true
            },
            {
                module: {
                    _id: "646a5c78dcc5f4e4e8b60e38",
                    title: "INSPIRATION STARTING POINT",
                    content: "<p>This is the where we introduce 4 Pillars, Mindmap, Circle of Resources</p>",
                    item: "Starting Point",
                    files: [
                        {
                            url: "https://res.cloudinary.com/ddonojtwz/raw/upload/v1684337806/modules/ycity_files/birthday.jpg",
                            assetId: "c88d8dd9c8f15295c914c5b125840673",
                            name: "birthday.jpg",
                            publicId: "modules/ycity_files/birthday.jpg"
                        }
                    ]
                },
                isLock: false,
                isCheck: true
            },
            {
                module: {
                    _id: "646a5c87dcc5f4e4e8b60e39",
                    title: "What Does Status Quo Look Like",
                    content: "<p>Character Pillar, Wonder Square 2</p>",
                    item: "Character",
                    files: []
                },
                isLock: false,
                isCheck: true,
                isCheckedOff: true
            },
            {
                module: {
                    _id: "646a5ca4dcc5f4e4e8b60e3a",
                    title: "Does Someone Have a Headache",
                    content: "<p>This should be Wonder Square 1 in the Problem Pillar</p>",
                    item: "Problem",
                    files: []
                },
                isLock: false,
                isCheck: true,
                isCheckedOff: true
            },
            {
                module: {
                    _id: "646a5cbcdcc5f4e4e8b60e3b",
                    title: "Reassessing the Aspirin",
                    content: "<p>This should be associated with Wonder Square 3 with the Problem Pillar</p>",
                    item: "Problem",
                    files: []
                },
                isLock: false,
                isCheck: true,
                isCheckedOff: true
            },
            {
                module: {
                    _id: "646a5cd7dcc5f4e4e8b60e3c",
                    title: "Can You Explain the Diagnosis to an 8 Year Old",
                    content: "<p>Problem Pillar, Wonder Square 4</p>",
                    item: "Problem",
                    files: [
                        {
                            url: "https://res.cloudinary.com/ddonojtwz/raw/upload/v1684699659/modules/ycity_files/Screenshot_16.jpg",
                            assetId: "6917f65b7391092fd04ae8b334d9c9bd",
                            name: "Screenshot_16.jpg",
                            publicId: "modules/ycity_files/Screenshot_16.jpg"
                        }
                    ]
                },
                isLock: false,
                isCheck: true,
                comments: [
                    {
                        files: [],
                        content: "<p>So mentors, what do you think of this elevator pitch of mine? a;j sfk;asjdlfuewaofoiawejfkjsdlasjfjsald;jf</p><p>&nbsp;</p>",
                        user: {
                            email: "yCITIES1@gmail.com",
                            name: "Vicky Wu Davis",
                            image: "https://media.licdn.com/dms/image/C4E03AQHFDI7kqpWhJg/profile-displayphoto-shrink_100_100/0/1516170597448?e=1690416000&v=beta&t=--2C_zM2iPANviTy1dJ0kOgB-ukqMyIqwp1LTaigdLg"
                        },
                        createdAt: "2023-06-09T17:43:11.683Z",
                        type: 0
                    },
                    {
                        files: [
                            {
                                url: "https://res.cloudinary.com/ddonojtwz/raw/upload/v1686332721/comments/ycity_files/Pillar%20house%20plain_infographics.png",
                                assetId: "20b4c1c045813d961c9bdbc680320e78",
                                name: "Pillar house plain_infographics.png",
                                publicId: "comments/ycity_files/Pillar house plain_infographics.png"
                            }
                        ],
                        content: "<p>i just uploaded an image. &nbsp;If I don't say anything in the chat, will the file upload cause the mentors in the group to receive a notification in their Notification Log Tab. &nbsp;Andrew, do you see just this post or do you see the notification of the file upload?</p>",
                        user: {
                            email: "yCITIES1@gmail.com",
                            name: "Vicky Wu Davis",
                            image: "https://media.licdn.com/dms/image/C4E03AQHFDI7kqpWhJg/profile-displayphoto-shrink_100_100/0/1516170597448?e=1690416000&v=beta&t=--2C_zM2iPANviTy1dJ0kOgB-ukqMyIqwp1LTaigdLg"
                        },
                        createdAt: "2023-06-09T17:45:21.723Z",
                        type: 0
                    },
                    {
                        files: [],
                        content: "<p>oh really nice, I like how the file shows up in the chat history!!! &nbsp;Love this!</p>",
                        user: {
                            email: "yCITIES1@gmail.com",
                            name: "Vicky Wu Davis",
                            image: "https://media.licdn.com/dms/image/C4E03AQHFDI7kqpWhJg/profile-displayphoto-shrink_100_100/0/1516170597448?e=1690416000&v=beta&t=--2C_zM2iPANviTy1dJ0kOgB-ukqMyIqwp1LTaigdLg"
                        },
                        createdAt: "2023-06-09T17:46:01.587Z",
                        type: 0
                    },
                    {
                        files: [],
                        content: "<p>For now, when mentee only upload files without comment, same style of notfication will be sent to mentors.<br>If you want to send different type of notification, I will make it.<br>But please let me know correct message format in following cases:<br><br>- only file upload<br>- only comment<br>- both of comment and files<br><br>Here, in case of second and third, the same message will be sent?<br>Please let me know your thoughts.<br>&nbsp;</p>",
                        user: {
                            email: "lovetallman426@gmail.com",
                            name: "TM",
                            image: "https://lh3.googleusercontent.com/a/AAcHTtdhH7vM8gGdaajtt2mFM2V8jBFEu8mMeoK-8Ahg=s96-c"
                        },
                        createdAt: "2023-06-09T21:41:23.608Z",
                        type: 0
                    }
                ],
                isCheckedOff: true
            },
            {
                module: {
                    _id: "646a5ce4dcc5f4e4e8b60e3d",
                    title: "Diagnosing the Headache",
                    content: "<ul><li>This should be associated with Wonder Square 2 in Problem Pillar</li></ul>",
                    item: "Problem",
                    files: []
                },
                isLock: false,
                isCheck: true,
                isCheckedOff: true
            },
            {
                module: {
                    _id: "646a5cf3dcc5f4e4e8b60e3e",
                    title: "Is the Parachute on Their Back When They Jump",
                    content: "<p>Setting Pillar, Wonder Square 2</p>",
                    item: "Setting",
                    files: []
                },
                isLock: true,
                isCheck: false
            },
            {
                module: {
                    _id: "646a5d18dcc5f4e4e8b60e3f",
                    title: "If the Pain is Real, People Will Pay For It",
                    content: "<p>Character Pillar, Wonder Square 4</p>",
                    item: "Character",
                    files: [
                        {
                            url: "https://res.cloudinary.com/ddonojtwz/raw/upload/v1684337725/modules/ycity_files/happy_birthday.jpg",
                            assetId: "af2d3781fb6bc27af01d64ba2c9676ff",
                            name: "happy_birthday.jpg",
                            publicId: "modules/ycity_files/happy_birthday.jpg"
                        }
                    ]
                },
                isLock: false,
                isCheck: true,
                isCheckedOff: true
            },
            {
                module: {
                    _id: "646d1130fb5ad8641bcebabd",
                    title: "Wonder Square 2, Solution Pillar",
                    content: "<ul><li>&nbsp;work)</li></ul><figure class=\"table\"><table><tbody><tr><td>what does the table look like?</td><td>let's see how this works</td></tr><tr><td>what would we put here</td><td><strong>ok sounds good.</strong></td></tr></tbody></table></figure>",
                    item: "Solution",
                    files: [
                        {
                            url: "https://res.cloudinary.com/ddonojtwz/raw/upload/v1684869423/modules/ycity_files/yc1.png",
                            assetId: "abb0e02d3b321c2a8b34b047f7cbd428",
                            name: "yc1.png",
                            publicId: "modules/ycity_files/yc1.png"
                        }
                    ]
                },
                isLock: false,
                isCheck: true,
                isCheckedOff: false,
                comments: [
                    {
                        files: [],
                        content: "<p>I'm really frustrated by the lack of bike paths around the city.</p>",
                        user: {
                            email: "yCITIES1@gmail.com",
                            name: "Vicky Wu Davis",
                            image: "https://media.licdn.com/dms/image/C4E03AQHFDI7kqpWhJg/profile-displayphoto-shrink_100_100/0/1516170597448?e=1690416000&v=beta&t=--2C_zM2iPANviTy1dJ0kOgB-ukqMyIqwp1LTaigdLg"
                        },
                        createdAt: "2023-07-27T13:27:07.915Z",
                        type: 0
                    },
                    {
                        files: [],
                        content: "<p>f;adjs fjaiousfoae rsjkljfs;ajf sfsadklf</p>",
                        user: {
                            email: "yCITIES1@gmail.com",
                            name: "Vicky Wu Davis",
                            image: "https://media.licdn.com/dms/image/C4E03AQHFDI7kqpWhJg/profile-displayphoto-shrink_100_100/0/1516170597448?e=1690416000&v=beta&t=--2C_zM2iPANviTy1dJ0kOgB-ukqMyIqwp1LTaigdLg"
                        },
                        createdAt: "2023-07-27T13:27:22.413Z",
                        type: 0
                    }
                ]
            },
            {
                module: {
                    _id: "6470fe9d1181494e826a2737",
                    title: "Understanding the Pain Experiencer ",
                    content: "<p>Character Pillar, Wonder Square 3</p>",
                    item: "Character",
                    files: [
                        {
                            url: "https://res.cloudinary.com/ddonojtwz/raw/upload/v1684337725/modules/ycity_files/happy_birthday.jpg",
                            assetId: "af2d3781fb6bc27af01d64ba2c9676ff",
                            name: "happy_birthday.jpg",
                            publicId: "modules/ycity_files/happy_birthday.jpg"
                        }
                    ]
                },
                isLock: false,
                isCheck: true,
                isCheckedOff: true
            },
            {
                module: {
                    _id: "647607b14afa7f528b8bd963",
                    title: "Does Your Product Play Nicely",
                    content: "<p><strong>Setting Pillar, Wonder Square 3</strong></p><p>&nbsp;</p><p><strong>Who</strong> an entrepreneur targets and&nbsp;<strong>how</strong> he/she delivers a product or service will affect the success of the venture. You want be able to quickly gain access to potential customers and materials to try out your idea and see if you can validate your idea before running all the way through with it. &nbsp; Understanding who is in your Circle of Resources (People, access to $, materials, equipment) and how close or far removed they are, will help you make decisions about who to go to for support and what that will take (time, money, etc.)</p><ul><li>yes the bullet works now</li><li>great</li></ul><p>&nbsp;</p><ol><li>numbers work now</li><li>this is fantastic</li></ol><p>&nbsp;</p><figure class=\"media\"><oembed url=\"https://www.youtube.com/watch?v=YDGagPgsgB0\"></oembed></figure>",
                    item: "Setting",
                    files: [
                        {
                            url: "https://res.cloudinary.com/ddonojtwz/raw/upload/v1685029322/modules/ycity_files/leveraging%20CoR%20to%20get%20higher%20valuation%20wo%20dilution_infographic.png",
                            assetId: "6bd4840bf086ff35803b876388d55ead",
                            name: "leveraging CoR to get higher valuation wo dilution_infographic.png",
                            publicId: "modules/ycity_files/leveraging CoR to get higher valuation wo dilution_infographic.png"
                        }
                    ]
                },
                isLock: false,
                isCheck: true,
                isCheckedOff: true
            },
            {
                module: {
                    _id: "647607c94afa7f528b8bd964",
                    title: "The Backdrop ",
                    content: "<p><strong>Setting Pillar, Wonder Square 1</strong></p><p>&nbsp;</p><p>&nbsp;</p><p><strong>Who</strong> an entrepreneur targets and&nbsp;<strong>how</strong> he/she delivers a product or service will affect the success of the venture. You want be able to quickly gain access to potential customers and materials to try out your idea and see if you can validate your idea before running all the way through with it. &nbsp; Understanding who is in your Circle of Resources (People, access to $, materials, equipment) and how close or far removed they are, will help you make decisions about who to go to for support and what that will take (time, money, etc.)</p><ul><li>yes the bullet works now</li><li>great</li></ul><p>&nbsp;</p><ol><li>numbers work now</li><li>this is fantastic</li></ol><p>&nbsp;</p><figure class=\"media\"><oembed url=\"https://www.youtube.com/watch?v=YDGagPgsgB0\"></oembed></figure>",
                    item: "Setting",
                    files: [
                        {
                            url: "https://res.cloudinary.com/ddonojtwz/raw/upload/v1685029322/modules/ycity_files/leveraging%20CoR%20to%20get%20higher%20valuation%20wo%20dilution_infographic.png",
                            assetId: "6bd4840bf086ff35803b876388d55ead",
                            name: "leveraging CoR to get higher valuation wo dilution_infographic.png",
                            publicId: "modules/ycity_files/leveraging CoR to get higher valuation wo dilution_infographic.png"
                        }
                    ]
                },
                isLock: false,
                isCheck: true,
                isCheckedOff: true
            },
            {
                module: {
                    _id: "647607d74afa7f528b8bd965",
                    title: "Wonder Square 3, Solution Pillar",
                    content: "<p>Solution Pillar, Wonder Square 1</p><p>&nbsp;</p><figure class=\"media\"><oembed url=\"https://www.youtube.com/watch?v=YDGagPgsgB0\"></oembed></figure>",
                    item: "Solution",
                    files: [
                        {
                            url: "https://res.cloudinary.com/ddonojtwz/raw/upload/v1685029322/modules/ycity_files/leveraging%20CoR%20to%20get%20higher%20valuation%20wo%20dilution_infographic.png",
                            assetId: "6bd4840bf086ff35803b876388d55ead",
                            name: "leveraging CoR to get higher valuation wo dilution_infographic.png",
                            publicId: "modules/ycity_files/leveraging CoR to get higher valuation wo dilution_infographic.png"
                        }
                    ]
                },
                isLock: false,
                isCheck: true,
                isCheckedOff: false
            }
        ],
        description: "We are creating a course so that we can test not only the Modules and Course creation, but the Venture portion.  We want to see what the Mentee and Mentor sees in a Venture, test the chat/comment section, and see what homework can be uploaded in an iterative manner.",
        "ventures": 4
    },
    description: "This venture has Vicky as a mentee, since I have only tested as a mentor",
    mentee: {
        _id: "646235a409b487760747c757",
        name: "Vicky Wu Davis",
        image: "https://media.licdn.com/dms/image/C4E03AQHFDI7kqpWhJg/profile-displayphoto-shrink_100_100/0/1516170597448?e=1689811200&v=beta&t=yCE2BOTFlIE5mg8J5s1uCsmhwhWb1E_O0jOP3jnBqbg",
        email: "yCITIES1@gmail.com"
    },
    mentors: [
        {
            _id: "64526af827cef0b64e6498f6",
            name: "Andrew Holmes",
            image: "https://media.licdn.com/dms/image/C4E03AQFDO95XMA95KA/profile-displayphoto-shrink_100_100/0/1556250365188?e=1688601600&v=beta&t=H0T87TQuj4rZgKnWmeAjmzYAF9sUiNqgul3Ku2JaaT8",
            email: "andrew.t.holmes97@gmail.com"
        },
        {
            _id: "6450fd355827e97a0aa1dba5",
            name: "TM",
            image: "https://lh3.googleusercontent.com/a/AGNmyxbl-VgY1rFMlxP0WNsvdzmfWOjkjwT4CTzbS_f_=s96-c",
            email: "lovetallman426@gmail.com"
        }
    ],
    updatedAt: "2023-07-27T13:41:09.163Z",
    createdAt: "2023-06-09T16:45:12.013Z",
    isArchive: false,
    audio: "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",
    storyTrain: [
        {
            id: "opening",
            label: "Opening Hook",
            value: "1 out of every 25 adolescents has scoliosis, which is an extreme curvature in the spine.  of those, 1 out of 6 are required to wear a spine-correcting brace 18 to 23 hours a day.  I was one of those lucky ones that had to wear this brace.",
            "order": 0
        },
        {
            id: "problem",
            label: "Problem",
            value: "only 33% of patients where their brace for the full allotment of required time, which is a major  problem because wear-time compliance is directly related to probability of needing back surgery",
            "order": 3
        },
        {
            id: "character",
            label: "Character",
            value: "Teen who has severe scoliosis and juggling time management of doing normal things like showering and sleeping and changing clothes.",
            "order": 1
        },
        {
            id: "setting",
            label: "Setting",
            value: "teen who's in school, playing sports, and concerned about social aspects of looking cool and fitting in",
            "order": 2
        },
        {
            id: "solution",
            label: "Solution",
            value: "My solution would be a platform that has the real-time technology of Fitbit meets the peer social platform and achievement milestone aspect of Snapchat, tailored to the scoliosis user in a contemporary way.",
            "order": 4
        },
        {
            id: "closing",
            label: "Closing Hook",
            value: "With my knowledge of website design and my involvement in Girls Who Code, and my personal experience as a teen who started wearing this brace my freshman year in high school, my goal is to empower the teen users to own the brace, to increase their compliance rate and decrease the number of back surgeries required.",
            "order": 5
        }
    ],
    problemComicStrip: {
        title: "problem comic strip",
        panels: [
            {
                thumbnail: "https://res.cloudinary.com/ddonojtwz/image/upload/v1688220498/comicstrips/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_1.png",
                thumbPubId: "comicstrips/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_1",
                nodes: [
                    "{\"attrs\":{\"text\":\"My 88 year old grampy can be unstable when walking. My mom wants him to use a cane, but he doesn't like to use it. They often argue about it.\",\"x\":48.000000000000114,\"y\":438.04780232039303,\"fontSize\":30,\"fontFamily\":\"'Roboto', sans-serif\",\"draggable\":true,\"fill\":\"black\",\"id\":\"text-\",\"cornerRadius\":0,\"width\":918.4970703124998},\"className\":\"Text\"}",
                    "{\"attrs\":{\"x\":308.915625,\"y\":28.012500000000006,\"image\":{},\"draggable\":true,\"width\":295.63413392143735,\"height\":394.178845228583,\"scaleX\":1,\"scaleY\":1,\"rotation\":0,\"skewX\":0,\"skewY\":0},\"className\":\"Image\",\"src\":\"https://res.cloudinary.com/ddonojtwz/image/upload/v1688220499/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_0_1_1688220499255.png\"}"
                ]
            },
            {
                thumbnail: "https://res.cloudinary.com/ddonojtwz/image/upload/v1688220500/comicstrips/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_0.png",
                thumbPubId: "comicstrips/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_0",
                nodes: [
                    "{\"attrs\":{\"text\":\"My lives by himself, so no one is there to make him use the cane.\",\"x\":58.99999999999994,\"y\":470.03352298081256,\"fontSize\":30,\"fontFamily\":\"'Roboto', sans-serif\",\"draggable\":true,\"fill\":\"black\",\"id\":\"text-\",\"cornerRadius\":0,\"width\":954.4970703125013},\"className\":\"Text\"}",
                    "{\"attrs\":{\"x\":362.91562499999986,\"y\":29.01205377063809,\"image\":{},\"draggable\":true,\"width\":294.9673562923299,\"height\":393.2898083897732,\"scaleX\":1,\"scaleY\":1,\"rotation\":0,\"skewX\":0,\"skewY\":0,\"offsetX\":0,\"offsetY\":0},\"className\":\"Image\",\"src\":\"https://res.cloudinary.com/ddonojtwz/image/upload/v1688220501/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_1_1_1688220500522.png\"}"
                ]
            },
            {
                thumbnail: "https://res.cloudinary.com/ddonojtwz/image/upload/v1688220501/comicstrips/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_3.png",
                thumbPubId: "comicstrips/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_3",
                nodes: [
                    "{\"attrs\":{\"text\":\"The other day, my grampy needed to make a deposit at the bank.  The bank isn't far, so he decided to walk to the bank.  On the way there, he lost his balance and fell on the sidewalk.  He broke his hip so he couldn't get up.  No one was around so it took a while for someone to pass by and hear him yelling for help.\",\"x\":86.66235318234985,\"y\":404.909625926576,\"fontSize\":28.43129435953064,\"fontFamily\":\"'Roboto', sans-serif\",\"draggable\":true,\"fill\":\"black\",\"id\":\"text-\",\"cornerRadius\":0,\"width\":863.83471713015},\"className\":\"Text\"}",
                    "{\"attrs\":{\"x\":344.9156249999999,\"y\":3.0236557340472814,\"image\":{},\"draggable\":true,\"width\":298.7535588134338,\"height\":398.33807841791156,\"scaleX\":1,\"scaleY\":1,\"rotation\":0,\"skewX\":0,\"skewY\":0,\"offsetX\":0,\"offsetY\":0},\"className\":\"Image\",\"src\":\"https://res.cloudinary.com/ddonojtwz/image/upload/v1688220502/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_2_1_1688220502123.png\"}"
                ]
            },
            {
                thumbnail: "https://res.cloudinary.com/ddonojtwz/image/upload/v1688220502/comicstrips/comicstrips/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_2.png",
                thumbPubId: "comicstrips/comicstrips/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_2",
                nodes: [
                    "{\"attrs\":{\"points\":[332,280.125,664,280.125],\"fill\":\"black\",\"stroke\":\"black\",\"strokeWidth\":4,\"draggable\":true,\"x\":252.83526011560787,\"y\":17.99196787148577,\"scaleX\":0.5635838150289005,\"scaleY\":1.0000000000000004},\"className\":\"Arrow\"}",
                    "{\"attrs\":{\"text\":\"He ended up in the hospital.  He got even weaker as he was bedridden.  The weaker he got, the more depressed he became.    My mom had to take a lot of time off work, and she was really stressed out.\",\"x\":645,\"y\":116.19148817492201,\"fontSize\":30,\"fontFamily\":\"'Roboto', sans-serif\",\"draggable\":true,\"fill\":\"black\",\"id\":\"text-\",\"cornerRadius\":0,\"width\":331.49707031249994},\"className\":\"Text\"}",
                    "{\"attrs\":{\"x\":50.91562499999998,\"y\":18.016962293618917,\"image\":{},\"draggable\":true,\"width\":378.16875000000005,\"height\":504.225,\"scaleX\":1,\"scaleY\":1,\"rotation\":0,\"offsetX\":0,\"offsetY\":0,\"skewX\":0,\"skewY\":0},\"className\":\"Image\",\"src\":\"https://res.cloudinary.com/ddonojtwz/image/upload/v1688220503/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_3_2_1688220503283.png\"}"
                ]
            }
        ],
        createdAt: "2023-07-01T14:08:24.028Z",
        updatedAt: "2023-07-01T14:08:24.028Z",
        thumbnail: "https://res.cloudinary.com/ddonojtwz/image/upload/v1688220498/comicstrips/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_0_1.png"
    },
    solutionComicStrip: {
        title: "solution comic strip",
        panels: [
            {
                thumbnail: "https://res.cloudinary.com/ddonojtwz/image/upload/v1688234706/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_0_1688234527305.png",
                thumbPubId: "comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_0_1688234527305",
                nodes: [
                    "{\"attrs\":{\"points\":[332,280.125,664,280.125],\"fill\":\"black\",\"stroke\":\"black\",\"strokeWidth\":4,\"draggable\":true,\"x\":374.66157865285015,\"y\":-362.1022256339297,\"rotation\":45,\"scaleX\":0.9289297480902344,\"scaleY\":1.5990531982050848,\"skewX\":-1.4948390764016242e-16},\"className\":\"Arrow\"}",
                    "{\"attrs\":{\"x\":516.8260703002385,\"y\":248.65364921816177,\"image\":{},\"draggable\":true,\"width\":356.8499166627064,\"height\":271.1132483736146,\"scaleX\":1,\"scaleY\":1,\"rotation\":0,\"offsetX\":0,\"offsetY\":0,\"skewX\":0,\"skewY\":0},\"className\":\"Image\",\"src\":\"https://res.cloudinary.com/ddonojtwz/image/upload/v1688234748/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_0_1_1688234747995.png\"}",
                    "{\"attrs\":{\"x\":79,\"y\":54.179439982150825,\"image\":{},\"draggable\":true,\"width\":184,\"height\":208,\"scaleX\":1,\"scaleY\":1,\"rotation\":0,\"offsetX\":0,\"offsetY\":0,\"skewX\":0,\"skewY\":0},\"className\":\"Image\",\"src\":\"https://res.cloudinary.com/ddonojtwz/image/upload/v1688234748/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_0_2_1688234748722.png\"}",
                    "{\"attrs\":{\"x\":94.91562499999986,\"y\":307.36438350441676,\"image\":{},\"draggable\":true,\"width\":161.15818409190146,\"height\":214.8775787892019,\"scaleX\":1,\"scaleY\":1,\"visible\":true,\"rotation\":0,\"skewX\":0,\"skewY\":0,\"offsetX\":0,\"offsetY\":0},\"className\":\"Image\",\"src\":\"https://res.cloudinary.com/ddonojtwz/image/upload/v1688234749/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_0_3_1688234749258.png\"}"
                ]
            },
            {
                thumbnail: "https://res.cloudinary.com/ddonojtwz/image/upload/v1688234528/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_1_1688234528221.png",
                thumbPubId: "comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_1_1688234528221",
                nodes: [
                    "{\"attrs\":{\"x\":263.18229998889825,\"y\":78.19955129844308,\"image\":{},\"draggable\":true,\"width\":321.75200628168875,\"height\":333.0415503617479,\"scaleX\":1,\"scaleY\":1,\"rotation\":0,\"skewX\":0,\"skewY\":0,\"offsetX\":0,\"offsetY\":0},\"className\":\"Image\",\"src\":\"https://res.cloudinary.com/ddonojtwz/image/upload/v1688234749/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_1_0_1688234749662.png\"}"
                ]
            },
            {
                thumbnail: "https://res.cloudinary.com/ddonojtwz/image/upload/v1688216121/comicstrips/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_1.png",
                thumbPubId: "comicstrips/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_1",
                nodes: [
                    "{\"attrs\":{\"x\":281.5,\"y\":125.125,\"image\":{},\"draggable\":true,\"width\":433,\"height\":310,\"scaleX\":1,\"scaleY\":1},\"className\":\"Image\",\"src\":\"https://res.cloudinary.com/ddonojtwz/image/upload/v1688234750/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_2_0_1688234750145.png\"}"
                ]
            },
            {
                thumbnail: "https://res.cloudinary.com/ddonojtwz/image/upload/v1688234530/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_3_1688234530304.png",
                thumbPubId: "comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_3_1688234530304",
                nodes: [
                    "{\"attrs\":{\"x\":229.38356692387168,\"y\":41.00669901829542,\"image\":{},\"draggable\":true,\"width\":559.5740943664506,\"height\":388.683416584829,\"scaleX\":1,\"scaleY\":1,\"rotation\":0,\"skewX\":0,\"skewY\":0,\"offsetX\":0,\"offsetY\":0},\"className\":\"Image\",\"src\":\"https://res.cloudinary.com/ddonojtwz/image/upload/v1688234750/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_3_0_1688234750633.png\"}"
                ]
            },
            {
                thumbnail: "https://res.cloudinary.com/ddonojtwz/image/upload/v1688234531/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_4_1688234531109.png",
                thumbPubId: "comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_4_1688234531109",
                nodes: [
                    "{\"attrs\":{\"x\":379.0603983605104,\"y\":99.17943998215091,\"image\":{},\"draggable\":true,\"width\":275.4396016394891,\"height\":292.80966660774516,\"scaleX\":1,\"scaleY\":1,\"rotation\":0,\"skewX\":0,\"skewY\":0,\"offsetX\":0,\"offsetY\":0},\"className\":\"Image\",\"src\":\"https://res.cloudinary.com/ddonojtwz/image/upload/v1688234751/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_4_0_1688234751179.png\"}"
                ]
            }
        ],
        createdAt: "2023-07-01T18:05:51.747Z",
        updatedAt: "2023-07-01T18:05:51.747Z",
        thumbnail: "https://res.cloudinary.com/ddonojtwz/image/upload/v1688234706/comicstrips/comicstrips/ycity_files/comicstrip_image_6483571833d1838f8c4af311_1_0_1688234527305.png"
    },
    stakeholderScenario: {
        characters: [
            {
                name: "Blind person",
                isUser: true,
                isBuyer: false,
                isPayer: false,
                "feeling": 8,
                primaryMotivator: "Can we replace \"enter response here\" with the \"motivators are usually around Money, Status, Time/efficiency, Well-being of someone/something they love, Quality\"\n",
                headacheProblem: "unable to get to the various checkpoints like security, TSA, gate and then potentially missing their flight.",
                headacheFrequency: "for the blind person that has to travel a lot for work, this is a very severe headache.",
                "solvingPower": 3
            },
            {
                name: "Airport",
                isUser: false,
                isBuyer: true,
                isPayer: false,
                "feeling": 4,
                primaryMotivator: "",
                headacheProblem: "",
                headacheFrequency: "",
                "solvingPower": 0
            },
            {
                name: "parent of blind traveler",
                isUser: false,
                isBuyer: false,
                isPayer: false,
                "feeling": 8,
                primaryMotivator: "",
                headacheProblem: "",
                headacheFrequency: "",
                "solvingPower": 1
            },
            {
                name: "insurance company",
                isUser: false,
                isBuyer: false,
                isPayer: true,
                "feeling": 6,
                primaryMotivator: "money",
                headacheProblem: "when claims are being made and they have to pay for it",
                headacheFrequency: "not overly frequent ",
                "solvingPower": 3
            },
            {
                name: "blind person's employer",
                isUser: false,
                isBuyer: false,
                isPayer: false,
                "feeling": 6,
                primaryMotivator: "to keep their employee happy",
                headacheProblem: "",
                headacheFrequency: "",
                "solvingPower": 2
            },
            {
                name: "Character 6",
                isUser: false,
                isBuyer: false,
                isPayer: false,
                "feeling": -1,
                primaryMotivator: "",
                headacheProblem: "",
                headacheFrequency: "",
                "solvingPower": 0
            }
        ],
        problem: "blind people have a hard time navigating around an airport."
    },
    circleOfResource: [
        {
            "circleDistance": 3,
            pointOfContact: "Vicky",
            typeOfAsset: "Knowledge",
            descriptionOfAsset: "finding my value proposition",
            notes: "she's also an angel investor and listens to a lot of pitches",
            "remove": 1
        },
        {
            "circleDistance": 2,
            pointOfContact: "Mrs. Williams",
            typeOfAsset: "Equipment/venue",
            descriptionOfAsset: "School Auditorium",
            notes: "Mrs. Williams has been my music teacher for the past 3 years.  I also volunteer to help her teach the younger grades.  I think she will be able to let me use the school auditorium for our launch event.",
            "remove": 1
        },
        {
            "circleDistance": 3,
            pointOfContact: "Sarah G.",
            typeOfAsset: "Hard Skill",
            descriptionOfAsset: "really great at making presentations",
            notes: "Sarah is a CORE member and I've been on a Zoom mentor meeting with her before.",
            "remove": 1
        },
        {
            "circleDistance": 1,
            pointOfContact: "sister",
            typeOfAsset: "Hard Skill",
            descriptionOfAsset: "Jill is a mechanical engineer so we can ask for her help to create renderings.",
            notes: "",
            "remove": 1
        }
    ],
    era: {
        request: {
            type: {
                value: "industry",
                label: "Industry-specific (processes, KPIs)"
            },
            specificHelpRequest: "xyz ",
            members: [
                {
                    _id: "64526af827cef0b64e6498f6",
                    name: "Andrew Holmes",
                    image: "https://media.licdn.com/dms/image/C4E03AQFDO95XMA95KA/profile-displayphoto-shrink_100_100/0/1556250365188?e=1688601600&v=beta&t=H0T87TQuj4rZgKnWmeAjmzYAF9sUiNqgul3Ku2JaaT8",
                    email: "andrew.t.holmes97@gmail.com"
                },
                {
                    _id: "6450fd355827e97a0aa1dba5",
                    name: "TM",
                    image: "https://lh3.googleusercontent.com/a/AGNmyxbl-VgY1rFMlxP0WNsvdzmfWOjkjwT4CTzbS_f_=s96-c",
                    email: "lovetallman426@gmail.com"
                }
            ],
            whatYouDid: "I created a discovery interview and spoke with 10 people about this.",
            elevatorType: "1",
            opening: "1 out of every 25 adolescents has scoliosis, which is an extreme curvature in the spine.  of those, 1 out of 6 are required to wear a spine-correcting brace 18 to 23 hours a day.  I was one of those lucky ones that had to wear this brace.",
            problem: "only 33% of patients where their brace for the full allotment of required time, which is a major  problem because wear-time compliance is directly related to probability of needing back surgery",
            setting: "teen who's in school, playing sports, and concerned about social aspects of looking cool and fitting in",
            character: "Teen who has severe scoliosis and juggling time management of doing normal things like showering and sleeping and changing clothes.",
            solution: "My solution would be a platform that has the real-time technology of Fitbit meets the peer social platform and achievement milestone aspect of Snapchat, tailored to the scoliosis user in a contemporary way.",
            closing: "With my knowledge of website design and my involvement in Girls Who Code, and my personal experience as a teen who started wearing this brace my freshman year in high school, my goal is to empower the teen users to own the brace, to increase their compliance rate and decrease the number of back surgeries required.",
            files: [
                {
                    url: "https://res.cloudinary.com/ddonojtwz/image/upload/v1689774446/ERA%20Files/ycity_files/IMG_6670.jpg.jpg",
                    assetId: "e24cc458f74b54084938fd950e1fe074",
                    name: "IMG_6670.jpg",
                    publicId: "ERA Files/ycity_files/IMG_6670.jpg"
                }
            ]
        }
    },
    collabId: "64c2bd1b7dfd553a67cc1390",
    isTeam: false
}