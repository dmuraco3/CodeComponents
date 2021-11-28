export type tag = {
    id: number;
    name: string;
    imgSrc: string;
};
export type post = {
    id: number;
    title: string;
    content: string;
    description: string;
    tags: tag[];
    following: boolean;
    author: {
        name: string;
        image: string;
        id: string;
    },
    images: string[];
}


  