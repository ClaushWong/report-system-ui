import { PortalContent } from "@/app/components/contents";
import { api, ui } from "@/app/services";
import {
  Button,
  Col,
  Form,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  Input,
} from "antd";
import { useState, useEffect } from "react";
import styles from "./css/list.module.css";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import router from "next/router";
import { capitalize } from "lodash";
import { useAppAuthStore } from "@/stores/index";

type HandlersProps = {
  refresh: (filters: unknown, pagination: PaginationProps) => void;
  onFilter: (query: unknown) => void;
  redirectToEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPageChange: (pagination: any) => void;
};

type PaginationProps = {
  total?: number;
  current: number;
  pageSize: number;
};

export const RoleList = () => {
  const [pagination, setPagination] = useState<PaginationProps>({
    total: 0,
    current: 1,
    pageSize: 10,
  });

  const [items, setItems] = useState<any[]>([]);

  const [filters, setFilters] = useState<any>({});

  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  const { user } = useAppAuthStore();

  const canFilter = user.role.allowedPermissions.includes(
    "role-management-filter"
  );
  const canCreate = user.role.allowedPermissions.includes(
    "role-management-create"
  );
  const canEdit = user.role.allowedPermissions.includes("role-management-edit");
  const canDelete = user.role.allowedPermissions.includes(
    "role-management-delete"
  );
  const canExport = user.role.allowedPermissions.includes(
    "role-management-export"
  );

  const handlers: HandlersProps = {
    refresh: async (filters: any, pagination: PaginationProps) => {
      try {
        setLoading(true);
        const query = {
          name: filters.name,
          type: filters.type,
        };
        const res: any = await api.role.list(pagination, query);
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
      router.push(`/app/role-management/${id}`);
    },
    onDelete: async (id: string) => {
      ui.confirm("Are you sure you want to delete this data entry?", () => {
        if (!canDelete) {
          ui.notify.error("Your account is not allowed to delete record.");
          return;
        }
        setLoading(true);
        api.role
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
      title: "Type",
      dataIndex: "type",
      render: (type: string) => capitalize(type),
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
            {canEdit ? (
              <Tooltip placement="top" title="Edit">
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    handlers.redirectToEdit(id);
                  }}
                />
              </Tooltip>
            ) : (
              <></>
            )}
            {canDelete ? (
              <Tooltip placement="top" title="Delete">
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handlers.onDelete(id)}
                />
              </Tooltip>
            ) : (
              <></>
            )}
          </Space>
        );
      },
    },
  ];

  const CreateNewButton = () => {
    return (
      <Button
        type="primary"
        onClick={() => router.push("/app/role-management/create")}
      >
        + New
      </Button>
    );
  };

  const SelectTypeOptions = [
    {
      label: "Operator",
      value: "operator",
    },
    {
      label: "Client",
      value: "client",
    },
  ];

  return (
    <PortalContent
      title="Role Management"
      loading={loading}
      extra={canCreate ? <CreateNewButton /> : <></>}
    >
      <Row gutter={[8, 16]}>
        {canFilter ? (
          <Col span={24}>
            <Form form={form} layout="inline" onFinish={handlers.onFilter}>
              <Form.Item name="name" className={styles.input}>
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item name="type" className={styles.select}>
                <Select
                  options={SelectTypeOptions}
                  allowClear
                  placeholder="Type"
                />
              </Form.Item>
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
