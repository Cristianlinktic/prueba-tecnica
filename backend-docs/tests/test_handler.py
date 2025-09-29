import json
import base64
import pytest
from moto import mock_s3, mock_dynamodb
import boto3
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../backend/lambdas'))
import lambda_function
import utils

BUCKET = utils.get_bucket_name()
TABLE = utils.get_table_name()

@pytest.fixture(autouse=True)
def setup_env(monkeypatch):
    monkeypatch.setenv("BUCKET_NAME", BUCKET)
    monkeypatch.setenv("TABLE_NAME", TABLE)

@mock_s3
@mock_dynamodb
def test_upload_valid():
    s3 = boto3.client("s3", region_name="us-east-1")
    s3.create_bucket(Bucket=BUCKET)
    dynamodb = boto3.client("dynamodb", region_name="us-east-1")
    dynamodb.create_table(
        TableName=TABLE,
        KeySchema=[{"AttributeName": "user_id", "KeyType": "HASH"}],
        AttributeDefinitions=[{"AttributeName": "user_id", "AttributeType": "S"}],
        BillingMode="PAY_PER_REQUEST",
    )

    file_content = b"dummy pdf"
    event = {
        "httpMethod": "POST",
        "path": "/documents",
        "body": json.dumps({
            "user_id": "123",
            "document_type": "cedula",
            "file_base64": base64.b64encode(file_content).decode(),
        }),
    }
    result = lambda_function.handler(event, None)
    assert result["statusCode"] == 200
    body = json.loads(result["body"])
    assert "s3_key" in body

@mock_s3
@mock_dynamodb
def test_payload_invalid():
    event = {"httpMethod": "POST", "path": "/documents", "body": "{}"}
    result = lambda_function.handler(event, None)
    assert result["statusCode"] == 400

@mock_s3
@mock_dynamodb
def test_get_document_not_found():
    s3 = boto3.client("s3", region_name="us-east-1")
    s3.create_bucket(Bucket=BUCKET)
    dynamodb = boto3.client("dynamodb", region_name="us-east-1")
    dynamodb.create_table(
        TableName=TABLE,
        KeySchema=[{"AttributeName": "user_id", "KeyType": "HASH"}],
        AttributeDefinitions=[{"AttributeName": "user_id", "AttributeType": "S"}],
        BillingMode="PAY_PER_REQUEST",
    )

    event = {"httpMethod": "GET", "path": "/documents/123/cedula"}
    result = lambda_function.handler(event, None)
    assert result["statusCode"] == 404
