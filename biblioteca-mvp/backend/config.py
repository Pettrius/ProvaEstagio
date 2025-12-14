import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

class Config:
    """Classe de configuração da aplicação"""
    
    # Configurações do banco de dados MySQL
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '3306')
    DB_NAME = os.getenv('DB_NAME', 'biblioteca_db')
    
    # String de conexão do SQLAlchemy
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    
    # Desabilita rastreamento de modificações (performance)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configurações do Flask
    DEBUG = True
    JSON_AS_ASCII = False  # Permite caracteres especiais no JSON