import {
    Body,
    Get,
    Path,
    Post,
    Query,
    Route,
    Request,
    Put,
    Delete,
    Tags,
    Security,
} from "tsoa";
import * as express from 'express';
import { UserService } from './user.service';

import {ApiError} from "../../common/utils/apiError";
import {NonceReq, UserCreateReq, UserPayload, UserResponse, UserUpdateReq} from "./user.interface";
import {USER_TYPE} from "../../constants";


@Route("user")
export class UserController {

    @Security("jwt")
    @Get('search')
    @Tags('user')
    public async searchUser(
        @Query() username?: string,
        @Query() email?: string,
        @Query() firstname?: string,
        @Query() lastname?: string,//
        @Query() pageNumber?: number,
        @Query() pageSize?: number,
        @Query() filter?: string,
        @Query() sortOrder?: string,
        @Request() req?: express.Request
    ): Promise<UserResponse> {
        const result: UserPayload = await new UserService().getAllUsers(req.query);
        const userResponse: UserResponse = {
            success: true,
            payload: {
                users: result.users,
                userLength: result.userLength
            }
        }

        return userResponse;
    }
    

    @Post('create')
    @Tags('user')
    public async createUser(@Body() requestBody: UserCreateReq): Promise<UserResponse> {
        const result: UserPayload = await new UserService().createNewUser(requestBody)
        const userResponse: UserResponse = {
            success: true,
            payload: {
                user: result.user,
                token: result.token
            }
        }
        return userResponse;
    }


    @Post('create/nonce')
    @Tags('user')
    public async getOrCreateNonce(@Body() requestBody: NonceReq): Promise<UserResponse> {

        const payload: UserPayload = await new UserService().getOrCreateNonce(requestBody)
        const userResponse: UserResponse = {
            success: true,
            payload
        }
        return userResponse;
    }

    @Security("jwt")
    @Get('list')
    @Tags('user')
    public async getAllUsers(
        @Query() pageNumber?: number,
        @Query() pageSize?: number,
        @Query() filter?: string,
        @Query() sortOrder?: string,
        @Request() req?: express.Request
    ): Promise<UserResponse> {
        const result: UserPayload = await new UserService().getAllUsers(req.query);
        const userResponse: UserResponse = {
            success: true,
            payload: {
                users: result.users,
                userLength: result.userLength
            }
        }

        return userResponse;
    }

    @Security("jwt")
    @Get("detail/{userId}")
    @Tags('user')
    public async getUser(@Path() userId: string): Promise<UserResponse> {

        const result: UserPayload = await new UserService().getUserById(userId);
        const userResponse: UserResponse = {
            success: true,
            payload: {
                user: result.user
            }
        }

        return userResponse;

    }

    @Security("jwt")
    @Put("update/{userId}")
    @Tags('user')
    public async updateUser(
        @Path() userId: string,
        @Body() user: UserUpdateReq
    ) :Promise<UserResponse> {

        const userService = new UserService();
        const getUserResult: UserPayload = await userService.getUserById(userId);
        const updatedUserResult = await userService.updateUser(getUserResult.user, user);

        const userResponse: UserResponse = {
            success: true,
            payload: {
                user: updatedUserResult.user
            }
        }

        return userResponse;

    }

    @Security("jwt")
    @Delete("delete/{userId}")
    @Tags('user')
    public async deleteUser(
        @Path() userId: string
    ): Promise<UserResponse> {

        const userService = new UserService();
        const getUserResult: UserPayload = await userService.getUserById(userId);
        await userService.deleteUser(getUserResult.user);

        const userResponse: UserResponse = {
            success: true,
        }

        return userResponse;

    }


    @Security("jwt")
    @Get("{user_type}")
    @Tags('user')
    public async getUserByUserType(
        @Path() user_type: USER_TYPE,
        @Query() username?: string,
        @Query() email?: string,
        @Query() firstName?: string,
        @Query() lastName?: string,
        @Query() pageNumber?: number,
        @Query() pageSize?: number,
        @Query() filter?: string,
        @Query() sortOrder?: string,
        @Request() req?: express.Request
    ): Promise<UserResponse> {

        const userService = new UserService();
        const query = {
            user_type,
            pageNumber,
            pageSize,
            filter,
            sortOrder,
            ...req.query
        }

        const result: UserPayload = await userService.getUserByUserType(query);


        const userResponse: UserResponse = {
            success: true,
            payload: {
                users: result.users,
                userLength: result.userLength
            }
        }

        return userResponse;

    }

}
