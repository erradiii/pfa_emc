#!/bin/bash

set -e

PATH=/usr/local/bin:/usr/bin:/bin

PROJECT_DIR="/home/ubuntu/emc-prod"
BACKUP_DIR="$PROJECT_DIR/backups"
BUCKET="${BACKUP_BUCKET:-emc-prod-backups-version0}"

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/emc_db_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

cd "$PROJECT_DIR"

echo "Starting PostgreSQL backup..."

docker compose -f docker-compose.prod.yml exec -T db \
  sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  > "$BACKUP_FILE"

if [ ! -s "$BACKUP_FILE" ]; then
    echo "Backup failed: file is empty."
    exit 1
fi

gzip "$BACKUP_FILE"

aws s3 cp "$BACKUP_FILE.gz" \
  "s3://$BUCKET/postgres/$(basename "$BACKUP_FILE.gz")"

echo "Backup uploaded successfully."

find "$BACKUP_DIR" \
  -type f \
  -name "*.sql.gz" \
  -mtime +7 \
  -delete

echo "Backup completed."
