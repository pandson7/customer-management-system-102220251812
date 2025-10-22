#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CustomerManagementStack } from '../lib/cdk-app-stack';

const app = new cdk.App();
new CustomerManagementStack(app, 'CustomerManagementStack-102220251812', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
});