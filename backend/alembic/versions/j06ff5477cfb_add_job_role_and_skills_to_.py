"""Add job_role and skills to organization_members

Revision ID: j06ff5477cfb
Revises: i05ff5477cfb
Create Date: 2026-08-19 20:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'j06ff5477cfb'
down_revision: Union[str, Sequence[str], None] = 'i05ff5477cfb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('organization_members', sa.Column('job_role', sa.String(length=100), nullable=True))
    op.add_column('organization_members', sa.Column('skills', postgresql.JSONB(astext_type=sa.Text()), nullable=True))


def downgrade() -> None:
    op.drop_column('organization_members', 'skills')
    op.drop_column('organization_members', 'job_role')
