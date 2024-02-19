import {
    DashboardOutlined,
    UserOutlined,
    UsergroupAddOutlined,
    SolutionOutlined,
    PayCircleOutlined,
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
        id: "client",
        name: "Client",
        path: "/app/client",
        icon: <UserOutlined />,
    },
    {
        id: "profile",
        name: "Profile",
        icon: <SolutionOutlined />,
        path: "/app/profile",
    },
    {
        id: "transactions",
        name: "Transactions",
        icon: <PayCircleOutlined />,
        path: "/app/transactions",
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
