import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ENVIRONMENT } from '../core/constants';
import { Stage } from '../core/enums';
import { BaseStackProps } from '../core/types';
import {
    DevIAMStack,
    IAMStack,
    NextJsStack,
    ReportsTableStack,
    ContactFormsTableStack,
    ReportsBucketStack,
} from '../stacks';

export type ApplicationStageProps = BaseStackProps;

export class ApplicationStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props: ApplicationStageProps) {
        super(scope, id, props);

        const baseStackProps: BaseStackProps = {
            stage: props.stage,
            tenant: props.tenant,
            env: ENVIRONMENT,
        };

        // S3 Bucket for storing images
        const s3BucketStack = new ReportsBucketStack(
            this,
            `S3BucketStack-${props.stage}-${props.tenant}`,
            {
                ...baseStackProps,
            }
        );

        // DynamoDB table storing reports
        const reportsTableStack = new ReportsTableStack(
            this,
            `ReportsTableStack-${props.stage}-${props.tenant}`,
            {
                ...baseStackProps,
            }
        );

        const contactFormsTableStack = new ContactFormsTableStack(
            this,
            `ContactFormsTableStack-${props.stage}-${props.tenant}`,
            {
                ...baseStackProps,
            }
        );

        // IAM policy stack to grant permissions to DynamoDB table and other AWS services
        const iamStack = new IAMStack(this, `IAMStack-${props.stage}-${props.tenant}`, {
            reportsTableName: reportsTableStack.getTableName(),
            reportsBucketName: s3BucketStack.getBucketName(),
            contactFormsTableName: contactFormsTableStack.getTableName(),
            ...baseStackProps,
        });

        if (props.stage !== Stage.DEV) {
            // S3 bucket, CloudFront distribution, Lambda function to host NextJS site
            // Only for beta and prod, as devs use local web servers
            const nextJsStack = new NextJsStack(
                this,
                `NextJsStack-${props.stage}-${props.tenant}`,
                {
                    iamPolicy: iamStack.getIamPolicy(),
                    ...baseStackProps,
                }
            );
        }

        if (props.stage === Stage.DEV) {
            // IAM user stack to grant devs access to the AWS Console (readonly) and application resources
            new DevIAMStack(this, `DevIAMStack-${props.stage}-${props.tenant}`, {
                applicationPolicy: iamStack.getIamPolicy(),
                ...baseStackProps,
            });
        }
    }
}
