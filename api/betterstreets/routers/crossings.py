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
import overpy
from pydantic import BaseModel

# from fastapi.responses import FileResponse

# from fastapi.staticfiles import StaticFiles

# from .auth import get_token, get_token_admin

router = APIRouter()


# @router.post("/submit /", response_model=schemas.User, tags=["users"])
# def create_user(
#     user: schemas.UserCreate,
#     db: Session = Depends(get_db)
# ):
#     return crud.create_user(db)

# @router.post("/submit/",response_model=schemas.Crossing, tags=["crossings"])
# async def submit_upload(file: UploadFile= File(...),lat: float = Form(...),lon: float = Form(...), time:datetime = Form(...),tags = Form(...),db: Session = Depends(get_db)):
#     tags = json.loads(tags)
#     print("hi")
#     if("image" not in file.content_type):
#         raise HTTPException(status_code=500, detail="File type must be an image")
#     start = t.time()
#     print("HIIII",t.time()-start)
#     request_object_content = await file.read()
#     print("2",t.time()-start)
#     img = Image.open(io.BytesIO(request_object_content))
#     img_thumb = Image.open(io.BytesIO(request_object_content))
#     print("3",t.time()-start)

#     # img_thumb = img.copy()
#     # img_thumb= img
#     print("4",t.time()-start)
#     MAX_SIZE = (400, 400) 
#     MAX_SIZE_2 = (200, 200) 
#     img_thumb.thumbnail(MAX_SIZE, Image.ANTIALIAS)
#     img_thumb = ImageOps.fit(img_thumb, MAX_SIZE_2, Image.ANTIALIAS)
#     print("5",t.time()-start)
#     img.thumbnail((800,800), Image.ANTIALIAS)
    
    
    # submission = crud.create_submission(db,time,lat,lon,tags)
    # print("6",t.time()-start)
    # # print(os.getcwd())
    # img.save("data/full/"+str(submission.id)+".WebP", "WebP")
    # img_thumb.save("data/thumbs/"+str(submission.id)+".WebP", "WebP")
    # print("7",t.time()-start)

    # return submission
    # # return {"filename": file.filename}

@router.get("/crossings/", response_model=List[schemas.Crossing], tags=["crossings"])
def read_submissions(
    response: Response,
    offset: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db),
):
    # validate.check_limit(limit)
    response.headers["X-Total-Count"] = str(5)
    # res = crud.get_submissions(db, (limit, offset))
    # print(res[0].time)
    return crud.get_crossings(db, (limit, offset))


class TimeUpdate(BaseModel):
    id: uuid.UUID 
    waiting_time: int 
    crossing_time: int
    notes: str

@router.post("/set_time/", response_model=schemas.Crossing, tags=["crossings"])
def set_time(
    response: Response,
    timeUpdate:TimeUpdate,
    db: Session = Depends(get_db),
):
    
    # validate.check_limit(limit)
    response.headers["X-Total-Count"] = str(5)
    # res = crud.get_submissions(db, (limit, offset))
    # print(res[0].time)
    return crud.set_time_and_notes(db, timeUpdate.id, timeUpdate.waiting_time,timeUpdate.crossing_time,timeUpdate.notes)



class TypeUpdate(BaseModel):
    id: uuid.UUID
    type: bool 
    pass

@router.post("/set_type/", response_model=schemas.Crossing, tags=["crossings"])
def set_type(
    response: Response,
    typeUpdate: TypeUpdate,
    db: Session = Depends(get_db),
):
    response.headers["X-Total-Count"] = str(5)
    return crud.set_type(db, typeUpdate.id, typeUpdate.type)


class NewCrossingParams(BaseModel):
    lat: float 
    lng: float 
@router.post("/new_crossing/",response_model=schemas.Crossing,tags=["crossing"])
def new_crossing(
    response:Response,
    crossingParams: NewCrossingParams,
     db: Session = Depends(get_db),
):
    response.headers["X-Total-Count"] = str(5)
    return crud.create_crossing(db, None,crossingParams.lat,crossingParams.lng,"traffic_signals")

@router.get("/load_geojson/", response_model=None, tags=["crossings"])
def load_geojson(
    response: Response,
    db: Session = Depends(get_db),
):
    api = overpy.Overpass()
    print("Loading GeoJson")
    result = api.query("""
    node(52.416807660144705, -2.0267880276083505,52.54420452241926, -1.7436518538274453) [highway=crossing];
    (._;>;);
    out body;
    """)
    for node in result.nodes:
        type = ""
        if "crossing" in node.tags:
            type = node.tags["crossing"]

        crossing = crud.create_crossing(db, node.id, node.lat,node.lon,type)

        # print("    Lat: %f, Lon: %f" % (node.lat, node.lon))
        # if "crossing" in node.tags:
        #     print(node.tags["crossing"])

    