from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from fastapi.openapi.utils import get_openapi

from . import config
from .routers import uploads

app = FastAPI(root_path="/api",title="BadlyParked")
app.add_middleware(SessionMiddleware, secret_key=config.SessionSecret)
# openapi_schema = get_openapi(title="BadlyParked",version="1.0.0",routes=app.routes,description="This is a very custom OpenAPI schema")
# app.openapi_schema = openapi_schema
# app.openapi = app.openapi_schema
app.include_router(uploads.router)
# app.include_router(users.router)
# app.include_router(achievements.router)
# app.include_router(external.router)