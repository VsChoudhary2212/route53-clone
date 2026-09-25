from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)

    hosted_zones = relationship(
        "HostedZone",
        back_populates="owner",
        cascade="all, delete-orphan",
    )


class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False, index=True)
    zone_type = Column(String(50), default="Public")
    description = Column(Text, nullable=True)

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    owner = relationship(
        "User",
        back_populates="hosted_zones",
    )

    records = relationship(
        "DNSRecord",
        back_populates="hosted_zone",
        cascade="all, delete-orphan",
    )


class DNSRecord(Base):
    __tablename__ = "dns_records"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False, index=True)
    record_type = Column(String(10), nullable=False, index=True)
    ttl = Column(Integer, default=300)
    value = Column(Text, nullable=False)

    hosted_zone_id = Column(
        Integer,
        ForeignKey("hosted_zones.id"),
        nullable=False,
    )

    hosted_zone = relationship(
        "HostedZone",
        back_populates="records",
    )