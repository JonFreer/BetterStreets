import string
import uuid
from datetime import datetime
from typing import Any, Dict, Optional, Union
from xmlrpc.client import boolean

from pyparsing import stringStart

from pydantic import BaseModel


class UserBase(BaseModel):
    discord_id: Optional[str]
    discord_username: Optional[str]

    twitter_id: Optional[str]
    twitter_username: Optional[str]


class UserCreate(UserBase):
    pass

class Submission(BaseModel):

    id:uuid.UUID
    lat:float
    lon:float
    time:datetime
    tag_cycle:bool
    tag_corner:bool
    tag_dropped:bool
    tag_pavement:bool
    tag_double_yellow:bool

class Crossing(BaseModel):
    id:uuid.UUID
    osm_id:Optional[int]
    lat:float
    lon:float
    waiting_times:Optional[str]
    crossing_times:Optional[str]
    notes:Optional[str]
    type:Optional[str]
    updated_type:Optional[str]
    notes:Optional[str]

    class Config:
        orm_mode = True


class User(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class Token(BaseModel):
    id: uuid.UUID
    created_at: datetime

    class Config:
        orm_mode = True


class AchievementBase(BaseModel):
    name: str
    tags: Dict[str, Any] = {}


class AchievementCreateForUser(AchievementBase):
    pass


class AchievementCreate(AchievementBase):
    owner_ref: Union[uuid.UUID, str]


class Achievement(AchievementBase):
    id: uuid.UUID
    owner_id: Optional[uuid.UUID]

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class PendingAchievementBase(BaseModel):
    id: uuid.UUID
    user_reference: str


class PendingAchievement(PendingAchievementBase):
    class Config:
        orm_mode = True

class Achievement_External(BaseModel):
    msg:str

# class Tags