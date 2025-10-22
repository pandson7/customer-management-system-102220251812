import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class CustomerManagementStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = '102220251812';

    // DynamoDB Table for customers
    const customersTable = new dynamodb.Table(this, `CustomersTable-${suffix}`, {
      tableName: `customers-${suffix}`,
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Global Secondary Index for email uniqueness
    customersTable.addGlobalSecondaryIndex({
      indexName: 'EmailIndex',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
    });

    // Lambda function for customer API
    const customerLambda = new lambda.Function(this, `CustomerHandler-${suffix}`, {
      functionName: `customer-handler-${suffix}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        CUSTOMERS_TABLE: customersTable.tableName,
      },
      timeout: cdk.Duration.seconds(30),
    });

    // Grant Lambda permissions to access DynamoDB
    customersTable.grantReadWriteData(customerLambda);

    // API Gateway
    const api = new apigateway.RestApi(this, `CustomerApi-${suffix}`, {
      restApiName: `customer-api-${suffix}`,
      description: 'Customer Management API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // API Gateway Lambda integration
    const lambdaIntegration = new apigateway.LambdaIntegration(customerLambda);

    // API routes
    const customers = api.root.addResource('api').addResource('customers');
    customers.addMethod('GET', lambdaIntegration);
    customers.addMethod('POST', lambdaIntegration);

    const customerById = customers.addResource('{customerId}');
    customerById.addMethod('GET', lambdaIntegration);
    customerById.addMethod('PUT', lambdaIntegration);
    customerById.addMethod('DELETE', lambdaIntegration);

    // S3 bucket for frontend hosting
    const websiteBucket = new s3.Bucket(this, `WebsiteBucket-${suffix}`, {
      bucketName: `customer-management-frontend-${suffix}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: false,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Add bucket policy for public read access
    websiteBucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.AnyPrincipal()],
      actions: ['s3:GetObject'],
      resources: [`${websiteBucket.bucketArn}/*`],
    }));

    // Output the API URL and website URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'Customer Management API URL',
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: websiteBucket.bucketWebsiteUrl,
      description: 'Customer Management Website URL',
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: websiteBucket.bucketName,
      description: 'S3 Bucket Name for Frontend',
    });
  }
}
