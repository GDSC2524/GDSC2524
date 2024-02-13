import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Stage, Tenant } from '../core/enums';
import { BaseStackProps } from '../core/types';

const BASE_BUCKET_NAME = 'ReportsBucket';

export class ReportsBucketStack extends cdk.Stack {
    public readonly bucket: s3.Bucket;
    private stage: Stage;
    private tenant: Tenant;

    constructor(scope: Construct, id: string, props: BaseStackProps) {
        super(scope, id, props);

        this.stage = props.stage;
        this.tenant = props.tenant;

        this.bucket = new s3.Bucket(this, `ReportsBucket-${props.stage}-${props.tenant}`, {
            versioned: false,
            bucketName: this.getBucketName(),
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            cors: [
                {
                    allowedHeaders: ['*'],
                    allowedOrigins: ['*'],
                    allowedMethods: [s3.HttpMethods.POST],
                },
            ],
        });
    }

    /** Get S3 Bucket name */
    getBucketName(): string {
        return `${BASE_BUCKET_NAME}-${this.stage}-${this.tenant}`.toLowerCase();
    }
}
