import S3 from 'aws-sdk/clients/s3';
import { IS3Client } from '../../models/clients/IS3Client';
import { IS3Object } from '../../models/data/IS3Object';

const MEGABYTE = 10 ** 6;

export class S3DbClient implements IS3Client {
    s3: S3;

    constructor() {
        this.s3 = new S3({
            apiVersion: '2006-03-01',
            accessKeyId: process.env.CL_AWS_ACCESS_KEY,
            secretAccessKey: process.env.CL_AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }

    async getPresignedPost(object: Omit<IS3Object, 'url'>): Promise<{ url: string, fields: any }> {
        return await this.s3.createPresignedPost({
            Bucket: process.env.BUCKET_NAME!,
            Fields: {
                key: object.objectId,
                'Content-Type': object.fileType,
            },
            Expires: 60,
            Conditions: [
                ['content-length-range', 0, 1 * MEGABYTE],
            ],
        });
    }
}
