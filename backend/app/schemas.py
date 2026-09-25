from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class HostedZoneBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    zone_type: str = "Public"
    description: Optional[str] = None


class HostedZoneCreate(HostedZoneBase):
    pass


class HostedZoneUpdate(BaseModel):
    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    zone_type: Optional[str] = None
    description: Optional[str] = None


class HostedZoneResponse(HostedZoneBase):
    id: int
    record_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class DNSRecordBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    record_type: str
    ttl: int = Field(default=300, ge=0)
    value: str = Field(min_length=1)


class DNSRecordCreate(DNSRecordBase):
    pass


class DNSRecordUpdate(BaseModel):
    name: Optional[str] = None
    record_type: Optional[str] = None
    ttl: Optional[int] = Field(default=None, ge=0)
    value: Optional[str] = None


class DNSRecordResponse(DNSRecordBase):
    id: int
    hosted_zone_id: int

    model_config = ConfigDict(from_attributes=True)