from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import HostedZone
from ..schemas import (
    HostedZoneCreate,
    HostedZoneResponse,
    HostedZoneUpdate,
)

router = APIRouter(
    prefix="/hosted-zones",
    tags=["Hosted Zones"],
)


@router.get("/", response_model=list[HostedZoneResponse])
def get_hosted_zones(
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(HostedZone)

    if search:
        query = query.filter(
            HostedZone.name.ilike(f"%{search}%")
        )

    zones = query.order_by(HostedZone.id.desc()).all()

    return [
        HostedZoneResponse(
            id=zone.id,
            name=zone.name,
            zone_type=zone.zone_type,
            description=zone.description,
            record_count=len(zone.records),
        )
        for zone in zones
    ]


@router.get("/{zone_id}", response_model=HostedZoneResponse)
def get_hosted_zone(
    zone_id: int,
    db: Session = Depends(get_db),
):
    zone = (
        db.query(HostedZone)
        .filter(HostedZone.id == zone_id)
        .first()
    )

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    return HostedZoneResponse(
        id=zone.id,
        name=zone.name,
        zone_type=zone.zone_type,
        description=zone.description,
        record_count=len(zone.records),
    )


@router.post(
    "/",
    response_model=HostedZoneResponse,
    status_code=201,
)
def create_hosted_zone(
    data: HostedZoneCreate,
    db: Session = Depends(get_db),
):
    existing = (
        db.query(HostedZone)
        .filter(HostedZone.name == data.name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Hosted zone already exists",
        )

    zone = HostedZone(
        name=data.name,
        zone_type=data.zone_type,
        description=data.description,
    )

    db.add(zone)
    db.commit()
    db.refresh(zone)

    return HostedZoneResponse(
        id=zone.id,
        name=zone.name,
        zone_type=zone.zone_type,
        description=zone.description,
        record_count=0,
    )


@router.put(
    "/{zone_id}",
    response_model=HostedZoneResponse,
)
def update_hosted_zone(
    zone_id: int,
    data: HostedZoneUpdate,
    db: Session = Depends(get_db),
):
    zone = (
        db.query(HostedZone)
        .filter(HostedZone.id == zone_id)
        .first()
    )

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    updates = data.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(zone, field, value)

    db.commit()
    db.refresh(zone)

    return HostedZoneResponse(
        id=zone.id,
        name=zone.name,
        zone_type=zone.zone_type,
        description=zone.description,
        record_count=len(zone.records),
    )


@router.delete("/{zone_id}")
def delete_hosted_zone(
    zone_id: int,
    db: Session = Depends(get_db),
):
    zone = (
        db.query(HostedZone)
        .filter(HostedZone.id == zone_id)
        .first()
    )

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    db.delete(zone)
    db.commit()

    return {
        "message": "Hosted zone deleted successfully"
    }