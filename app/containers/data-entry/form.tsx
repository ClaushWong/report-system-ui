import { PortalContent } from "@/app/components/contents";
import { api, ui } from "@/app/services";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import { useState, useEffect } from "react";
import router from "next/router";
import styles from "./css/form.module.css";
import { isEmpty } from "lodash";
import dayjs from "dayjs";

type HandlersProps = {
    getRecord: () => void;
    getCompany: (name?: string) => void;
    onSubmit: (formValues: unknown) => void;
};

type ComponentProps = {
    id?: string;
};

export const DataEntryForm = (props: ComponentProps) => {
    const { id } = props;

    const [loading, setLoading] = useState<boolean>(false);
    const [companies, setCompanies] = useState<any[]>([]);

    const [form] = Form.useForm();

    const handlers: HandlersProps = {
        getRecord: async () => {
            try {
                const res: any = await api.dataEntry.get(id as string);
                if (res) {
                    form.setFieldsValue({
                        company: res.company,
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
        getCompany: async (name?: string) => {
            const query: any = {};

            if (name) {
                query.name = name;
            }

            const res: any = await api.company.list(
                { current: 1, pageSize: 10 },
                query
            );
            if (res) {
                setCompanies(res.items);
            }
        },
        onSubmit: async (formValues: any) => {
            try {
                setLoading(true);

                const res = id
                    ? await api.dataEntry.update(id, {
                          company: formValues.company,
                          date: formValues.date.format("YYYY-MM-DD"),
                          amount: formValues.amount,
                      })
                    : await api.dataEntry.create({
                          company: formValues.company,
                          date: formValues.date.format("YYYY-MM-DD"),
                          amount: formValues.amount,
                      });

                if (res) {
                    const successMessage = id
                        ? "Record updated successfully"
                        : "Record created successfully";
                    ui.notify.success(successMessage);
                    form.resetFields(["date", "amount"]);
                }
            } catch (err) {
                ui.notify.error(err);
            } finally {
                setLoading(false);
            }
        },
    };

    useEffect(() => {
        handlers.getCompany("");
    }, []);

    useEffect(() => {
        if (!isEmpty(id)) handlers.getRecord();
    }, [id]);

    const title = id ? "Edit Data Entry Info" : "Create New Data Entry";
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
                        name="company"
                        label="Company"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            onSearch={handlers.getCompany}
                            filterOption={false}
                        >
                            {companies.map((company: any) => {
                                return (
                                    <Select.Option
                                        key={company._id}
                                        value={company._id}
                                    >
                                        {company.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
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
