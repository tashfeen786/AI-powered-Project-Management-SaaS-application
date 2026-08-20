import asyncio
import asyncpg

async def main():
    conn = await asyncpg.connect('postgresql://postgres.kzmpwztseingxqimkgiz:Tashfeen%40247@aws-1-ap-south-1.pooler.supabase.com:5432/postgres')
    rows = await conn.fetch('SELECT email FROM users LIMIT 5')
    for row in rows:
        print(row['email'])
    await conn.close()

if __name__ == '__main__':
    asyncio.run(main())
