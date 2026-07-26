import asyncio
import asyncpg
import os
import sys
import time

async def check_db():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("DATABASE_URL is not set.")
        sys.exit(1)
        
    # asyncpg format: postgresql://user:password@host:port/db
    # Convert postgresql+asyncpg to postgresql if needed
    if database_url.startswith("postgresql+asyncpg://"):
        database_url = database_url.replace("postgresql+asyncpg://", "postgresql://")

    max_retries = 30
    delay = 2

    for i in range(max_retries):
        try:
            conn = await asyncpg.connect(database_url)
            await conn.close()
            print("Database is ready!")
            sys.exit(0)
        except Exception as e:
            print(f"Database not ready, waiting {delay} seconds... ({i+1}/{max_retries})")
            time.sleep(delay)
            
    print("Failed to connect to the database after retries.")
    sys.exit(1)

if __name__ == "__main__":
    asyncio.run(check_db())
