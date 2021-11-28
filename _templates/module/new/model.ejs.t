---
to: lib/modules/<%=name%>/<%=name%>.model.ts
---



import {INTEGER, STRING} from 'sequelize';

export default (sequelize, DataTypes) =>   {
  const <%=h.capitalize(name)%> = sequelize.define('<%= h.capitalize(name) %>', {
      id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      title: {
        type: STRING,
        unique: true,
        allowNull: false
      }
  },{
      timestamps: true
  });

  
  return <%=h.capitalize(name)%>;
};
