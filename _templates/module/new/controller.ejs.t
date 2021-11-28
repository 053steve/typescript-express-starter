---
to: lib/modules/<%=name%>/<%=name%>.controller.ts
---



import {
  Body,
  Get,
  Path,
  Post,
  Query,
  Route,
  Request,
  Patch,
  Delete,
  Tags,
  Security,
} from "tsoa";
import * as express from 'express';
import { <%= h.capitalize(name) %>Service } from './<%=name%>.service';
import {ApiError} from "../../common/utils/apiError";
import {<%= h.capitalize(name) %>Payload, <%= h.capitalize(name) %>Req, <%= h.capitalize(name) %>Response} from "./<%=name%>.interface";

@Route("<%=name%>")
export class <%= h.capitalize(name) %>Controller {

  @Post('create')
  @Tags('<%=name%>')
  public async create<%= h.capitalize(name) %>(@Body() requestBody: <%= h.capitalize(name) %>Req): Promise<<%= h.capitalize(name) %>Response> {
      const result: <%= h.capitalize(name) %>Payload = await new <%= h.capitalize(name) %>Service().createNew<%= h.capitalize(name) %>(requestBody)
      const <%=name%>Response: <%= h.capitalize(name) %>Response = {
          success: true,
          payload: {
              <%=name%>: result.<%=name%>
          }
      }

      return <%=name%>Response;
  }

    @Patch("update/{<%=name%>Id}")
    @Tags('<%=name%>')
    public async update<%= h.capitalize(name) %>(
        @Path() <%=name%>Id: string,
        @Body() <%=name%>: <%= h.capitalize(name) %>Req
    ) :Promise<<%= h.capitalize(name) %>Response> {

        const <%=name%>Service = new <%= h.capitalize(name) %>Service();
        const get<%= h.capitalize(name) %>Result: <%= h.capitalize(name) %>Payload = await <%=name%>Service.get<%= h.capitalize(name) %>(<%=name%>Id);
        const updated<%= h.capitalize(name) %>Result = await <%=name%>Service.update<%= h.capitalize(name) %>(get<%= h.capitalize(name) %>Result.<%=name%>, <%=name%>);

        const <%=name%>Response: <%= h.capitalize(name) %>Response = {
            success: true,
            payload: {
              <%=name%>: updated<%= h.capitalize(name) %>Result.<%=name%>
            }
        }

        return <%=name%>Response;
    }

    @Get("detail/{<%=name%>Id}")
    @Tags('<%=name%>')
    public async get<%= h.capitalize(name) %>(@Path() <%=name%>Id: string): Promise<<%= h.capitalize(name) %>Response> {

        const result: <%= h.capitalize(name) %>Payload = await new <%= h.capitalize(name) %>Service().get<%= h.capitalize(name) %>(<%=name%>Id);
        const <%=name%>Response: <%= h.capitalize(name) %>Response = {
            success: true,
            payload: {
                <%=name%>: result.<%=name%>
            }
        }

        return <%=name%>Response;

    }

    @Delete("delete/{<%=name%>Id}")
    @Tags('<%=name%>')
    public async delete<%= h.capitalize(name) %>(
        @Path() <%=name%>Id: string
    ): Promise<<%= h.capitalize(name) %>Response> {

        const <%=name%>Service = new <%= h.capitalize(name) %>Service();
        const get<%= h.capitalize(name) %>Result: <%= h.capitalize(name) %>Payload = await <%=name%>Service.get<%= h.capitalize(name) %>(<%=name%>Id);
        await <%=name%>Service.delete<%= h.capitalize(name) %>(get<%= h.capitalize(name) %>Result.<%=name%>);

        const <%=name%>Response: <%= h.capitalize(name) %>Response = {
            success: true,
        }

        return <%=name%>Response;


    }

    @Get('list')
    @Tags('<%=name%>')
    public async getAll<%= h.capitalize(name) %>s(
        @Query() pageNumber?: number,
        @Query() pageSize?: number,
        @Query() filter?: string,
        @Query() sortOrder?: string,
        @Request() req?: express.Request
    ): Promise<<%= h.capitalize(name) %>Response> {
        const result: <%= h.capitalize(name) %>Payload = await new <%= h.capitalize(name) %>Service().getAll<%= h.capitalize(name) %>s(req.query);
        const <%=name%>Response: <%= h.capitalize(name) %>Response = {
            success: true,
            payload: {
                <%=name%>s: result.<%=name%>s,
                listLength: result.listLength
            }
        }

        return <%=name%>Response;
    }

    @Get("search")
    @Tags('<%=name%>')
    public async get<%= h.capitalize(name) %>ByName(
        @Query() title: string,
        @Query() pageNumber?: number,
        @Query() pageSize?: number,
        @Query() filter?: string,
        @Query() sortOrder?: string,
        @Request() req?: express.Request
    ): Promise<<%= h.capitalize(name) %>Response> {
        const <%=name%>Service = new <%= h.capitalize(name) %>Service();
        const query = {
            title,
            pageNumber,
            pageSize,
            filter,
            sortOrder,
            ...req.query
        }

        const result: <%= h.capitalize(name) %>Payload = await <%=name%>Service.get<%= h.capitalize(name) %>ByName(query);

        const <%=name%>Response: <%= h.capitalize(name) %>Response = {
            success: true,
            payload: {
                <%=name%>s: result.<%=name%>s,
                listLength: result.listLength
            }
        }

        return <%=name%>Response;
    }

}
