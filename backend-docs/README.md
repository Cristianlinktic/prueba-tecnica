# API para Gestión de Documentos 

## Descripción  
Esta prueba implementa una *función Lambda en AWS* que permite:  
- Subir documentos en formato PDF a Amazon S3  
- Registrar metadatos (usuario, tipo de documento, fecha de subida) en Amazon DynamoDB  
- Consultar y recuperar documentos según el usuario y el tipo de documento  

Simula un flujo real de carga y consulta de documentos personales en la nube, utilizando servicios administrados de AWS.  

---

## Tecnologías utilizadas  
- **Python 3.11** (requerido para la prueba)  
- AWS Lambda (función principal)  
- Amazon S3 (almacenamiento de documentos)  
- Amazon DynamoDB (base de datos de metadatos)  
- Moto (mocking de servicios AWS para pruebas locales)  
- Pytest (framework de pruebas automatizadas)  

---

## Instalación y uso local  

1. Clonar el repositorio:  
   git clone https://github.com/Cristianlinktic/prueba-tecnica.git
   cd prueba-tecnica

2. Crear y activar un entorno virtual con Python 3.11:
    python3.11 -m venv venv
    source venv/bin/activate   # macOS/Linux
    venv\Scripts\activate      # Windows

3. Instalar dependencias:
     pip install -r backend-docs/backend/lambdas/requirements.txt

4. Ejecutar pruebas unitarias:
    pytest -q

## Pruebas

Las pruebas cubren distintos escenarios del flujo de la API:

### Subida de documento válida
  - Retorna 200 OK
 - Guarda correctamente el documento en S3 y sus metadatos en DynamoDB

### Error por payload inválido
   - Retorna 400 Bad Request
   - Simula payload vacío o incompleto

### Error por tipo de documento inválido
  - Retorna 400 Bad Request
  - Solo se permiten tipos de documento definidos en ALLOWED_DOCUMENT_TYPES

### Subida con Base64 inválido
   - Retorna 400 Bad Request
   - Simula que el contenido del archivo no está codificado correctamente

### Consulta de documento existente
   - Retorna 200 OK
   - Devuelve el contenido del documento en Base64

### Consulta de documento inexistente
   - Retorna 404 Not Found
   - Simula la petición de un documento que no existe en S3/DynamoDB

