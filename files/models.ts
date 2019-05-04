export interface IOrder {
    id?: number;
    petId?: number;
    quantity?: number;
    shipDate?: string;
    status?: string;
    complete?: boolean;
}
export interface IUser {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    userStatus?: number;
}
export interface ICategory {
    id?: number;
    name?: string;
}
export interface ITag {
    id?: number;
    name?: string;
}
export interface IPet {
    id?: number;
    category?: ICategory;
    name: string;
    photoUrls: [string];
    tags?: [ITag];
    status?: string;
}
export interface IApiResponse {
    code?: number;
    type?: string;
    message?: string;
}
