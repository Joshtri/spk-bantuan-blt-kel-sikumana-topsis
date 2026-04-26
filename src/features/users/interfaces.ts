
export interface IUser {
    id: string;
    username: string;
    phoneNumber: string;
    password: string;
    email: string;
    role: "RECIPIENT" | "HEAD_OF_OFFICE" | "ADMIN";
}   