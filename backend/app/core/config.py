from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/solardiet"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    OPENAI_API_KEY: str | None = None
    CLAUDE_API_KEY: str | None = None
    TONGYI_API_KEY: str | None = None
    ZHIPU_API_KEY: str | None = None
    KIMI_API_KEY: str | None = None

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()