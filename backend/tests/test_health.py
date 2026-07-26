import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient):
    """
    Ensure the health endpoint is reachable.
    Since this uses an in-memory SQLite for testing, DB should be ok.
    Redis will fail unless mocked, but we expect a 503 or 200 depending on environment setup.
    """
    response = await async_client.get("/api/v1/health")
    
    # It might return 503 if Redis isn't running in the test env, 
    # so we assert the structure rather than just a 200.
    assert response.status_code in [200, 503]
    
    data = response.json()
    assert "status" in data
    assert "database" in data
    assert "redis" in data
