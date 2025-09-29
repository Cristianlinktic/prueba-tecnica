import json
import base64
import logging
from datetime import datetime, timezone

from utils import get_s3_client, get_dynamodb_client, get_bucket_name, get_table_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Tipos de documentos permitidos
ALLOWED_DOCUMENT_TYPES = ["cedula"]

def handler(event, context):
    try:
        http_method = event.get("httpMethod")
        path = event.get("path", "")

        if http_method == "POST" and path == "/documents":
            return upload_document(event)
        elif http_method == "GET" and path.startswith("/documents/"):
            parts = path.split("/")
            if len(parts) == 4:
                _, _, user_id, document_type = parts
                return get_document(user_id, document_type)
        return {"statusCode": 400, "body": json.dumps({"error": "Solicitud inválida"})}
    except Exception as e:
        logger.exception("Error no controlado: %s", e)
        return {"statusCode": 500, "body": json.dumps({"error": "Error interno del servidor"})}

def upload_document(event):
    try:
        body = json.loads(event.get("body", "{}"))
        user_id = body.get("user_id")
        document_type = body.get("document_type")
        file_base64 = body.get("file_base64")

        if not user_id or not document_type or not file_base64:
            return {"statusCode": 400, "body": json.dumps({"error": "Campos faltantes en la solicitud"})}

        if document_type not in ALLOWED_DOCUMENT_TYPES:
            return {"statusCode": 400, "body": json.dumps({"error": f"Tipo de documento inválido: {document_type}"})}

        try:
            file_bytes = base64.b64decode(file_base64)
        except Exception:
            return {"statusCode": 400, "body": json.dumps({"error": "Archivo en base64 inválido"})}

        # Generar nombre de archivo y s3_key
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        filename = f"{datetime.now().strftime('%Y-%m-%d')}_{document_type}.pdf"
        s3_key = f"{user_id}/{filename}"

        # Subir a S3
        s3 = get_s3_client()
        s3.put_object(Bucket=get_bucket_name(), Key=s3_key, Body=file_bytes)

        # Guardar metadata en DynamoDB
        dynamodb = get_dynamodb_client()
        dynamodb.put_item(
            TableName=get_table_name(),
            Item={
                "user_id": {"S": user_id},
                "document_type": {"S": document_type},
                "s3_key": {"S": s3_key},
                "uploaded_at": {"S": timestamp},
            },
        )

        return {"statusCode": 200, "body": json.dumps({"mensaje": "Documento subido correctamente", "s3_key": s3_key})}
    except Exception as e:
        logger.exception("Error en la carga del documento: %s", e)
        return {"statusCode": 500, "body": json.dumps({"error": "No se pudo subir el documento"})}

def get_document(user_id, document_type):
    try:
        dynamodb = get_dynamodb_client()
        response = dynamodb.query(
            TableName=get_table_name(),
            KeyConditionExpression="user_id = :uid",
            ExpressionAttributeValues={":uid": {"S": user_id}},
        )

        items = response.get("Items", [])
        docs = [i for i in items if i.get("document_type", {}).get("S") == document_type]

        if not docs:
            return {"statusCode": 404, "body": json.dumps({"error": "Documento no encontrado"})}

        # Obtener el documento más reciente
        latest = max(docs, key=lambda x: x["uploaded_at"]["S"])
        s3_key = latest["s3_key"]["S"]

        # Leer contenido desde S3
        s3 = get_s3_client()
        obj = s3.get_object(Bucket=get_bucket_name(), Key=s3_key)
        content = obj["Body"].read()
        file_base64 = base64.b64encode(content).decode()

        return {"statusCode": 200, "body": json.dumps({"file_base64": file_base64})}
    except Exception as e:
        logger.exception("Error al consultar el documento: %s", e)
        return {"statusCode": 500, "body": json.dumps({"error": "No se pudo obtener el documento"})}

