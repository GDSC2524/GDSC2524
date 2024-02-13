import * as cdk from 'aws-cdk-lib';
import { Stage, Tenant } from '../enums';

export type BaseStackConfig = {
    stage: Stage;
    tenant: Tenant;
};

export type BaseStackProps = BaseStackConfig & cdk.StackProps;
