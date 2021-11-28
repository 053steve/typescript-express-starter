import * as express from "express";
import * as jwt from "jsonwebtoken";
import { getToken } from "../common/utils/auth";
import config from "../../config";
import { ApiError } from "../common/utils/apiError";

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {

    if (securityName === "jwt") {
        return new Promise((resolve) => {

            const token = getToken(request);

            if (!token) {
                return new ApiError(false, "NoAuthorization", 401, "No Authorization")
            }

            let decoded = null;
            try {
                decoded = jwt.verify(token, config.secret);
                resolve(decoded);
            } catch (error) {
                throw new ApiError(false, error.name, 401, error.message);
            }
        });
    }
}
