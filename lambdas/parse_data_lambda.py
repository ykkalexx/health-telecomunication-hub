import json
import pandas as pd
import boto3
from io import StringIO
from pymongo import MongoClient

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

    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    try:
        user_id = key.split('/')[0]
        response = s3.get_object(Bucket=bucket, Key=key)
        file_content = response['Body'].read().decode('utf-8')

        df = pd.read_csv(StringIO(file_content))
        df = df.sort_values('Date')
        health_data = df.to_dict('records')

        client = MongoClient(MONGO_URI)
        db = client['your_database_name']
        users_collection = db['users']
        result = users_collection.update_one(
            {'_id': user_id},
            {'$push': {'healthInfo': {'$each': health_data}}}
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
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if 'client' in locals():
            client.close()