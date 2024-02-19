export interface IPermissionItems {
    id: string;
    name: string;
}

export interface IPermissions {
    id: string;
    name: string;
    permissions: IPermissionItems[];
}

export const PORTAL_PERMISSIONS: IPermissions[] = [
    {
        id: "dashboard",
        name: "Dashboard",
        permissions: [
            {
                id: "dashboard-export",
                name: "Export",
            },
            {
                id: "dashboard-filter",
                name: "Filter",
            },
        ],
    },
    {
        id: "client",
        name: "Client",
        permissions: [
            {
                id: "client-create",
                name: "Create",
            },
            {
                id: "client-edit",
                name: "Edit",
            },
            {
                id: "client-delete",
                name: "Delete",
            },
            {
                id: "client-filter",
                name: "Filter",
            },
        ],
    },
    {
        id: "profile",
        name: "Profile",
        permissions: [
            {
                id: "profile-create",
                name: "Create",
            },
            {
                id: "profile-edit",
                name: "Edit",
            },
            {
                id: "profile-delete",
                name: "Delete",
            },
            {
                id: "profile-filter",
                name: "Filter",
            },
        ],
    },
    {
        id: "transactions",
        name: "Transactions",
        permissions: [
            {
                id: "transactions-create",
                name: "Create",
            },
            {
                id: "transactions-edit",
                name: "Edit",
            },
            {
                id: "transactions-delete",
                name: "Delete",
            },
            {
                id: "transactions-filter",
                name: "Filter",
            },
            {
                id: "transactions-export",
                name: "Export",
            },
        ],
    },
    {
        id: "user-management",
        name: "User Management",
        permissions: [
            {
                id: "user-management-create",
                name: "Create",
            },
            {
                id: "user-management-edit",
                name: "Edit",
            },
            {
                id: "user-management-delete",
                name: "Delete",
            },
            {
                id: "user-management-filter",
                name: "Filter",
            },
        ],
    },
    {
        id: "role-management",
        name: "Role Management",
        permissions: [
            {
                id: "role-management-create",
                name: "Create",
            },
            {
                id: "role-management-edit",
                name: "Edit",
            },
            {
                id: "role-management-delete",
                name: "Delete",
            },
            {
                id: "role-management-filter",
                name: "Filter",
            },
        ],
    },
];
