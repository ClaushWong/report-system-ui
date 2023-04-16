import { PortalContent } from "@/app/components/contents";
import { api, ui } from "@/app/services";
import { Button, Form, Input } from "antd";
import { useState, useEffect } from "react";
import router from "next/router";
import styles from "./css/form.module.css";
import { isEmpty } from "lodash";

type HandlersProps = {
    getRecord: () => void;
    onSubmit: (formValues: unknown) => void;
};

type ComponentProps = {
    id?: string;
};

export const CompanyForm = (props: ComponentProps) => {
    const { id } = props;

    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    const handlers: HandlersProps = {
        getRecord: async () => {
            try {
                const res: any = await api.company.get(id as string);
                if (res) {
                    form.setFieldValue("name", res.name);
                }
            } catch (err) {
                ui.notify.error(err);
            } finally {
                setLoading(false);
            }
        },
        onSubmit: async (formValues: unknown) => {
            try {
                setLoading(true);

                const res = id
                    ? await api.company.update(
                          id,
                          formValues as { name: string }
                      )
                    : await api.company.create(formValues as { name: string });

                if (res) {
                    const successMessage = id
                        ? "Record updated successfully"
                        : "Record created successfully";
                    ui.notify.success(successMessage);
                    router.push("/app/company");
                }
            } catch (err) {
                ui.notify.error(err);
                setLoading(false);
            }
        },
    };

    useEffect(() => {
        if (!isEmpty(id)) handlers.getRecord();
    }, [id]);

    const title = id ? "Edit Company Info" : "Create New Company";
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
                        name="name"
                        label="Company Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder="Name" />
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
