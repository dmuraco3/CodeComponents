import { Tag } from "@prisma/client";

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
    tags: Tag[];
    author: {
        name: string | null;
        image: string | null;
        id: number;
    },
    images: string[];
}


  