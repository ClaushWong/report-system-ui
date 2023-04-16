import { PortalContent } from "@/app/components/contents";
import { api, ui } from "@/app/services";
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
import { useState, useEffect } from "react";
import styles from "./css/list.module.css";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import router from "next/router";

type HandlersProps = {
    refresh: (filters: unknown, pagination: PaginationProps) => void;
    onFilter: (query: unknown) => void;
    redirectToEdit: (id: string) => void;
    onDeleteCompany: (id: string) => void;
    onPageChange: (pagination: any) => void;
};

type PaginationProps = {
    total?: number;
    current: number;
    pageSize: number;
};

type QueryProps = {
    name?: string;
};

export const CompanyList = () => {
    const [pagination, setPagination] = useState<PaginationProps>({
        total: 0,
        current: 0,
        pageSize: 10,
    });

    const [items, setItems] = useState<any[]>([]);
    const [filters, setFilters] = useState<any>({});

    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    const handlers: HandlersProps = {
        refresh: async (filters: unknown, pagination: PaginationProps) => {
            try {
                setLoading(true);
                const query = filters as QueryProps;
                const res: any = await api.company.list(pagination, query);
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
        onFilter: (query: unknown) => {
            setFilters(query);
        },
        redirectToEdit: (id: string) => {
            router.push(`/app/company/${id}`);
        },
        onDeleteCompany: async (id: string) => {
            ui.confirm("Are you sure you want to delete this company?", () => {
                setLoading(true);
                api.company
                    .delete(id)
                    .then((res: any) => {
                        if (res) {
                            ui.notify.success("Record deleted successfully");
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

    const columns: any = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Action",
            dataIndex: "_id",
            width: "50px",
            align: "center",
            fixed: "right",
            render: (id: string) => {
                return (
                    <Space>
                        <Tooltip placement="top" title="Edit">
                            <Button
                                type="link"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    handlers.redirectToEdit(id);
                                }}
                            />
                        </Tooltip>
                        <Tooltip placement="top" title="Delete">
                            <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handlers.onDeleteCompany(id)}
                            />
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    const CreateNewButton = () => {
        return (
            <Button
                type="primary"
                onClick={() => router.push("/app/company/create")}
            >
                + New
            </Button>
        );
    };

    return (
        <PortalContent
            title="Company"
            loading={loading}
            extra={<CreateNewButton />}
        >
            <Row gutter={[8, 16]}>
                <Col span={24}>
                    <Form
                        form={form}
                        layout="inline"
                        onFinish={handlers.onFilter}
                    >
                        <Form.Item name="name" className={styles.input}>
                            <Input placeholder="Name" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={24}>
                    <Typography.Title level={4} className={styles.total}>
                        Total: {pagination.total || 0}
                    </Typography.Title>
                </Col>
                <Col span={24}>
                    <Table
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
