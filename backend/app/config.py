from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables / .env file."""

    # Required secrets (no defaults). Leaving them unset raises a validation
    # error at import time, which is the intended fail-fast behavior.
    jwt_secret_key: str
    encryption_key: str

    # Database connection string. Defaults to a local SQLite file.
    database_url: str = "sqlite:///./test.db"

    # Comma-separated list of origins allowed by CORS.
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # API key guarding the admin endpoints. Empty by default, which disables
    # admin access entirely until configured.
    admin_api_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def origins_list(self) -> list[str]:
        """Return the allowed origins as a cleaned list of strings."""
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


settings = Settings()
