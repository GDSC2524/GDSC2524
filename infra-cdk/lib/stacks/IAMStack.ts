import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { ENVIRONMENT } from '../core/constants';
import { BaseStackProps } from '../core/types';

export type IAMStackProps = {
    /** DynamoDB report table name to provide permissions to */
    reportsTableName: string;
    /** S3 bucket name to provide permissions to */
    reportsBucketName: string;
} & BaseStackProps;

/** IAM policy stack to grant permissions to DynamoDB table and other AWS services */
export class IAMStack extends cdk.Stack {
    private iamPolicy: iam.Policy;

    constructor(scope: Construct, id: string, props: IAMStackProps) {
        super(scope, id, props);

        this.iamPolicy = new iam.Policy(this, `GDSC2524Policy-${props.stage}-${props.tenant}`, {
            policyName: `GDSC2524Policy-${props.stage}-${props.tenant}`,
            statements: [
                new iam.PolicyStatement({
                    actions: [
                        'dynamodb:Scan',
                        'dynamodb:GetItem',
                        'dynamodb:PutItem',
                        'dynamodb:Query',
                    ],
                    resources: [
                        `arn:aws:dynamodb:${ENVIRONMENT.region}:${ENVIRONMENT.account}:table/${props.reportsTableName}`,
                        `arn:aws:dynamodb:${ENVIRONMENT.region}:${ENVIRONMENT.account}:table/${props.reportsTableName}/index/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
                    resources: [
                        `arn:aws:s3:::${props.reportsBucketName}`,
                        `arn:aws:s3:::${props.reportsBucketName}/*`,
                    ],
                }),
            ],
        });
    }

    /** Get IAM policy */
    getIamPolicy() {
        return this.iamPolicy;
    }
}
