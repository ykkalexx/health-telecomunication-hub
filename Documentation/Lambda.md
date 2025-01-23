# Health Data Processing Lambda Function

## Overview

AWS Lambda function that processes health data CSV files uploaded to S3 and stores them in MongoDB.

## Flow

1. Triggered by S3 upload event
2. Retrieves MongoDB connection string from AWS Secrets Manager
3. Processes CSV file from S3
4. Updates user's health data in MongoDB

## Configuration

### AWS Resources Required

- S3 Bucket: `va-healthtracker`
- Secrets Manager Secret: `mongodb/cluster0/connectionString`
- IAM Role Permissions:
  - `s3:GetObject`
  - `secretsmanager:GetSecretValue`

### MongoDB Schema

```javascript
{
  _id: ObjectId,
  HealthInfo: [
    {
      Date: String,
      Weight: Number,
      HeartRate: Number,
      BloodPressure: String
    }
  ]
}
```

### Dependencies

pandas==2.1.0
pymongo==4.5.0
boto3==1.28.0

### File Naming Convention

{userId}\_{timestamp}.csv

### CSV Format

Date,Weight,HeartRate,BloodPressure
2024-01-01,75.5,72,120/80
