
from datetime import datetime
import uuid
from typing import Any, Dict, List, Optional, Tuple, Union

from sqlalchemy import or_
from sqlalchemy.orm import Session

from . import config, models

def get_submissions(db: Session, limit_offset: Tuple[int, int]):
    limit, offset = limit_offset
    submissions = db.query(models.Submission).filter(models.Submission.visible != False).offset(offset).limit(limit).all()
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

def set_visibility(db: Session, id: uuid.UUID, visibility:bool):
    db_submission = db.query(models.Submission).filter_by(id=id).first()
    db_submission.visible = visibility
    db.commit()
    db.refresh(db_submission)
    return db_submission
