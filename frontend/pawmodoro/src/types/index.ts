export type Sesh = {
    id: number
    createdAt?: Date
    sessionDuration?: number
    expiresIn?: Date
    status?: string
    isPaused?: boolean
    tasks?: Task[]
    bgm?: Bgm
}

export type Task = {
    id?: string
    seshId?: string
    createdAt?: Date
    task: string
    completed?: boolean 
}

export type Bgm = {
    id: string,
    name: string,
    uri: string
}