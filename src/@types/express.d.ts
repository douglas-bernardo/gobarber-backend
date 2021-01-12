// sobrescrita de tipos no typescript
declare namespace Express {
    export interface Request {
        user: {
            id: string;
        };
    }
}
