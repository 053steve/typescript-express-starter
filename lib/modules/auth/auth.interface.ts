import {IUser} from "../user/user.interface";
import {Nullable} from '../../common/interfaces'
import {FormatResponse} from "../../common/interfaces";



export interface AuthRequest {
    username?: Nullable<string>
    password?: Nullable<string>
    authType: AuthType
    signature?: Nullable<string>
    publicKey?: Nullable<string>
}

export enum AuthType {
    STANDARD = 'STANDARD',
    W3_WALLET = 'W3_WALLET'
}

export interface AuthPayload {
    user?: IUser
    token? : string
}

export interface AuthResponses extends FormatResponse {
    payload? : AuthPayload
}

export interface AuthValidationResults {
    ok: boolean
    errors: string[];
}
