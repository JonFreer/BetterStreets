import string
import uuid
from datetime import datetime
from typing import Any, Dict, Optional, Union
from xmlrpc.client import boolean

from pyparsing import stringStart

from pydantic import BaseModel


class Crossing(BaseModel):
    id:uuid.UUID
    osm_id:Optional[int]
    lat:float
    lon:float
    ward:Optional[str]
    waiting_times:Optional[str]
    crossing_times:Optional[str]
    notes:Optional[str]
    type:Optional[str]
    updated_type:Optional[str]
    notes:Optional[str]

    class Config:
        orm_mode = True

# class Ward(BaseModel):
#     name: str
#     complete: str


#     class Config:
#         orm_mode = True



# class Tags