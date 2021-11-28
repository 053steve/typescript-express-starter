
import * as dotenv from "dotenv";
import path from 'path';
const selectedEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.join(__dirname, '..', `.env.${selectedEnv}`)});


export default {
    port: process.env.PORT,
    secret: process.env.SECRET,
    nonce_msg: 'Signing one-time nonce: ',
    dbConfig: {
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      dialect: "postgres",
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    },
    
    // s3Bucket: {
    //   ACCESS_KEY_ID: 'something',
    //   SECRET_ACCESS_KEY: 'something',
    //   AWS_REGION: 'something',
    //   S3_BUCKET: 'something'
    // }
  };
  