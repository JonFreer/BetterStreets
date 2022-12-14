# from sqlite3 import Date
# import uuid
# from typing import List, Union

# from datetime import datetime
# from fastapi import APIRouter, Depends, HTTPException, UploadFile, File,Form
# from fastapi.responses import Response, FileResponse
# from sqlalchemy.orm import Session
# import json
# from .. import crud, models, schemas, validate
# from ..dependencies import get_db
# from PIL import Image,ImageOps
# import io
# import os
# import time as t
# # from fastapi.responses import FileResponse

# # from fastapi.staticfiles import StaticFiles

# # from .auth import get_token, get_token_admin

# router = APIRouter()


# # @router.post("/submit /", response_model=schemas.User, tags=["users"])
# # def create_user(
# #     user: schemas.UserCreate,
# #     db: Session = Depends(get_db)
# # ):
# #     return crud.create_user(db)

# @router.post("/submit/",response_model=schemas.Submission, tags=["submissions"])
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
    
    
#     submission = crud.create_submission(db,time,lat,lon,tags)
#     print("6",t.time()-start)
#     # print(os.getcwd())
#     img.save("data/full/"+str(submission.id)+".WebP", "WebP")
#     img_thumb.save("data/thumbs/"+str(submission.id)+".WebP", "WebP")
#     print("7",t.time()-start)

#     return submission
#     # return {"filename": file.filename}

# @router.get("/submissions/", response_model=List[schemas.Submission], tags=["submissions"])
# def read_submissions(
#     response: Response,
#     offset: int = 0,
#     limit: int = 25,
#     db: Session = Depends(get_db),
# ):
#     validate.check_limit(limit)
#     response.headers["X-Total-Count"] = str(5)
#     # res = crud.get_submissions(db, (limit, offset))
#     # print(res[0].time)
#     return crud.get_submissions(db, (limit, offset))

# @router.get("/img/{img_id}",response_class=FileResponse, tags=["submissions"]) #Add resposne model
# def get_img(response: Response,
#             img_id:str):
#     return "./data/full/"+img_id

# @router.get("/img_thumb/{img_id}",response_class=FileResponse, tags=["submissions"]) #Add resposne model
# def get_img_thumb(response: Response,
#             img_id:str):
#     return "./data/thumbs/"+img_id