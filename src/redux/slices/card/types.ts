export interface CartStateInterface {
    items: ItemsType[]
    totalCount: number
}

export type ItemsType = {
    login: string;
    name: string;
    type: string;
    id: number;
    avatar: string;
    stars: number;
}

export type ItemsGettingType = {
    id: number,
        name: string,
        stars: number,
        owner: {
        avatar_url: string;
        login: string;
        type: string;
    }
}