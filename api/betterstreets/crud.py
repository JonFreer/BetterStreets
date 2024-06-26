
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
    submissions = db.query(models.Crossing).filter(models.Crossing.visible != False).filter(or_(or_(models.Crossing.type.contains("traffic_signals"),models.Crossing.updated_type=="traffic_signals"),and_(models.Crossing.type=="",models.Crossing.updated_type==None))).all()
    return submissions

def create_submission(db: Session, time:datetime, lat:float,lon:float,tags:Dict[str, Any]):
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

    try:
        db.add(db_submission)
        db.commit()
        # _sync_pending_achievements(db, db_submission)
        db.refresh(db_submission)
        return db_submission
    except:
        #once uploaded: save the file
        return None
    

def create_crossing(db:Session, osm_id:int, lat:float,lon:float,type_:str, ward_name:str)->models.Crossing:
    print("Creating Crossing")

    db_submission = models.Crossing( 
        osm_id=osm_id,
        lat=lat,
        lon=lon,
        type=type_,
        ward=ward_name)

    db.add(db_submission)
    db.commit()
    # _sync_pending_achievements(db, db_submission)
    db.refresh(db_submission)
    return db_submission

def set_time_and_notes(db:Session, id: uuid, waiting_time:int,cossing_time :int,notes:str)->models.Crossing:
    db_submission = db.query(models.Crossing).filter_by(id=id).first()
    print("got submission")
    if(db_submission.waiting_times == None):
        db_submission.waiting_times = str(waiting_time)
    else:
        db_submission.waiting_times = db_submission.waiting_times + ","+str(waiting_time)

    if(db_submission.crossing_times == None):
        db_submission.crossing_times = str(cossing_time)
    else:
        db_submission.crossing_times = db_submission.crossing_times + ","+str(cossing_time)

    if(db_submission.notes == None):
        db_submission.notes = str(notes)
    else:
        db_submission.notes = db_submission.notes + ","+str(notes)


    print("updated time")
    db.commit()
    print("updated time2")
    db.refresh(db_submission)
    print("updated time3")
    return db_submission

def set_type(db:Session, id: uuid, type:bool):
    db_submission = db.query(models.Crossing).filter_by(id=id).first()
    if(type):   
        db_submission.updated_type = "traffic_signals"
    else:
        db_submission.updated_type = "unmarked"

    db.commit()
    db.refresh(db_submission)
    return db_submission

def set_visibility(db: Session, id: uuid, visibility:bool):
    db_submission = db.query(models.Submission).filter_by(id=id).first()
    db_submission.visible = visibility
    db.commit()
    db.refresh(db_submission)
    return db_submission

