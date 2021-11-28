---
to: lib/modules/<%=name%>/<%=name%>.interface.ts
---



import {FormatResponse} from "../../common/interfaces";
import {Base} from "../../common/interfaces/base";

export interface I<%= h.capitalize(name) %> extends Base {
  title: string;
}

export interface ISafe<%= h.capitalize(name) %> extends Pick<I<%= h.capitalize(name) %>, "title" | "createdAt" | "updatedAt"> {}

export interface <%= h.capitalize(name) %>Req {
  title?: string;
}

export interface <%= h.capitalize(name) %>Payload {
  <%=name%>?: ISafe<%= h.capitalize(name) %>;
  <%=name%>s?: ISafe<%= h.capitalize(name) %>[];
  listLength?: number;
}

export interface <%= h.capitalize(name) %>Response extends FormatResponse {
  payload? : <%= h.capitalize(name) %>Payload
}
