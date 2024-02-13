import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PipelineStack } from './stacks';
import { ApplicationStage } from './stages';
import { BaseStackConfig } from './core/types';
import { ENVIRONMENT } from './core/constants';
import { Stage, Tenant } from './core/enums';

const WAVES: { waveId: string; stages: BaseStackConfig[] }[] = [
    {
        waveId: 'dev',
        stages: [
            {
                stage: Stage.DEV,
                tenant: Tenant.ANDREY,
            },
            {
                stage: Stage.DEV,
                tenant: Tenant.ZHANPING,
            },
            {
                stage: Stage.DEV,
                tenant: Tenant.MIN,
            },
            {
                stage: Stage.DEV,
                tenant: Tenant.SOPHIE,
            },
        ],
    },
    {
        waveId: 'beta',
        stages: [
            {
                stage: Stage.BETA,
                tenant: Tenant.DEFAULT,
            },
        ],
    },
    {
        waveId: 'prod',
        stages: [
            {
                stage: Stage.PROD,
                tenant: Tenant.DEFAULT,
            },
        ],
    },
];

export class InfraCdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipelineStack = new PipelineStack(scope, 'Pipeline', {
            env: ENVIRONMENT,
        });
        const pipeline = pipelineStack.getPipeline();

        WAVES.forEach((waveDef) => {
            const wave = pipeline.addWave(`wave-${waveDef.waveId}`);
            waveDef.stages.forEach((stageDef) => {
                wave.addStage(
                    new ApplicationStage(
                        scope,
                        `ApplicationStage-${waveDef.waveId}-${stageDef.stage}-${stageDef.tenant}`,
                        {
                            stage: stageDef.stage,
                            tenant: stageDef.tenant,
                            env: ENVIRONMENT,
                        }
                    )
                );
            });
        });
    }
}
