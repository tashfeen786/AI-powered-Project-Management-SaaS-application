from enum import Enum

class Permission(str, Enum):
    VIEW_PROJECTS = "view_projects"
    CREATE_PROJECTS = "create_projects"

ROLE_PERMISSIONS = {
    "pm": [
        Permission.VIEW_PROJECTS, Permission.CREATE_PROJECTS
    ],
    "owner": [p.value for p in Permission]
}

def has_permission(role: str, permission: Permission) -> bool:
    role_lower = role.lower()
    perm_value = permission.value
    print(f"Role: {role_lower}, Permission: {perm_value}")
    print(f"List: {ROLE_PERMISSIONS[role_lower]}")
    return perm_value in ROLE_PERMISSIONS[role_lower]

print("owner:", has_permission("owner", Permission.VIEW_PROJECTS))
print("pm:", has_permission("pm", Permission.VIEW_PROJECTS))
