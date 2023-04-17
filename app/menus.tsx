import {
    DashboardOutlined,
    HomeOutlined,
    UploadOutlined,
    UserOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";

export interface IMenu {
    id: string;
    name: string;
    path?: string;
    icon?: React.ReactNode;
    children?: IMenu[];
    roles?: string[];
}

export const PORTAL_MENU: IMenu[] = [
    {
        id: "dashboard",
        name: "Dashboard",
        path: "/app/dashboard",
        icon: <DashboardOutlined />,
    },
    {
        id: "company",
        name: "Company",
        icon: <HomeOutlined />,
        path: "/app/company",
    },
    {
        id: "data-entry",
        name: "Data Entry",
        icon: <UploadOutlined />,
        path: "/app/data-entry",
    },
    {
        id: "user-management",
        name: "User Management",
        icon: <UserOutlined />,
        path: "/app/user-management",
    },
    {
        id: "role-management",
        name: "Role Management",
        icon: <UsergroupAddOutlined />,
        path: "/app/role-management",
    },
];
