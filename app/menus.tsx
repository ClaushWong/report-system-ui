import {
    DashboardOutlined,
    HomeOutlined,
    UploadOutlined,
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
];
