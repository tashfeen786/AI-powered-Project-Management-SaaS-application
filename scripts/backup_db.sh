#!/bin/bash
# Backup PostgreSQL Database
# Run this via a daily cron job (e.g. 0 2 * * * /path/to/backup_db.sh)

set -e

# Load environment variables
if [ -f "../.env.production" ]; then
    export $(cat ../.env.production | grep -v '#' | awk '/=/ {print $1}')
fi

BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="db_backup_${DATE}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Starting database backup..."

# Assuming Postgres container name is 'postgres_db' if hosted on docker, 
# or running directly via pg_dump if DB is remote (RDS, Supabase)
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL is not set."
    exit 1
fi

pg_dump -d "$DATABASE_URL" | gzip > "${BACKUP_DIR}/${FILENAME}"

echo "Backup successful: ${BACKUP_DIR}/${FILENAME}"

# Optional: Upload to S3
# aws s3 cp "${BACKUP_DIR}/${FILENAME}" s3://your-backup-bucket/db_backups/

# Cleanup backups older than 7 days
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -delete
echo "Old backups cleaned up."
