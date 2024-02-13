import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Nextjs } from 'cdk-nextjs-standalone';
import { Construct } from 'constructs';
import { EnvironmentVariableKey, Stage, Tenant } from '../core/enums';
import { BaseStackProps } from '../core/types';

/** Relative path to NextJS project root */
const NEXTJS_PATH = '../app';

export type NextJsStackProps = {
    /** IAM policy to use for Lambda execution role */
    iamPolicy: iam.Policy;
} & BaseStackProps;

/** S3 bucket, CloudFront distribution, Lambda function to host NextJS site */
export class NextJsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: NextJsStackProps) {
        super(scope, id, props);

        const lambdaExecutionRole = new iam.Role(
            this,
            `LambdaExecutionRole-${props.stage}-${props.tenant}`,
            {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
                roleName: `lambda-execution-role-${props.stage}`,
            }
        );
        props.iamPolicy.attachToRole(lambdaExecutionRole);

        const environmentVariables: Record<EnvironmentVariableKey, string> = {
            [EnvironmentVariableKey.STAGE]: props.stage,
            [EnvironmentVariableKey.TENANT]: props.tenant,
        };

        new Nextjs(this, `NextJs-${props.stage}-${props.tenant}`, {
            nextjsPath: NEXTJS_PATH,
            environment: environmentVariables,
            defaults: {
                lambda: {
                    role: lambdaExecutionRole,
                },
                distribution: {
                    customDomain: {
                        domainName: this.getDomainName(props.tenant, props.stage),
                        hostedZone: 'cl311.org',
                        isExternalDomain: false,
                    },
                },
            },
        });
    }

    private getDomainName(tenant: Tenant, stage: Stage): string {
        if (stage === Stage.PROD) {
            return 'cl311.org';
        }

        return `${tenant}.${stage}.cl311.org`;
    }
}
