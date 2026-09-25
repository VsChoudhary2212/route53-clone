from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import DNSRecord, HostedZone
from ..schemas import (
    DNSRecordCreate,
    DNSRecordResponse,
    DNSRecordUpdate,
)

router = APIRouter(
    prefix="/hosted-zones/{zone_id}/records",
    tags=["DNS Records"],
)

SUPPORTED_RECORD_TYPES = {
    "A",
    "AAAA",
    "CNAME",
    "TXT",
    "MX",
    "NS",
    "PTR",
    "SRV",
    "CAA",
}


def get_zone_or_404(zone_id: int, db: Session):
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

    return zone


@router.get("/", response_model=list[DNSRecordResponse])
def get_records(
    zone_id: int,
    search: Optional[str] = Query(default=None),
    record_type: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    get_zone_or_404(zone_id, db)

    query = (
        db.query(DNSRecord)
        .filter(DNSRecord.hosted_zone_id == zone_id)
    )

    if search:
        query = query.filter(
            DNSRecord.name.ilike(f"%{search}%")
        )

    if record_type:
        query = query.filter(
            DNSRecord.record_type == record_type.upper()
        )

    return query.order_by(DNSRecord.id.desc()).all()


@router.get("/{record_id}", response_model=DNSRecordResponse)
def get_record(
    zone_id: int,
    record_id: int,
    db: Session = Depends(get_db),
):
    get_zone_or_404(zone_id, db)

    record = (
        db.query(DNSRecord)
        .filter(
            DNSRecord.id == record_id,
            DNSRecord.hosted_zone_id == zone_id,
        )
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="DNS record not found",
        )

    return record


@router.post(
    "/",
    response_model=DNSRecordResponse,
    status_code=201,
)
def create_record(
    zone_id: int,
    data: DNSRecordCreate,
    db: Session = Depends(get_db),
):
    get_zone_or_404(zone_id, db)

    record_type = data.record_type.upper()

    if record_type not in SUPPORTED_RECORD_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported record type. "
                f"Supported types: {', '.join(sorted(SUPPORTED_RECORD_TYPES))}"
            ),
        )

    record = DNSRecord(
        name=data.name,
        record_type=record_type,
        ttl=data.ttl,
        value=data.value,
        hosted_zone_id=zone_id,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@router.put(
    "/{record_id}",
    response_model=DNSRecordResponse,
)
def update_record(
    zone_id: int,
    record_id: int,
    data: DNSRecordUpdate,
    db: Session = Depends(get_db),
):
    get_zone_or_404(zone_id, db)

    record = (
        db.query(DNSRecord)
        .filter(
            DNSRecord.id == record_id,
            DNSRecord.hosted_zone_id == zone_id,
        )
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="DNS record not found",
        )

    updates = data.model_dump(exclude_unset=True)

    if "record_type" in updates:
        record_type = updates["record_type"].upper()

        if record_type not in SUPPORTED_RECORD_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Unsupported record type",
            )

        updates["record_type"] = record_type

    for field, value in updates.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)

    return record


@router.delete("/{record_id}")
def delete_record(
    zone_id: int,
    record_id: int,
    db: Session = Depends(get_db),
):
    get_zone_or_404(zone_id, db)

    record = (
        db.query(DNSRecord)
        .filter(
            DNSRecord.id == record_id,
            DNSRecord.hosted_zone_id == zone_id,
        )
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="DNS record not found",
        )

    db.delete(record)
    db.commit()

    return {
        "message": "DNS record deleted successfully"
    }