
require('./patches/pgEnum-fix');
import { Sequelize, DataType } from 'sequelize';
import config from '../config';
import {DB} from "./common/interfaces";
import glob from 'glob';

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const sequelize = new Sequelize(config.dbConfig.database, config.dbConfig.username, config.dbConfig.password,{
    host: config.dbConfig.host,
    port: config.dbConfig.port,
    dialect: config.dbConfig.dialect,
    pool: config.dbConfig.pool,
});


const ext = (process.env.NODE_ENV == 'production') ? 'js' : 'ts';

const modelPaths = glob.sync(`**/*.model.${ext}`, null);

const models = modelPaths.reduce((o ,path) => {

    const splitPathArr = path.split('/');
    const lastPath = splitPathArr[splitPathArr.length - 1];
    const splitLastPathArr = lastPath.split('.');

    const modelName = capitalize(splitLastPathArr[0]);

    const pathFormat = (process.env.NODE_ENV == 'production') ? `../../${path.substring(0, path.lastIndexOf('.'))}` : `../${path.substring(0, path.lastIndexOf('.'))}`
    const importPath = sequelize.import(pathFormat);
    
    return {...o, [modelName]: importPath}
  }, 0);


Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

export const db: DB = {
    ...models,
    sequelize
}

// export default db;



