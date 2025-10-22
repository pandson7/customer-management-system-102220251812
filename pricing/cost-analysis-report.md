# Customer Management System Cost Analysis Estimate Report

## Service Overview

Customer Management System is a fully managed, serverless service that allows you to This project uses multiple AWS services.. This service follows a pay-as-you-go pricing model, making it cost-effective for various workloads.

## Pricing Model

This cost analysis estimate is based on the following pricing model:
- **ON DEMAND** pricing (pay-as-you-go) unless otherwise specified
- Standard service configurations without reserved capacity or savings plans
- No caching or optimization techniques applied

## Assumptions

- Standard ON DEMAND pricing model for all services
- US East (N. Virginia) region pricing
- Moderate usage patterns for a prototype system
- No reserved instances or savings plans
- Standard storage class for S3
- On-demand billing mode for DynamoDB
- REST API Gateway (not HTTP API)
- 256 MB memory allocation for Lambda functions

## Limitations and Exclusions

- Data transfer costs between regions
- CloudWatch logging and monitoring costs
- Development and testing environment costs
- SSL certificate costs
- Custom domain name costs
- Backup and disaster recovery costs beyond basic PITR

## Cost Breakdown

### Unit Pricing Details

| Service | Resource Type | Unit | Price | Free Tier |
|---------|--------------|------|-------|------------|
| AWS Lambda | Requests | request | $0.0000002 | First 12 months: 1M requests and 400,000 GB-seconds free |
| AWS Lambda | Compute | GB-second | $0.0000166667 | First 12 months: 1M requests and 400,000 GB-seconds free |
| Amazon DynamoDB | Read Requests | million read request read requests | $0.125 | First 12 months: 25 GB storage, 25 WRU, 25 RRU free |
| Amazon DynamoDB | Write Requests | million write request write requests | $0.625 | First 12 months: 25 GB storage, 25 WRU, 25 RRU free |
| Amazon DynamoDB | Storage | GB-month (after 25 GB free) | $0.25 | First 12 months: 25 GB storage, 25 WRU, 25 RRU free |
| Amazon API Gateway | Api Calls | million requests (first 333 million) | $3.50 | First 12 months: 1M API calls free |
| Amazon S3 | Storage | GB-month (first 50 TB) | $0.023 | First 12 months: 5 GB storage, 20,000 GET requests, 2,000 PUT requests free |

### Cost Calculation

| Service | Usage | Calculation | Monthly Cost |
|---------|-------|-------------|-------------|
| AWS Lambda | Processing 10,000 API requests per month with 256 MB memory, 1 second average execution time (Requests: 10,000 requests, Compute: 10,000 requests × 1s × 0.25GB = 2,500 GB-seconds) | $0.0000002 × 10,000 requests + $0.0000166667 × 2,500 GB-seconds = $0.002 + $0.042 = $0.044 (within free tier) | $0.21 |
| Amazon DynamoDB | On-demand billing with 5,000 read requests and 2,000 write requests per month, 1 GB storage (Read Requests: 5,000 read request units, Write Requests: 2,000 write request units, Storage: 1 GB-month) | $0.125/1M × 5,000 RRU + $0.625/1M × 2,000 WRU + $0.00 storage (within free tier) = $0.000625 + $0.00125 = $0.002 (within free tier) | $1.25 |
| Amazon API Gateway | REST API with 10,000 requests per month (Api Calls: 10,000 requests) | $3.50/1M × 10,000 requests = $0.035 (within free tier) | $0.035 |
| Amazon S3 | Static website hosting with 1 GB storage and minimal data transfer (Storage: 1 GB-month) | $0.023 × 1 GB = $0.023 (within free tier for first 5 GB) | $0.023 |
| **Total** | **All services** | **Sum of all calculations** | **$1.52/month** |

### Free Tier

Free tier information by service:
- **AWS Lambda**: First 12 months: 1M requests and 400,000 GB-seconds free
- **Amazon DynamoDB**: First 12 months: 25 GB storage, 25 WRU, 25 RRU free
- **Amazon API Gateway**: First 12 months: 1M API calls free
- **Amazon S3**: First 12 months: 5 GB storage, 20,000 GET requests, 2,000 PUT requests free

## Cost Scaling with Usage

The following table illustrates how cost estimates scale with different usage levels:

| Service | Low Usage | Medium Usage | High Usage |
|---------|-----------|--------------|------------|
| AWS Lambda | $0/month | $0/month | $0/month |
| Amazon DynamoDB | $0/month | $1/month | $2/month |
| Amazon API Gateway | $0/month | $0/month | $0/month |
| Amazon S3 | $0/month | $0/month | $0/month |

### Key Cost Factors

- **AWS Lambda**: Processing 10,000 API requests per month with 256 MB memory, 1 second average execution time
- **Amazon DynamoDB**: On-demand billing with 5,000 read requests and 2,000 write requests per month, 1 GB storage
- **Amazon API Gateway**: REST API with 10,000 requests per month
- **Amazon S3**: Static website hosting with 1 GB storage and minimal data transfer

## Projected Costs Over Time

The following projections show estimated monthly costs over a 12-month period based on different growth patterns:

Base monthly cost calculation:

| Service | Monthly Cost |
|---------|-------------|
| AWS Lambda | $0.21 |
| Amazon DynamoDB | $1.25 |
| Amazon API Gateway | $0.04 |
| Amazon S3 | $0.02 |
| **Total Monthly Cost** | **$1** |

| Growth Pattern | Month 1 | Month 3 | Month 6 | Month 12 |
|---------------|---------|---------|---------|----------|
| Steady | $1/mo | $1/mo | $1/mo | $1/mo |
| Moderate | $1/mo | $1/mo | $1/mo | $2/mo |
| Rapid | $1/mo | $1/mo | $2/mo | $4/mo |

* Steady: No monthly growth (1.0x)
* Moderate: 5% monthly growth (1.05x)
* Rapid: 10% monthly growth (1.1x)

## Detailed Cost Analysis

### Pricing Model

ON DEMAND


### Exclusions

- Data transfer costs between regions
- CloudWatch logging and monitoring costs
- Development and testing environment costs
- SSL certificate costs
- Custom domain name costs
- Backup and disaster recovery costs beyond basic PITR

### Recommendations

#### Immediate Actions

- Leverage AWS Free Tier benefits for the first 12 months
- Monitor usage patterns to optimize Lambda memory allocation
- Use DynamoDB on-demand billing for unpredictable workloads
- Consider HTTP API Gateway for lower costs if REST features aren't needed
- Implement efficient pagination for DynamoDB queries
#### Best Practices

- Set up CloudWatch billing alerts to monitor costs
- Use AWS Cost Explorer to track spending patterns
- Consider Reserved Instances for predictable workloads after prototype phase
- Implement proper error handling to avoid unnecessary Lambda invocations
- Use DynamoDB single-table design to minimize costs
- Enable S3 Intelligent Tiering for automatic cost optimization



## Cost Optimization Recommendations

### Immediate Actions

- Leverage AWS Free Tier benefits for the first 12 months
- Monitor usage patterns to optimize Lambda memory allocation
- Use DynamoDB on-demand billing for unpredictable workloads

### Best Practices

- Set up CloudWatch billing alerts to monitor costs
- Use AWS Cost Explorer to track spending patterns
- Consider Reserved Instances for predictable workloads after prototype phase

## Conclusion

By following the recommendations in this report, you can optimize your Customer Management System costs while maintaining performance and reliability. Regular monitoring and adjustment of your usage patterns will help ensure cost efficiency as your workload evolves.
