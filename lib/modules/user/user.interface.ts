import {FormatResponse, Nullable} from "../../common/interfaces";
import {ALL_USER_TYPE, USER_TYPE, USER_TYPE_ENUM} from "../../constants";
import {Base} from "../../common/interfaces/base";
import {Model} from "sequelize";

export interface UserModel extends Model {
    validatePassword?: (password: string) => Promise<boolean>;
    generateToken?: () => string;
}


export interface IUser extends Base, UserModel {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    user_type: USER_TYPE
    email: string;
    nonce: string;
    publicKey: string;
}


export type ISafeUser = Pick<IUser, "firstname" | "lastname" | "username" | "email" | "user_type" | "createdAt" | "updatedAt">;

export interface UserPayload {
    user?: ISafeUser;
    users?: ISafeUser[];
    userLength?: number;
    token? : string;
    nonce?: string;
}
export interface UserCreateReq {
    firstname?: Nullable<string>;
    lastname?: Nullable<string>;
    username: string;
    password: string;
    user_type?: Nullable<USER_TYPE>
    email: string;
}

export interface UserUpdateReq {
    firstname?: Nullable<string>;
    lastname?: Nullable<string>;
    username: string;
    password: string;
    user_type?: Nullable<USER_TYPE>
    email: string;
}

export interface NonceReq {
    publicKey: string
}
export interface UserResponse extends FormatResponse {
    payload? : UserPayload
}






