"""Make planning requirement_id nullable

Revision ID: h94ff5477cfb
Revises: g93ff5477cfb
Create Date: 2026-08-19 20:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'h94ff5477cfb'
down_revision: Union[str, Sequence[str], None] = 'g93ff5477cfb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('sprint_plans')]
    if 'requirement_id' in columns:
        col_info = next(col for col in inspector.get_columns('sprint_plans') if col['name'] == 'requirement_id')
        if not col_info.get('nullable', False):
            op.alter_column('sprint_plans', 'requirement_id',
                       existing_type=sa.UUID(),
                       nullable=True)


def downgrade() -> None:
    op.alter_column('sprint_plans', 'requirement_id',
               existing_type=sa.UUID(),
               nullable=False)
