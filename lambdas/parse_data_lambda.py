import json
import pandas as pd
import boto3
from io import StringIO
from pymongo import MongoClient
from bson import ObjectId

def get_secret(secret_name):
    client = boto3.client('secretsmanager')
    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
        secret = get_secret_value_response['SecretString']
        return json.loads(secret)
    except Exception as e:
        print(f"Error retrieving secret: {e}")
        raise e

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    secret_name = "mongodb/cluster0/connectionString"  
    secret = get_secret(secret_name)
    MONGO_URI = secret['MONGO_URI']

    try:
        if 'Records' not in event or not event['Records']:
            raise KeyError("Event does not contain 'Records' key or it is empty")

        bucket = event['Records'][0]['s3']['bucket']['name']
        key = event['Records'][0]['s3']['object']['key']

        # Check if the bucket name matches the expected bucket
        if bucket != 'va-healthtracker':
            raise ValueError(f"Unexpected bucket: {bucket}")

        user_id = key.split('_')[0]
        response = s3.get_object(Bucket=bucket, Key=key)
        file_content = response['Body'].read().decode('utf-8')

        df = pd.read_csv(StringIO(file_content))
        df = df.sort_values('Date')
        health_data = df.to_dict('records')

        client = MongoClient(MONGO_URI)
        db = client['HealthTracker']
        users_collection = db['users']
        result = users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$push': {'HealthInfo': {'$each': health_data}}}
        )

        if result.modified_count == 0:
            raise Exception(f"No user found with _id {user_id}")

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'File processed and data stored successfully',
                'userId': user_id,
                'recordsAdded': len(health_data)
            }),
            'headers': {
                'Content-Type': 'application/json'
            }
        }
    except KeyError as e:
        print(f"KeyError: {e}")
        return {
            'statusCode': 400,
            'body': json.dumps({'error': str(e)})
        }
    except ValueError as e:
        print(f"ValueError: {e}")
        return {
            'statusCode': 400,
            'body': json.dumps({'error': str(e)})
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if 'client' in locals():
            client.close()