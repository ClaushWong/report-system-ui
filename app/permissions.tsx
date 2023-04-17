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
        id: "company",
        name: "Company",
        permissions: [
            {
                id: "company-create",
                name: "Create",
            },
            {
                id: "company-edit",
                name: "Edit",
            },
            {
                id: "company-delete",
                name: "Delete",
            },
            {
                id: "company-filter",
                name: "Filter",
            },
        ],
    },
    {
        id: "data-entry",
        name: "Data Entry",
        permissions: [
            {
                id: "data-entry-create",
                name: "Create",
            },
            {
                id: "data-entry-edit",
                name: "Edit",
            },
            {
                id: "data-entry-delete",
                name: "Delete",
            },
            {
                id: "data-entry-filter",
                name: "Filter",
            },
            {
                id: "data-entry-export",
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
