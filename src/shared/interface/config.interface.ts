export interface ServerConfigIterface {
    port: number | string;
    origin: string;
}

export interface DataBaseConfigInterface {
    type: any;
    port: string;
    database?: string;
    host: string;
    username: string;
    password: string;
    synchronize: string;
}

export interface JwtConfigInterface {
    expiresIn: number | string;
    secret: string;
}
