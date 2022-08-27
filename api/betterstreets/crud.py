
from datetime import datetime
import uuid
from typing import Any, Dict, List, Optional, Tuple, Union

from sqlalchemy import or_,and_
from sqlalchemy.orm import Session

from . import config, models

def get_submissions(db: Session, limit_offset: Tuple[int, int]):
    limit, offset = limit_offset
    submissions = db.query(models.Submission).filter(models.Submission.visible != False).offset(offset).limit(limit).all()
    return submissions

def get_crossings(db: Session, limit_offset: Tuple[int, int]):
    limit, offset = limit_offset
    submissions = db.query(models.Crossing).filter(models.Crossing.visible != False).filter(or_(or_(models.Crossing.type=="traffic_signals",models.Crossing.updated_type=="trafic_signals"),and_(models.Crossing.type=="",models.Crossing.updated_type==None))).all()
    return submissions

def create_submission(db: Session, time:datetime, lat:float,lon:float,tags:Dict[str, Any])-> models.Submission:
    print("tags")
    print(tags['Cyclelane'])
    db_submission =  models.Submission(
      lat=lat,
      lon=lon,
      time=time,
      tag_cycle = tags['Cyclelane'],
      tag_corner=False,
      tag_dropped=tags['Dropped curb'],
      tag_pavement=tags['Double Yellow'],
      tag_double_yellow=tags['Double Yellow']
    )

    db.add(db_submission)
    db.commit()
    # _sync_pending_achievements(db, db_submission)
    db.refresh(db_submission)

    #once uploaded: save the file

    return db_submission

def create_crossing(db:Session, id:int, lat:float,lon:float,type_:str)->models.Crossing:
    print("Creating Crossing")

    db_submission = models.Crossing( 
        id=id,
        lat=lat,
        lon=lon,
        type=type_)

    db.add(db_submission)
    db.commit()
    # _sync_pending_achievements(db, db_submission)
    db.refresh(db_submission)

def set_time(db:Session, id: int, time:int)->models.Crossing:
    db_submission = db.query(models.Crossing).filter_by(id=id).first()
    print("got submission")
    db_submission.time = time
    print("updated time")
    db.commit()
    print("updated time2")
    db.refresh(db_submission)
    print("updated time3")
    return db_submission

def set_type(db:Session, id: int, type:bool):
    db_submission = db.query(models.Crossing).filter_by(id=id).first()
    if(type):   
        db_submission.updated_type = "traffic_signals"
    else:
        db_submission.updated_type = "unmarked"

    db.commit()
    db.refresh(db_submission)
    return db_submission

def set_visibility(db: Session, id: int, visibility:bool):
    db_submission = db.query(models.Submission).filter_by(id=id).first()
    db_submission.visible = visibility
    db.commit()
    db.refresh(db_submission)
    return db_submission
