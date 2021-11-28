---
to: lib/modules/<%=name%>/<%=name%>.service.ts
---



import {db} from '../../db';
import {ApiError} from "../../common/utils/apiError";
import {I<%= h.capitalize(name) %>, <%= h.capitalize(name) %>Payload, ISafe<%= h.capitalize(name) %>, <%= h.capitalize(name) %>Response, <%= h.capitalize(name) %>Req} from "./<%=name%>.interface";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

export class <%= h.capitalize(name) %>Service {

  public async createNew<%= h.capitalize(name) %>(<%=name%>): Promise<<%= h.capitalize(name) %>Payload> {

    let new<%= h.capitalize(name) %>: any;

    try {

      new<%= h.capitalize(name) %> = await db.<%= h.capitalize(name) %>.create(<%=name%>);

    } catch (err) {
        err.status = err.status || 422;
        throw new ApiError(false, "SaveError",err?.status, err?.message);
    }
    return { <%=name%>: new<%= h.capitalize(name) %> };
}

public async update<%= h.capitalize(name) %>(<%=name%>: any, update<%= h.capitalize(name) %>: <%= h.capitalize(name) %>Req): Promise<<%= h.capitalize(name) %>Payload> {


  if (!<%=name%> || !update<%= h.capitalize(name) %>) {
      throw new ApiError(false,"<%= h.capitalize(name) %>ServiceError",422,"update <%=name%> not sent");
  }

  Object.assign(<%=name%>, update<%= h.capitalize(name) %>);

  try {
      await <%=name%>.save()

      return { <%=name%> };

  } catch (err) {
      err.status = err.status || 422;
      throw new ApiError(false, ""<%= h.capitalize(name) %>SaveError",err?.status, err?.message);
  }
}

public async get<%= h.capitalize(name) %>(<%=name%>Id): Promise<<%= h.capitalize(name) %>Payload>  {

  let <%=name%>: any;

  try {
    <%=name%> = await db.<%= h.capitalize(name) %>.findOne({where: {id: <%=name%>Id}});

      if (!<%=name%>) {
          throw new ApiError(false,"<%= h.capitalize(name) %>NotFound",400,"<%=name%> not found");
      }

      return { <%=name%> };

  } catch (err) {
      err.status = err.status || 422;
      throw new ApiError(false, ""<%= h.capitalize(name) %>SaveError",err?.status, err?.message);
  }

}

public async delete<%= h.capitalize(name) %>(<%=name%>: any): Promise<<%= h.capitalize(name) %>Payload> {
  if (!<%=name%>) { //passing user
      throw new ApiError(false,"<%= h.capitalize(name) %>ServiceError",422,"delete <%=name%> not sent");
  }

  try {
      await <%=name%>.destroy();
      return { <%=name%> };

  } catch (err) {
      err.status = err.status || 422;
      throw new ApiError(false, ""<%= h.capitalize(name) %>SaveError",err?.status, err?.message);
  }

}

public async get<%= h.capitalize(name) %>ByName(reqQuery: any): Promise<<%= h.capitalize(name) %>Payload> {

  const pageOptions = {
      pageNumber: Number(reqQuery.pageNumber) || 0,
      pageSize: Number(reqQuery.pageSize) || 10,
      filter: reqQuery.filter || '',
      sortOrder:reqQuery.sortOrder || 'desc'
  }

  const query = (
      reqQuery.title
  ) ? this.transformQueryToObj(reqQuery) : {};

  try {
      const <%=name%>s: any[] = await db.<%= h.capitalize(name) %>.findAll({
          where: query,
          offset: pageOptions.pageNumber * pageOptions.pageSize,
          limit: pageOptions.pageSize,
          order: [['createdAt', pageOptions.sortOrder]]
      });

      const listLength = await db.<%= h.capitalize(name) %>.count({where: query});

      return {<%=name%>s: <%=name%>s, listLength }
  } catch (err) {
      err.status = err.status || 422;
      throw new ApiError(false, ""<%= h.capitalize(name) %>SaveError",err?.status, err?.message);
  }
}

public async getAll<%= h.capitalize(name) %>s(reqQuery): Promise<<%= h.capitalize(name) %>Payload> {

  const pageOptions = {
      pageNumber: Number(reqQuery.pageNumber) || 0,
      pageSize: Number(reqQuery.pageSize) || 10,
      filter: reqQuery.filter || '',
      sortOrder: reqQuery.sortOrder || 'DESC'
  }

  try {

      const <%=name%>s: any[] = await db.<%= h.capitalize(name) %>.findAll({
          offset: pageOptions.pageNumber * pageOptions.pageSize,
          limit: pageOptions.pageSize,
          order: [['createdAt', pageOptions.sortOrder]]
      });


      const listLength = await db.<%= h.capitalize(name) %>.count();


      return { <%=name%>s, listLength }

  } catch (err) {
      if (err === 404 || err.name === 'CastError') {
          throw new ApiError(false,"<%= h.capitalize(name) %>NotFound",404,"CastError");
      }

      err.status = err.status || 422;

      throw new ApiError(false, ""<%= h.capitalize(name) %>SaveError",err?.status, err?.message);
  }
}

private transformQueryToObj(query) {
  return {
      ...query.title && {title: { [Op.like]: `%${query.title}%` }}
  };
}

}
