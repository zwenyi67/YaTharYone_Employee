export type LoginPayload = {
    employee_id: string
    username: string
    password: string
}

export type LoginResponse = {
    token: string
    role: string
    user: UserData
}

export type FileUploadResponse = {
    file: string
}

export type UserData = {
    id: number;
    employee_id: number;
    full_name: string;
    phone: string;
    email: string;
    profile?: string;
    role_id: number;
    role_name: string;
}