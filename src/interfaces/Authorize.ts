
export interface IAuthIdentity {
    id: string;
    username: string;
    email: string;
    role: "RECIPIENT" | "HEAD_OF_OFFICE" | "ADMIN";
    candidateRecipientId: string | null;
}