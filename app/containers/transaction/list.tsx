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
  DatePicker,
  Input,
} from "antd";
import { useState, useEffect } from "react";
import styles from "./css/list.module.css";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import router from "next/router";
import dayjs from "dayjs";
import { useAppAuthStore } from "@/stores/index";

const { RangePicker } = DatePicker;

type HandlersProps = {
  refresh: (filters: unknown, pagination: PaginationProps) => void;
  getClient: (name?: string) => void;
  onFilter: (query: unknown) => void;
  redirectToEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPageChange: (pagination: any) => void;
  exportExcel: () => void;
};

type PaginationProps = {
  total?: number;
  current: number;
  pageSize: number;
};

export const TransactionList = () => {
  const [pagination, setPagination] = useState<PaginationProps>({
    total: 0,
    current: 1,
    pageSize: 10,
  });

  const [items, setItems] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  const [filters, setFilters] = useState<any>({});

  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  const { user } = useAppAuthStore();

  const canFilter = user.role.allowedPermissions.includes(
    "transactions-filter"
  );
  const canCreate = user.role.allowedPermissions.includes(
    "transactions-create"
  );
  const canEdit = user.role.allowedPermissions.includes("transactions-edit");
  const canDelete = user.role.allowedPermissions.includes(
    "transactions-delete"
  );
  const canExport = user.role.allowedPermissions.includes(
    "transactions-export"
  );

  const handlers: HandlersProps = {
    refresh: async (filters: any, pagination: PaginationProps) => {
      try {
        setLoading(true);
        const query = {
          dateRange: filters.dateRange
            ? filters.dateRange
                .map((date: any) => date.format("YYYY-MM-DD"))
                .join(",")
            : "",
          client: filters.client || "",
          remarks: filters.remarks || "",
        };
        const res: any = await api.transaction.list(pagination, query);
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
    getClient: async (name?: string) => {
      const query: any = {};

      if (name) {
        query.name = name;
      }

      const res: any = await api.client.list(
        { current: 1, pageSize: 10 },
        query
      );
      if (res) {
        setClients(res.items);
      }
    },
    onFilter: (query: unknown) => {
      setFilters(query);
    },
    redirectToEdit: (id: string) => {
      router.push(`/app/transactions/${id}`);
    },
    onDelete: async (id: string) => {
      ui.confirm("Are you sure you want to delete this data entry?", () => {
        if (!canDelete) {
          ui.notify.error("Your account is not allowed to delete record.");
          return;
        }
        setLoading(true);
        api.transaction
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
    exportExcel: async () => {
      if (!canExport) {
        ui.notify.error("Your account is not allowed to export record.");
        return;
      }
      await api.transaction.exportExcel(filters);
    },
  };

  useEffect(() => {
    handlers.refresh({}, pagination);
    handlers.getClient("");
  }, []);

  useEffect(() => {
    handlers.refresh(filters, { current: 1, pageSize: 10 });
  }, [filters]);

  const columns: any = [
    {
      title: "Issued Date",
      dataIndex: "date",
      render: (date: string) => {
        return dayjs(date).format("DD MMM YYYY");
      },
    },
    {
      title: "Client",
      dataIndex: ["client", "name"],
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
    {
      title: "Amount (RM)",
      dataIndex: "amount",
      render: (amount: number) => {
        return amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        });
      },
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
        onClick={() => router.push("/app/transactions/create")}
      >
        + New
      </Button>
    );
  };

  return (
    <PortalContent
      title="Transactions"
      loading={loading}
      extra={canCreate ? <CreateNewButton /> : <></>}
    >
      <Row gutter={[8, 16]}>
        {canFilter ? (
          <Col span={24}>
            <Form form={form} layout="inline" onFinish={handlers.onFilter}>
              <Form.Item name="client" className={styles.input}>
                <Select
                  showSearch
                  onSearch={handlers.getClient}
                  filterOption={false}
                  placeholder="Client"
                  allowClear
                >
                  {clients.map((client: any) => {
                    return (
                      <Select.Option key={client._id} value={client._id}>
                        {client.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="dateRange" className={styles.input}>
                <RangePicker />
              </Form.Item>
              <Form.Item name="remarks" className={styles.input}>
                <Input />
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
              <Form.Item>
                <Button
                  type="primary"
                  className="btn-success"
                  onClick={handlers.exportExcel}
                >
                  Export Excel
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
