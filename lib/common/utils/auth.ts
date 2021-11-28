import { Request } from "express";
import { AuthRequest, AuthType, AuthValidationResults } from "../../modules/auth/auth.interface";



export function getToken(req: Request) {

  const authHeader = req.get('authorization');

  if (!authHeader) {
    return null
  }
  const parts = authHeader.split(' ')
  if (parts.length !== 2) {
    return null
  }
  const scheme = parts[0]
  const token = parts[1]
  if (/^Bearer$/i.test(scheme)) {
    return token
  }
  return null
}

export const nonceGenerate = () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < possible.length; i++) { 
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export const validateAuthReq = (authReq: AuthRequest): AuthValidationResults => {

  const result: AuthValidationResults = {
    ok: true,
    errors: []
  }
  
  if (authReq.authType === AuthType.STANDARD) {
    if (!authReq.username || !authReq.password) {
      result.ok = false;
      result.errors.push('no username / password')
    }
  } else if (authReq.authType === AuthType.W3_WALLET) {
    if (!authReq.publicKey || !authReq.signature) {
      result.ok = false;
      result.errors.push('no publicKey / signature')
    }
  }

  return result;

}