from fastapi import HTTPException
from pydantic import HttpUrl

from . import config

MAX_LIMIT = 100


def check_limit(limit: int):
    if limit > MAX_LIMIT:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid limit: max limit is {MAX_LIMIT}",
        )


def check_redirect(redirect: HttpUrl):
    if not redirect.host.endswith(config.Domain):
        raise HTTPException(status_code=404, detail="Invalid redirect url")