# Customer Management System - AWS Architecture Diagrams

This directory contains AWS architecture diagrams for the Customer Management System based on the technical design specification.

## Generated Diagrams

### 1. customer-management-architecture.png
**Overview**: High-level system architecture showing the main components and data flow.

**Components**:
- **Frontend**: React.js application hosted on S3 static website
- **API Layer**: AWS API Gateway providing REST endpoints
- **Compute**: Lambda function handling all CRUD operations
- **Data Layer**: DynamoDB table with Global Secondary Index for email uniqueness
- **Monitoring**: CloudWatch for logs and metrics

**Data Flow**: User → S3 (React App) → API Gateway → Lambda → DynamoDB

### 2. customer-management-api-flow.png
**Overview**: Detailed view of API endpoints and database operations.

**API Endpoints**:
- `GET /customers` - List customers with pagination
- `GET /customers/{id}` - Get customer by ID
- `POST /customers` - Create new customer
- `PUT /customers/{id}` - Update existing customer
- `DELETE /customers/{id}` - Delete customer

**Database Operations**:
- Scan/Query for listing customers
- GetItem for retrieving specific customers
- PutItem for creating customers
- UpdateItem for modifying customers
- DeleteItem for removing customers
- Email uniqueness validation via GSI

### 3. customer-management-infrastructure.png
**Overview**: Infrastructure components and deployment architecture.

**Infrastructure Components**:
- **Deployment**: AWS CDK (TypeScript) for Infrastructure as Code
- **Compute**: Lambda function (256MB memory, 30s timeout)
- **API**: REST API Gateway with CORS enabled
- **Storage**: S3 for static website hosting, DynamoDB with on-demand billing
- **Security**: IAM roles, KMS encryption, automated backups
- **Monitoring**: CloudWatch Logs and Metrics

## Architecture Highlights

### Serverless Design
- No server management required
- Automatic scaling based on demand
- Pay-per-use pricing model

### Security Features
- HTTPS encryption for all communications
- Server-side encryption for DynamoDB
- IAM roles for least-privilege access
- Automated daily backups

### Performance Optimizations
- DynamoDB on-demand scaling
- Global Secondary Index for email queries
- Lambda cold start mitigation
- Efficient pagination implementation

### Monitoring & Observability
- CloudWatch integration for logs and metrics
- Structured error handling
- Performance monitoring capabilities

## Technical Specifications

### DynamoDB Table Structure
```
Table: customers
Partition Key: customerId (String)
GSI: EmailIndex (email as partition key)
Billing: On-demand
Encryption: Server-side encryption enabled
Backup: Automated daily backups
```

### Lambda Configuration
```
Runtime: Node.js 18.x
Memory: 256 MB
Timeout: 30 seconds
Framework: Express.js
```

### API Gateway Configuration
```
Type: REST API
CORS: Enabled
Throttling: Default AWS limits
Logging: CloudWatch integration
```

## Deployment Notes

The system is designed for deployment using AWS CDK (TypeScript) as a single stack, providing:
- Infrastructure as Code
- Version control for infrastructure changes
- Consistent deployment across environments
- Easy rollback capabilities

All diagrams were generated using the AWS Diagrams package and reflect the current system design as specified in the technical design document.
