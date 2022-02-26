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
    public async createUser(@Body() requestBody: UserCreateReq): Promise<UserPayload> {
        const result: UserPayload = await new UserService().createNewUser(requestBody)
        return {
            user: result.user,
            token: result.token
        }
    }


    @Post('create/nonce')
    @Tags('user')
    public async getOrCreateNonce(@Body() requestBody: NonceReq): Promise<UserPayload> {

        return await new UserService().getOrCreateNonce(requestBody)
        
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
    ): Promise<UserPayload> {
        const result: UserPayload = await new UserService().getAllUsers(req.query);
        return {
            users: result.users,
            userLength: result.userLength
        }
    }

    @Security("jwt")
    @Get("detail/{userId}")
    @Tags('user')
    public async getUser(@Path() userId: string): Promise<UserPayload> {

        const result: UserPayload = await new UserService().getUserById(userId);
        return {
            user: result.user
        };

    }

    @Security("jwt")
    @Put("update/{userId}")
    @Tags('user')
    public async updateUser(
        @Path() userId: string,
        @Body() user: UserUpdateReq
    ) :Promise<UserPayload> {

        const userService = new UserService();
        const getUserResult: UserPayload = await userService.getUserById(userId);
        const updatedUserResult = await userService.updateUser(getUserResult.user, user);

        return {
            user: updatedUserResult.user
        };

    }

    @Security("jwt")
    @Delete("delete/{userId}")
    @Tags('user')
    public async deleteUser(
        @Path() userId: string
    ): Promise<UserPayload> {

        const userService = new UserService();
        const getUserResult: UserPayload = await userService.getUserById(userId);
        await userService.deleteUser(getUserResult.user);

        return;
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
    ): Promise<UserPayload> {

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


        return {
            users: result.users,
            userLength: result.userLength
        };

    }

}
