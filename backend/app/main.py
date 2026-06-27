from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.services.audit_logger import log_error_event
from app.routes import predict, preprocess, preview, train, upload


def create_application() -> FastAPI:
    app = FastAPI(title=settings.app_name, version=settings.app_version)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    api_prefix = settings.api_prefix
    app.include_router(upload.router, prefix=api_prefix)
    app.include_router(preview.router, prefix=api_prefix)
    app.include_router(preprocess.router, prefix=api_prefix)
    app.include_router(train.router, prefix=api_prefix)
    app.include_router(predict.router, prefix=api_prefix)

    @app.get("/")
    async def root() -> dict[str, str]:
        return {"message": "NexML API is running"}

    @app.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok", "environment": settings.environment}

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        log_error_event(context="api", path=str(request.url.path), method=request.method, error=str(exc))
        return JSONResponse(status_code=500, content={"message": "An unexpected error occurred"})

    return app


app = create_application()