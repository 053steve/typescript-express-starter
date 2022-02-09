import {Body, Post, Request, Route, Tags, SuccessResponse} from "tsoa";

import {AuthService} from './auth.service';

import {AuthRequest, AuthResponses, AuthType} from "./auth.interface";
import {ApiError} from "../../common/utils/apiError";
import {validateAuthReq} from '../../common/utils/auth';


@Route("auth")
export class AuthController {
    @SuccessResponse('201', 'Created')
    @Post()
    @Tags('auth')
    public async auth(@Body() requestBody: AuthRequest, @Request() req: express.Request): Promise<AuthResponses> {
        try {
            const response = (<any>req).res as express.Response;
            const authType = requestBody.authType;
            let result;

            const validationResults = validateAuthReq(requestBody);
            
            if (!validationResults.ok) {
                throw new ApiError(false, "Login Error", 422, validationResults.errors.join('|'));
            }

            switch (authType) {
                case AuthType.STANDARD:

                    result = await new AuthService().authenticate(req);
                    break;

                case AuthType.W3_WALLET:

                    result = await new AuthService().authenticateWeb3(requestBody);
                    break;

                default:
                    throw new ApiError(false, "Login Error", 500, 'no auth type set');
            }

            response.status(201);

            return {
                success: true,
                payload: {
                    user: result.user,
                    token: result.token
                }
            };
        } catch (err) {
            throw new ApiError(false, "Login Error", err.status, err.message);
        }

    }

}
