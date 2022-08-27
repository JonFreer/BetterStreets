from email.policy import default
from enum import unique
import uuid
from typing import Any, List
from xmlrpc.client import boolean

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String,Float,Integer,BigInteger
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import Query, relationship
from sqlalchemy.sql import functions as func

from .db import Base, engine

class Submission(Base):
    __tablename__ = "submission"

    id= Column( 
        Integer, primary_key=True, index=True, nullable=False
    ) #find the correct type

class Crossing(Base):
    __tablename__ = "crossings"

    id= Column( 
        BigInteger, primary_key=True, index=True, nullable=False
    ) #find the correct type

    time =  Column(Integer,nullable=True)
    lat = Column(Float,nullable=False)
    lon = Column(Float,nullable=False)
    type = Column(String,nullable=True)
    updated_type = Column(String,nullable=True)
    notes = Column(String,nullable=True)
    visible = Column(Boolean,default=True)

# class User(Base):
#     __tablename__ = "users"

#     id: uuid.UUID = Column(
#         UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4
#     )
#     created_at = Column(DateTime, server_default=func.now())
#     updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

#     discord_id = Column(String, unique=True, index=True)
#     discord_username = Column(String, unique=True, index=True)

#     twitter_id = Column(String, unique=True, index=True)
#     twitter_username = Column(String, unique=True, index=True)

#     tokens: List["Token"] = relationship(
#         "Token", back_populates="owner", uselist=True, cascade="all, delete"
#     )
#     achievements: Query = relationship(
#         "Achievement", back_populates="owner", lazy="dynamic", cascade="all, delete"
#     )


# class Token(Base):
#     __tablename__ = "tokens"

#     id: uuid.UUID = Column(
#         UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4
#     )
#     created_at = Column(DateTime, server_default=func.now())

#     admin = Column(Boolean, default=False)

#     owner_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("users.id"))
#     owner: User = relationship("User", back_populates="tokens", uselist=False)


# class Achievement(Base):
#     __tablename__ = "achievements"

#     id: uuid.UUID = Column(
#         UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4
#     )
#     created_at = Column(DateTime, server_default=func.now())
#     updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

#     name = Column(String)
#     tags: Any = Column(MutableDict.as_mutable(JSONB))

#     owner_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("users.id"))
#     owner: User = relationship("User", back_populates="achievements", uselist=False)

#     pending: "PendingAchievement" = relationship(
#         "PendingAchievement",
#         back_populates="achievement",
#         uselist=False,
#         cascade="all, delete",
#     )


# class PendingAchievement(Base):
#     __tablename__ = "pending_achievements"

#     id: uuid.UUID = Column(
#         UUID(as_uuid=True), ForeignKey("achievements.id"), primary_key=True
#     )
#     achievement: Achievement = relationship(
#         "Achievement", back_populates="pending", uselist=False, foreign_keys=[id]
#     )

#     user_reference = Column(String)

def init():
    Base.metadata.create_all(bind=engine)