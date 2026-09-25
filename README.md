# AWS Route 53 Clone

A full-stack clone of the AWS Route 53 management experience built for a campus SDE/Full-Stack assignment.

## Features

- Mock authentication
- Login and logout
- Session persistence
- Hosted Zone CRUD
- DNS Record CRUD
- SQLite persistence
- Hosted Zone search
- DNS Record search
- DNS Record type filtering
- Create/Edit/Delete modals
- AWS-style management console UI
- Coming Soon sections for additional Route 53 services

## Supported DNS Record Types

- A
- AAAA
- CNAME
- TXT
- MX
- NS
- PTR
- SRV
- CAA

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Lucide React

### Backend

- FastAPI
- Python
- SQLAlchemy

### Database

- SQLite

## Architecture

```text
Browser
   |
   v
Next.js Frontend
   |
   | REST API
   v
FastAPI Backend
   |
   v
SQLAlchemy
   |
   v
SQLite
## Database Schema

### users
- id: Integer, Primary Key
- name: String
- email: String, Unique

### hosted_zones
- id: Integer, Primary Key
- name: String
- zone_type: String
- description: String, Nullable
- user_id: Integer, Foreign Key → users.id

### dns_records
- id: Integer, Primary Key
- name: String
- record_type: String
- ttl: Integer
- value: Text
- hosted_zone_id: Integer, Foreign Key → hosted_zones.id

Hosted zones have a one-to-many relationship with DNS records.
Deleting a hosted zone also removes its associated DNS records.

## API Overview

### Hosted Zones

| Method | Endpoint | Description |
|---|---|---|
| GET | `/hosted-zones/` | List hosted zones |
| GET | `/hosted-zones/{zone_id}` | Get a hosted zone |
| POST | `/hosted-zones/` | Create a hosted zone |
| PUT | `/hosted-zones/{zone_id}` | Update a hosted zone |
| DELETE | `/hosted-zones/{zone_id}` | Delete a hosted zone |

### DNS Records

| Method | Endpoint | Description |
|---|---|---|
| GET | `/hosted-zones/{zone_id}/records/` | List DNS records |
| GET | `/hosted-zones/{zone_id}/records/{record_id}` | Get a DNS record |
| POST | `/hosted-zones/{zone_id}/records/` | Create a DNS record |
| PUT | `/hosted-zones/{zone_id}/records/{record_id}` | Update a DNS record |
| DELETE | `/hosted-zones/{zone_id}/records/{record_id}` | Delete a DNS record |

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | API health check |

## Authentication

Authentication is mocked on the frontend for this assignment.

- Login accepts a non-empty email and password.
- A mock user session is stored in browser localStorage.
- Protected pages redirect unauthenticated users to the login page.
- Logout removes the stored session.

No AWS credentials or external AWS services are required.

## Local Setup

### Backend

```bash
cd backend

python -m venv venv