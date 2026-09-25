from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import hosted_zones, records

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Route53 Clone API",
    description="Backend API for AWS Route53 Clone",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hosted_zones.router)
app.include_router(records.router)


@app.get("/")
def root():
    return {
        "message": "Route53 Clone API is running",
        "version": "1.0.0",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}