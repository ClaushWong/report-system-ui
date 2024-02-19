import { PortalContent } from "@/app/components/contents";
import { api, ui } from "@/app/services";

import { useState, useEffect } from "react";
import router from "next/router";
import styles from "./css/list.module.css";

import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Space,
    Table,
    Tooltip,
    Typography,
} from "antd";
import { useAppAuthStore } from "@/stores/index";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

type PaginationProps = {
    total?: number;
    current: number;
    pageSize: number;
};

type HandlersProps = {
    refresh: (filters: unknown, pagination: PaginationProps) => void;
    onFilter: (filters: unknown) => void;
    redirectToEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onPageChange: (pagination: any) => void;
};

export const ClientList = () => {
    const [pagination, setPagination] = useState<PaginationProps>({
        total: 0,
        current: 1,
        pageSize: 10,
    });

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<any>({});
    const [form] = Form.useForm();
    const { user } = useAppAuthStore();
    const isAdmin = user?.role?.name?.toLowerCase() === "admin";

    const canFilter = user.role.allowedPermissions.includes("client-filter");
    const canCreate = user.role.allowedPermissions.includes("client-create");
    const canEdit = user.role.allowedPermissions.includes("client-edit");
    const canDelete = user.role.allowedPermissions.includes("client-delete");

    const handlers: HandlersProps = {
        refresh: async (filters: any, pagination: PaginationProps) => {
            try {
                setLoading(true);
                const query = {
                    name: filters.name,
                };
                if (isAdmin) {
                    query.user = filters.user;
                }
                const res: any = await api.client.list(pagination, query);
                if (res) {
                    setPagination({
                        ...pagination,
                        total: res.total,
                    });
                    setItems(res.items);
                }
            } catch (err) {
                ui.notify.error(err);
            } finally {
                setLoading(false);
            }
        },
        onFilter: (filters: any) => {
            setFilters(filters);
        },
        redirectToEdit: (id: string) => {
            router.push(`/app/client/${id}`);
        },
        onDelete: async (id: string) => {
            ui.confirm("Are you sure you want to delete this record?", () => {
                if (!canDelete) {
                    ui.notify.error(
                        "Your account is not allowed to delete record.",
                    );
                    return;
                }
                setLoading(true);
                api.client
                    .delete(id)
                    .then((res: any) => {
                        if (res) {
                            ui.notify.success("Client deleted successfully");
                            handlers.refresh(filters, pagination);
                        }
                    })
                    .catch((err) => {
                        ui.notify.error(err);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            });
        },
        onPageChange: (pagination: any) => {
            handlers.refresh(filters, pagination);
        },
    };

    useEffect(() => {
        handlers.refresh({}, pagination);
    }, []);

    useEffect(() => {
        handlers.refresh(filters, { current: 1, pageSize: 10 });
    }, [filters]);

    const fieldColumns: any[] = [
        {
            title: "Name",
            dataIndex: "name",
        },
    ];

    if (user?.role?.name?.toLowerCase() === "admin") {
        fieldColumns.push({
            title: "User",
            dataIndex: ["user", "name"],
        });
    }

    const actionColumns: any = {
        title: "Action",
        dataIndex: "_id",
        width: "50px",
        align: "center",
        fixed: "right",
        render: (id: string) => {
            return (
                <Space>
                    {canEdit && (
                        <Tooltip placement="top" title="Edit">
                            <Button
                                type="link"
                                icon={<EditOutlined />}
                                onClick={() => handlers.redirectToEdit(id)}
                            />
                        </Tooltip>
                    )}
                    {canDelete && (
                        <Tooltip placement="top" title="Delete">
                            <Button
                                type="link"
                                icon={<DeleteOutlined />}
                                onClick={() => handlers.onDelete(id)}
                            />
                        </Tooltip>
                    )}
                </Space>
            );
        },
    };

    const columns: any[] = [...fieldColumns, actionColumns];

    const CreateNewButton = () => {
        return (
            <Button
                type="primary"
                onClick={() => router.push("/app/client/create")}
            >
                + New
            </Button>
        );
    };

    return (
        <PortalContent
            title="Clients"
            loading={loading}
            extra={canCreate ? <CreateNewButton /> : <></>}
        >
            <Row gutter={[8, 16]}>
                {canFilter ? (
                    <Col span={24}>
                        <Form
                            form={form}
                            layout="inline"
                            onFinish={handlers.onFilter}
                        >
                            <Form.Item name="name" className={styles.input}>
                                <Input placeholder="Name" />
                            </Form.Item>
                            {isAdmin && (
                                <Form.Item name="user" className={styles.input}>
                                    <Input placeholder="User" />
                                </Form.Item>
                            )}
                            <Form.Item>
                                <Button
                                    type="default"
                                    onClick={() => {
                                        form.resetFields();
                                        setFilters({});
                                    }}
                                >
                                    Reset
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                ) : (
                    <></>
                )}
                <Col span={24}>
                    <Typography.Title level={4} className={styles.total}>
                        Total: {pagination.total || 0}
                    </Typography.Title>
                </Col>
                <Col span={24}>
                    <Table
                        rowKey="_id"
                        columns={columns}
                        dataSource={items}
                        pagination={pagination}
                        onChange={handlers.onPageChange}
                    />
                </Col>
            </Row>
        </PortalContent>
    );
};
