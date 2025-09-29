# API para Gestión de Documentos 

##  Descripción  
Esta prueba implementa una *función Lambda en AWS que permite:  
- Subir documentos en formato PDF a Amazon S3
- Registrar metadatos (usuario, tipo de documento, fecha de subida) en Amazon DynamoDB  
- Consultar y recuperar documentos según el usuario y el tipo de documento.  

simula un flujo real de carga y consulta de documentos personales en la nube, utilizando servicios administrados de AWS.  

---

## Tecnologías utilizadas  
- Python 3.9+ 
- AWS Lambda (función principal)  
- Amazon S3 (almacenamiento de documentos)  
- Amazon DynamoDB (base de datos de metadatos)  
- Moto (mocking de servicios AWS para pruebas locales)  
- Pytest (framework de pruebas automatizadas)  

---

## Instalación y uso local  

1. Clonar el repositorio:  
   
2. Crear y activar un entorno virtual:
    python -m venv venv

3. Instalar dependencias:
    pip install -r requirements.txt

4. Ejecutar pruebas unitarias:
    pytest -q

## Pruebas 

La prueba cuenta con 3 unitarias:

1. Subida de documento válida → retorna 200 OK y guarda en S3/DynamoDB.

2. Error por payload inválido → retorna 400 Bad Request.

3. Consulta de documento inexistente → retorna 404 Not Found.
