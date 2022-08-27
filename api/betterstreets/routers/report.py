from sqlite3 import Date
import uuid
from typing import List, Union

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File,Form
from fastapi.responses import Response, FileResponse
from sqlalchemy.orm import Session
import json
from .. import crud, models, schemas, validate
from ..dependencies import get_db

import io
import os
import time as t


router = APIRouter()

@router.post("/report/",response_model=schemas.Submission, tags=["report"])
async def submit_report(id:str,db: Session = Depends(get_db)):
    submission = crud.set_visibility(db,id,False)
    return submission


