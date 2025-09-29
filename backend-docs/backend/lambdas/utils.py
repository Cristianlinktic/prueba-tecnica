import boto3
import os

def get_s3_client():
    return boto3.client("s3", region_name="us-east-1")

def get_dynamodb_client():
    return boto3.client("dynamodb", region_name="us-east-1")

def get_bucket_name():
    return os.environ.get("BUCKET_NAME", "user-documents")

def get_table_name():
    return os.environ.get("TABLE_NAME", "user_documents")
