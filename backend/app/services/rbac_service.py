from enum import Enum
from typing import List

class Permission(str, Enum):
    VIEW_PROJECTS = "view_projects"
    CREATE_PROJECTS = "create_projects"
    EDIT_PROJECTS = "edit_projects"
    DELETE_PROJECTS = "delete_projects"
    MANAGE_TEAM = "manage_team"
    INVITE_MEMBERS = "invite_members"
    MANAGE_DOCUMENTS = "manage_documents"
    MANAGE_SETTINGS = "manage_settings"
    MANAGE_BILLING = "manage_billing"
    USE_AI = "use_ai"
    GENERATE_SRS = "generate_srs"
    GENERATE_SPRINT_PLAN = "generate_sprint_plan"
    APPROVE_DRAFTS = "approve_drafts"
    DELETE_ORGANIZATION = "delete_organization"

# Role Definitions
ROLE_PERMISSIONS = {
    "owner": [p.value for p in Permission],
    
    "admin": [p.value for p in Permission if p != Permission.DELETE_ORGANIZATION],
    
    "pm": [
        Permission.VIEW_PROJECTS, Permission.CREATE_PROJECTS, Permission.EDIT_PROJECTS,
        Permission.MANAGE_TEAM, Permission.INVITE_MEMBERS, Permission.MANAGE_DOCUMENTS,
        Permission.USE_AI, Permission.GENERATE_SRS, Permission.GENERATE_SPRINT_PLAN, Permission.APPROVE_DRAFTS
    ],
    
    "developer": [
        Permission.VIEW_PROJECTS, Permission.EDIT_PROJECTS, Permission.USE_AI
    ],
    
    "designer": [
        Permission.VIEW_PROJECTS, Permission.EDIT_PROJECTS, Permission.USE_AI
    ],
    
    "qa": [
        Permission.VIEW_PROJECTS, Permission.EDIT_PROJECTS, Permission.USE_AI, Permission.APPROVE_DRAFTS
    ],
    
    "viewer": [
        Permission.VIEW_PROJECTS
    ]
}

class RBACService:
    @staticmethod
    def has_permission(role: str, permission: str | Permission) -> bool:
        """
        Check if a role has a specific permission.
        """
        role_lower = role.lower()
        if role_lower not in ROLE_PERMISSIONS:
            return False
            
        perm_value = permission.value if isinstance(permission, Permission) else permission
        return perm_value in ROLE_PERMISSIONS[role_lower]
        
    @staticmethod
    def get_permissions_for_role(role: str) -> List[str]:
        """
        Return the list of all permissions a role has.
        """
        return ROLE_PERMISSIONS.get(role.lower(), [])
