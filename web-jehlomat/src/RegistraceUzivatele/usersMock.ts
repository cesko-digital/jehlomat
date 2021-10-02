export interface IUser {
    id: number;
    status: 'active' | 'innactive';
    name: string;
    email: string;
}

export const usersMock: IUser[] = [
    {
        id: 1233,
        status: 'active',
        name: 'Joe Biden',
        email: 'biden@email.com',
    },
    {
        id: 32,
        status: 'innactive',
        name: 'Donald Trump',
        email: 'trump@email.com',
    },
    {
        id: 2313,
        status: 'innactive',
        name: 'Barack Obama',
        email: 'obama@email.com',
    },
    {
        id: 1109,
        status: 'innactive',
        name: 'George Bush',
        email: 'bush@email.com',
    },
];
