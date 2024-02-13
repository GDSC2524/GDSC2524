import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { BaseStackProps } from '../core/types';

export type DevIAMStackProps = {
    applicationPolicy: iam.Policy;
} & BaseStackProps;

/** IAM user stack to grant devs access to the AWS Console (readonly) and application resources */
export class DevIAMStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: DevIAMStackProps) {
        super(scope, id, props);

        this.createApplicationUser(props);
        this.createReadOnlyUser(props);
    }

    private createApplicationUser(props: DevIAMStackProps) {
        const applicationUserName = `CL311-app-${props.stage}-${props.tenant}`;

        const applicationUser = new iam.User(this, applicationUserName, {
            userName: applicationUserName,
        });

        props.applicationPolicy.attachToUser(applicationUser);
    }

    private createReadOnlyUser(props: DevIAMStackProps) {
        const readOnlyUserName = `CL311-ro-${props.stage}-${props.tenant}`;

        const readOnlyUserInitialPassword = new secretsmanager.Secret(
            this,
            `InitialPass-${readOnlyUserName}`,
            {
                secretName: `InitialPass-${readOnlyUserName}`,
                generateSecretString: {
                    passwordLength: 12,
                    excludePunctuation: true,
                },
            }
        );

        const readOnlyUser = new iam.User(this, readOnlyUserName, {
            userName: readOnlyUserName,
            password: readOnlyUserInitialPassword.secretValue,
            passwordResetRequired: true, // User must reset password on first sign-in
        });

        readOnlyUser.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));
    }
}
