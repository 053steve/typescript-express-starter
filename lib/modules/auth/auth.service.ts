

import { IVerifyOptions } from 'passport-local';
import passport from 'passport';
import { ApiError } from "../../common/utils/apiError";
import { AuthRequest } from './auth.interface';
import { db } from '../../db';
import config from '../../../config';
import { bufferToHex } from 'ethereumjs-util';
import { nonceGenerate } from '../../common/utils/auth';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';



export class AuthService {

    // public async resetPassword(req: Request, res: Response, next: NextFunction) {
    //     const rePassForm = req.body.passForm;
    //
    //
    //     try {
    //
    //         let user: IUser = await User.findById(rePassForm.userId).populate('avatar').exec();
    //         if (!user) {
    //             return res.status(422).send({ result: { isSuccess: false, data: null, msg: "cannont find user" } });
    //
    //         }
    //
    //         const isMatch = await user.validatePassword(rePassForm.oldPass);
    //
    //         if (!isMatch) {
    //             return res.status(422).send({ result: { isSuccess: false, data: null, msg: "Incorrect Password" } });
    //         }
    //
    //         user.password = rePassForm.newPass;
    //
    //         await user.save();
    //
    //         const token = user.generateToken();
    //         const response = user.toJSON();
    //
    //         delete response.password;
    //         const data = {
    //             token,
    //             user: response
    //         }
    //         console.log(user);
    //         res.send({ result: { isSuccess: true, data: data, msg: '' } });
    //
    //     } catch (err) {
    //         return res.status(422).send({ result: { isSuccess: false, data: null, msg: err } });
    //     }
    //
    // }

    public async authenticate(req: any): Promise<any> {
        // this is external promise needed for passport
        return new Promise((resolve, reject) => {

            passport.authenticate('local', (err: Error, user: any, info: IVerifyOptions) => {
                if (!user) {
                    return reject();
                }

                const token = user.generateToken();
                const response: any = user.toJSON();

                delete response.password;

                const data = {
                    token,
                    user: response
                }

                resolve(data);


            })(req);
        });
    }

    public async authenticateWeb3(req: AuthRequest): Promise<any> {

        try {
            const { signature, publicKey } = req;
            

            const foundUser = await db.User.findOne({ where: { publicKey } });

            if (!foundUser) {
                throw new ApiError(false, "AuthWeb3", 401, 'user not found');
            }

            const msg = `${config.nonce_msg}${foundUser.nonce}`;

            // We now are in possession of msg, publicAddress and signature. We
            // will use a helper from eth-sig-util to extract the address from the signature
            const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
            const address = recoverPersonalSignature({
                data: msgBufferHex,
                signature
            });

            // The signature verification is successful if the address found with
            // sigUtil.recoverPersonalSignature matches the initial publicAddress
            if (address.toLowerCase() !== publicKey.toLowerCase()) {
                throw new ApiError(false, "AuthWeb3", 401, 'Signature verification failed');
            }

            // generate new nonce for user, security shit for next login
            await db.User.update({nonce: nonceGenerate()}, {where: {id: foundUser.id}});

            const token = foundUser.generateToken();
            const user = foundUser.toJSON();

            
            delete user.password;

            const data = {
                token,
                user
            }

            return data;


        } catch (err) {

            err.status = err.status || 422;
            throw new ApiError(false, "AuthWeb3", err.status, err.message);
        }

    }
}
