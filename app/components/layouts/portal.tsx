import { useAppAuthStore } from "@/stores/index";
import { useLogout } from "@/stores/dispatcher";
import {
    Col,
    Dropdown,
    Layout,
    Menu,
    MenuProps,
    Row,
    Space,
    Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import {
    CopyrightOutlined,
    LogoutOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { api, ui } from "@/app/services";
import { IMenu, PORTAL_MENU } from "@/app/menus";
import { AuthGuard } from "../guards";

type Props = {
    children: any;
};

const SIDER_WIDTH = 240;

const Menus = () => {
    const router = useRouter();

    const toMenu = (menu: IMenu, inheritId: string = "") => {
        const key = `${inheritId}${menu.id}`;
        if (menu.children && menu.children.length > 0) {
            return (
                <Menu.SubMenu
                    title={menu.name}
                    key={`sub-${key}`}
                    icon={menu.icon}
                >
                    {menu.children.map((c) => toMenu(c, `${key}-`))}
                </Menu.SubMenu>
            );
        }
        return (
            <Menu.Item icon={menu.icon} key={key}>
                {menu.path && <Link href={menu.path}>{menu.name}</Link>}
                {!menu.path && menu.name}
            </Menu.Item>
        );
    };

    const pathname = router.pathname;

    const subMenusCheck = (menus: IMenu[], parent: string): any => {
        return menus
            .map((m) => {
                const key = `${parent}${m.id}`;
                if (m.path === pathname) {
                    return { ...m, menu_key: key };
                }
                if (m.children && m.children?.length > 0) {
                    return subMenusCheck(m.children, key);
                }
                return null;
            })
            .filter((v) => !!v);
    };

    const selectedKeys = PORTAL_MENU.map<any>((menu) => {
        if (new RegExp(pathname).test(menu?.path || "")) {
            return { ...menu, menu_key: menu.id };
        }
        if (menu.children && menu.children?.length > 0) {
            return subMenusCheck(menu.children, `${menu.id}-`);
        }
        return null;
    })
        .filter((v) => !!v)
        .flat(2)
        .map((d) => d.menu_key);

    return (
        <Menu mode="inline" defaultSelectedKeys={selectedKeys}>
            {PORTAL_MENU.map((menu) => {
                if (menu.children && menu.children?.length > 0) {
                    const key = `${menu.id}`;
                    return toMenu(menu, `${key}-`);
                } else {
                    return toMenu(menu);
                }
            }).filter((v) => !!v)}
        </Menu>
    );
};

const AppSider = () => {
    return (
        <Layout.Sider
            collapsible
            width={SIDER_WIDTH}
            style={{ minHeight: "94vh", overflowY: "scroll" }}
            theme="light"
        >
            <Menus />
        </Layout.Sider>
    );
};

const AppHeader = () => {
    const user = useAppAuthStore()?.user;
    const router = useRouter();
    const logout = useLogout();

    const dropdownMenu: MenuProps["items"] = [
        {
            key: "profile",
            label: (
                <Space direction="horizontal" size={16}>
                    <SettingOutlined />
                    <a href="/app/profile">Profile</a>
                </Space>
            ),
        },
        {
            key: "divider",
            label: <Menu.Divider />,
            disabled: true,
        },
        {
            key: "logout",
            label: (
                <Space direction="horizontal" size={16}>
                    <LogoutOutlined />
                    &nbsp;Logout
                </Space>
            ),
            onClick: () => {
                ui.confirm(`Are you sure to logout ?`, () => {
                    api.auth.logout().finally(() => {
                        logout();
                        router.push("/auth/login");
                    });
                });
            },
        },
    ];

    return (
        <Layout.Header>
            <Row justify="space-between" align="middle">
                <Col flex={`${SIDER_WIDTH}px`}>
                    <Link href="/app/dashboard" replace>
                        <Typography.Text
                            style={{
                                fontSize: "16px",
                                userSelect: "none",
                                cursor: "pointer",
                                color: "#fff",
                            }}
                        >
                            Report System
                        </Typography.Text>
                    </Link>
                </Col>
                <Col>
                    <Dropdown
                        menu={{
                            style: { width: "120px" },
                            items: dropdownMenu,
                        }}
                        placement="bottomLeft"
                        arrow
                    >
                        <Typography.Text
                            style={{
                                userSelect: "none",
                                cursor: "pointer",
                                color: "#fff",
                            }}
                        >
                            {user?.name || "Test Admin"}
                        </Typography.Text>
                    </Dropdown>
                </Col>
            </Row>
        </Layout.Header>
    );
};

export const PortalLayout = ({ children }: Props) => {
    return (
        <Layout>
            <AppHeader />
            <Layout>
                <AppSider />
                <Layout>
                    <Layout.Content
                        style={{
                            padding: "24px 24px 0 24px",
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        <AuthGuard>{children}</AuthGuard>
                        {/* {children} */}
                    </Layout.Content>

                    <Layout.Footer style={{ padding: "16px 24px" }}>
                        <Row
                            justify="space-between"
                            align="middle"
                            style={{ padding: 0, margin: 0 }}
                        >
                            <Col>
                                <Typography.Text>
                                    <CopyrightOutlined />
                                    &nbsp;
                                    {new Date().getFullYear()}&nbsp;Claush&nbsp;
                                    All rights reserved.
                                </Typography.Text>
                            </Col>
                            <Col>
                                <Typography.Text>v 0.1</Typography.Text>
                            </Col>
                        </Row>
                    </Layout.Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};
