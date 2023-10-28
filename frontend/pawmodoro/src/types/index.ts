export type Sesh = {
    id: number
    createdAt?: Date
    sessionDuration?: number
    expiresIn?: Date
    status?: string
    tasks?: Task[]
}

export type Task = {
    id?: string
    seshId?: string
    createdAt?: Date
    task: string
    completed?: boolean 
}