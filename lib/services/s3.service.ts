import * as AWS from 'aws-sdk';
import config from '../../config'
import {ApiError} from "../common/utils/apiError";
import {ACCEPTED_FILE_TYPE} from "../constants";
const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = config.s3Bucket;

export class S3Service {

    // private s3 = new AWS.S3();
    constructor() {
        AWS.config.setPromisesDependency(require('bluebird'));
        AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });
    }


    public fileUpload = async (fileCode: string, base64: string, fileType: ACCEPTED_FILE_TYPE): Promise<any> => {
        const { S3_BUCKET } = config.s3Bucket;
        //s3 config

        const s3 = new AWS.S3();

        // const s3 = new AWS.S3();
        // Ensure that you POST a base64 data to your server.
        // Let's assume the variable "base64" is one.
        const formatBase64 = (fileType === ACCEPTED_FILE_TYPE.APPLICATION) ? base64.replace(/^data:application\/\w+;base64,/, "") : base64.replace(/^data:image\/\w+;base64,/, "");
        const base64Data = new Buffer(formatBase64, 'base64');

        // console.log('base64Data');
        // console.log(base64Data);

        // Getting the file type, ie: jpeg, png or gif
        const type = base64.split(';')[0].split('/')[1];

        const params = {
            Bucket: S3_BUCKET,
            Key: `static-file/${fileCode}.${type}`, // type is not required
            Body: base64Data,
            // ACL: 'public-read',
            ContentEncoding: 'base64', // required
            ContentType: `${fileType}/${type}` // required. Notice the back ticks
        }

        let location = '';
        let key = '';
        try {
            const { Location, Key } = await s3.upload(params).promise();
            location = Location;
            key = Key;
        } catch (err) {

            throw new ApiError(false, "S3Error",422, err, err.code);
        }

        return {location, key};
    }

    public getFile = async (filePath: string): Promise<any> => {

        const s3 = new AWS.S3();

        var params = {
            Bucket: S3_BUCKET,
            Key: filePath //where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
        };

        try {
            const result = await s3.getObject(params).promise();
            return this.encodeBase64(result.Body);
        } catch (err) {
            throw new ApiError(false, "S3Error",422, err, err.code);
        }
    }

    public fileDelete = async (filePath: string): Promise<any> => {

        const s3 = new AWS.S3();

        var params = {
            Bucket: S3_BUCKET,
            Key: filePath //where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
        };

        let result;

        try {
            result = await s3.deleteObject(params).promise();

        } catch (err) {
            throw new ApiError(false, "S3Error",422, err, err.code);
        }

        return result;
    }

    private encodeBase64 = (data) => {

        let buf = Buffer.from(data);
        let base64 = buf.toString('base64');
        return base64

    }
}
