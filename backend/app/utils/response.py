from typing import Any, Optional, Generic, TypeVar, List
from pydantic import BaseModel

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None

class PaginatedData(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    limit: int

def success_response(data: Any = None, message: str = "Success") -> StandardResponse:
    return StandardResponse(success=True, message=message, data=data)

def error_response(message: str, data: Any = None) -> StandardResponse:
    return StandardResponse(success=False, message=message, data=data)

def paginated_response(items: List[Any], total: int, page: int, limit: int, message: str = "Success") -> StandardResponse:
    data = PaginatedData(items=items, total=total, page=page, limit=limit)
    return StandardResponse(success=True, message=message, data=data)
