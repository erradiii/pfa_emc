# EMC Helpline CRM — DevOps & Cloud Deployment

EMC Helpline is a web CRM designed to manage cyberviolence reports, their processing workflow, partner access and reporting statistics.

This repository also demonstrates the DevOps transformation of the application: containerization, CI/CD, cloud deployment, secure AWS authentication and database backup/recovery.

---

## Application Stack

- Frontend: React + Vite
- Backend: Django REST Framework
- Database: PostgreSQL
- Authentication: JWT
- Reverse Proxy: Nginx
- Python Application Server: Gunicorn
- Containers: Docker
- Orchestration: Docker Compose

---

## DevOps Stack

- Git / GitHub
- GitHub Actions
- GitHub Container Registry (GHCR)
- AWS EC2
- AWS IAM
- GitHub OIDC
- AWS Systems Manager (SSM)
- Amazon S3
- Docker Compose
- Nginx

---

## Architecture

```mermaid
flowchart TD

    DEV[Developer] -->|git push| GH[GitHub Repository]

    GH --> CI[GitHub Actions CI]

    CI --> TESTS[Backend Tests & Checks]
    CI --> FRONTBUILD[React Production Build]
    CI --> DOCKERBUILD[Docker Image Builds]

    TESTS --> GHCR
    FRONTBUILD --> GHCR
    DOCKERBUILD --> GHCR[GitHub Container Registry]

    GHCR --> CD[GitHub Actions CD]

    CD --> OIDC[GitHub OIDC]
    OIDC --> IAM[AWS IAM Deploy Role]
    IAM --> SSM[AWS Systems Manager]

    SSM --> EC2[AWS EC2]

    EC2 --> COMPOSE[Docker Compose]

    COMPOSE --> NGINX[Nginx + React]
    COMPOSE --> DJANGO[Gunicorn + Django]
    COMPOSE --> DB[PostgreSQL]

    NGINX -->|/api| DJANGO
    DJANGO --> DB

    DB --> BACKUP[pg_dump + gzip]
    BACKUP --> S3[Amazon S3 Backups]
