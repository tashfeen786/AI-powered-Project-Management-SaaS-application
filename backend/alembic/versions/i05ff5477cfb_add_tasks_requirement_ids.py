"""Add requirement_ids and phase to tasks

Revision ID: i05ff5477cfb
Revises: h94ff5477cfb
Create Date: 2026-08-19 20:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'i05ff5477cfb'
down_revision: Union[str, Sequence[str], None] = 'h94ff5477cfb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('tasks', sa.Column('requirement_ids', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column('tasks', sa.Column('phase', sa.String(length=255), nullable=True))


def downgrade() -> None:
    op.drop_column('tasks', 'phase')
    op.drop_column('tasks', 'requirement_ids')
