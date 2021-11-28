
import {db} from '../../db';
import {ApiError} from "../../common/utils/apiError";
import {IUser, NonceReq, UserPayload, UserUpdateReq} from "./user.interface";
import Sequelize from "sequelize";
import {nonceGenerate} from '../../common/utils/auth';

const Op = Sequelize.Op;


export class UserService {


    public async createNewUser(user): Promise<UserPayload> {

        let newUser: IUser;

        try {

            newUser = await db.User.create(user);

        } catch (err) {
            console.log(err);
            throw new ApiError(false, "SaveError",422, err.message, err.code);
        }


        const token = newUser.generateToken();
        const response: any = newUser.toJSON();

        delete response.password;
        return { user: newUser, token };
    }


    public async getUserById(userId): Promise<UserPayload>  {

        let user: any;

        try {

            user = await db.User.findOne({where: {id: userId}, attributes: { exclude: ['password']}});

            if (!user) {
                throw new ApiError(false,"UserNotFound",400,"user not found");
            }


            return { user };

        } catch (err) {

            if (err === 404 || err.name === 'CastError') {
                throw new ApiError(false,"CastError",404,"cast error");

            }

            throw new ApiError(false,"UserNotFound",422,"something wrong while getting user");
        }

    }

    public async getOrCreateNonce(userReq: NonceReq): Promise<UserPayload>  {

        let nonce;

        try {
            
            const foundUser = await db.User.findOne({where: {publicKey: userReq.publicKey}, attributes: { exclude: ['password']}});
            
            if (!foundUser) {

                const createdUser = await db.User.create({
                    publicKey: userReq.publicKey,
                    nonce: nonceGenerate()
                });

                nonce = createdUser.nonce;
            } else {
                nonce = foundUser.nonce;
            }

            return { nonce };

        } catch (err) {

            err.status = err.status || 422;

            throw new ApiError(false,"GetNonce",err?.status, err?.message);
        }

    }

    public async getAllUsers(reqQuery): Promise<UserPayload> {

        const pageOptions = {
            pageNumber: Number(reqQuery.pageNumber) || 0,
            pageSize: Number(reqQuery.pageSize) || 10,
            filter: reqQuery.filter || '',
            sortOrder: reqQuery.sortOrder || 'DESC'
        }

        const query = (
            reqQuery.username ||
            reqQuery.email ||
            reqQuery.firstname ||
            reqQuery.lastname
        ) ? this.transformQueryToObj(reqQuery) : {};

        try {


            const users: any[] = await db.User.findAll({
                where: query,
                offset: pageOptions.pageNumber * pageOptions.pageSize,
                limit: pageOptions.pageSize,
                order: [['createdAt', pageOptions.sortOrder]],
                attributes: {exclude: ['password']}
            });


            if (!users) {
                throw new ApiError(false,"UserNotFound",422,"cannot find user");
            }

            const userLength = await db.User.count({where: query});


            return { users, userLength }

        } catch (err) {
            if (err === 404 || err.name === 'CastError') {
                throw new ApiError(false,"UserNotFound",404,"CastError");
            }

            throw new ApiError(false,"UserNotFound",422,"something wrong while getting user");
        }
    }



    public async updateUser(user: any, updateUser: UserUpdateReq): Promise<UserPayload> {


        if (!user || !updateUser) { //passing user
            throw new ApiError(false,"UserServiceError",422,"update user not sent");
        }

        Object.assign(user, updateUser);

        try {
            await user.save()

            return { user };

        } catch (err) {
            throw new ApiError(false,"UserServiceError",422,"cannot save user");
        }
    }

    public async deleteUser(user: any): Promise<UserPayload> {
        if (!user) { //passing user
            throw new ApiError(false,"UserServiceError",422,"update user not sent");
        }

        try {
            await user.destroy();
            return { user };

        } catch (err) {
            throw new ApiError(false,"UserServiceError",422,"cannot save user");
        }

    }

    public async getUserByUserType(reqQuery: any): Promise<UserPayload> {

        const pageOptions = {
            pageNumber: Number(reqQuery.pageNumber) || 0,
            pageSize: Number(reqQuery.pageSize) || 10,
            filter: reqQuery.filter || '',
            sortOrder:reqQuery.sortOrder || 'desc'
        }

        const query = (
            reqQuery.username ||
            reqQuery.email ||
            reqQuery.firstname ||
            reqQuery.lastname ||
            reqQuery.user_type
        ) ? this.transformQueryToObj(reqQuery) : {};

        try {

            const users: any[] = await db.User.findAll({
                where: query,
                offset: pageOptions.pageNumber * pageOptions.pageSize,
                limit: pageOptions.pageSize,
                order: [['createdAt', pageOptions.sortOrder]],
                attributes: {exclude: ['password']}
            });

            if (!users) {
                throw new ApiError(false,"UserNotFound",422,"cannot find user");
            }

            const userLength = await db.User.count({where: query});

            return {users: users, userLength }
        } catch (err) {
            throw new ApiError(false,"UserServiceError",422,"cannot get user");
        }
    }

    private transformQueryToObj(query) {

        return {
            ...query.user_type && {user_type: query.user_type.toUpperCase()},
            ...query.username && {username: { [Op.like]: `%${query.username}%` }},
            ...query.email && {email: { [Op.like]: `%${query.email}%` }},
            ...query.firstname && {firstname: { [Op.like]: `%${query.firstname}%` }},
            ...query.lastname && {lastname: { [Op.like]: `%${query.lastname}%` }}
        };
    }

}
