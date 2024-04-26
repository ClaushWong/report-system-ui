import { PortalContent } from "@/app/components/contents";
import { api, ui } from "@/app/services";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import { useState, useEffect } from "react";
import router from "next/router";
import styles from "./css/form.module.css";
import { isEmpty } from "lodash";
import dayjs from "dayjs";
import { useAppAuthStore } from "@/stores/index";

type HandlersProps = {
  getRecord: () => void;
  getClients: (name?: string) => void;
  onSubmit: (formValues: unknown) => void;
};

type ComponentProps = {
  id?: string;
};

export const TransactionForm = (props: ComponentProps) => {
  const { id } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<any[]>([]);

  const [form] = Form.useForm();

  const { user } = useAppAuthStore();

  const canCreate = user.role.allowedPermissions.includes(
    "transactions-create"
  );
  const canEdit = user.role.allowedPermissions.includes("transactions-edit");

  const handlers: HandlersProps = {
    getRecord: async () => {
      try {
        const res: any = await api.transaction.get(id as string);
        if (res) {
          form.setFieldsValue({
            client: res.client,
            category: res.category,
            date: dayjs(res.date),
            amount: res.amount,
          });
        }
      } catch (err) {
        ui.notify.error(err);
      } finally {
        setLoading(false);
      }
    },
    getClients: async (name?: string) => {
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
    onSubmit: async (formValues: any) => {
      try {
        if (id && !canEdit) {
          ui.notify.error("Your account is not allowed to edit record.");
          return;
        } else if (!canCreate) {
          ui.notify.error("Your account is not allowed to create record.");
          return;
        }

        setLoading(true);

        const res = id
          ? await api.transaction.update(id, {
              client: formValues.client,
              category: formValues.category,
              date: formValues.date.format("YYYY-MM-DD"),
              amount: formValues.amount,
            })
          : await api.transaction.create({
              client: formValues.client,
              category: formValues.category,
              date: formValues.date.format("YYYY-MM-DD"),
              amount: formValues.amount,
            });

        if (res) {
          const successMessage = id
            ? "Record updated successfully"
            : "Record created successfully";
          ui.notify.success(successMessage);
          form.resetFields(["amount"]);
          if (id) {
            router.push("/app/transactions");
          }
        }
      } catch (err) {
        ui.notify.error(err);
      } finally {
        setLoading(false);
      }
    },
  };

  useEffect(() => {
    handlers.getClients("");
  }, []);

  useEffect(() => {
    if (!isEmpty(id)) handlers.getRecord();
  }, [id]);

  const title = id ? "Edit Transaction Info" : "Create New Transaction";
  const saveText = id ? "Save" : "Create";

  return (
    <PortalContent title={title} loading={loading} back={true}>
      <div className={styles.formHalf}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handlers.onSubmit}
          validateMessages={{
            required: "${label} is required",
          }}
        >
          <Form.Item
            name="client"
            label="Client"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              showSearch
              onSearch={handlers.getClients}
              filterOption={false}
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
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Issued Date"
            rules={[{ required: true }]}
          >
            <DatePicker className={styles.maxWidth} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              addonBefore="RM"
              precision={2}
              className={styles.maxWidth}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {saveText}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </PortalContent>
  );
};
