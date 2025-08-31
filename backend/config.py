import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://desarrollo:desarrollo@localhost:3306/web_beatty")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "tu_clave_secreta")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]
    
    # Debug
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

settings = Settings()
