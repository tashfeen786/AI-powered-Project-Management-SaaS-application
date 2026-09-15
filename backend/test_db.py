import asyncio
from app.db.session import engine
from sqlalchemy import text

async def test():
    try:
        async with engine.connect() as c:
            r = await c.execute(text('SELECT 1'))
            print('DB OK:', r.scalar())
            
            # Check pgvector
            r2 = await c.execute(text("SELECT extname FROM pg_extension WHERE extname='vector'"))
            row = r2.first()
            print('pgvector:', 'INSTALLED' if row else 'NOT INSTALLED')
            
            # Check tables
            r3 = await c.execute(text("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"))
            tables = [row[0] for row in r3.fetchall()]
            print('Tables:', tables)
    except Exception as e:
        print('DB ERROR:', e)
    finally:
        await engine.dispose()

asyncio.run(test())
