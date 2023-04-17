import { PortalContent } from "@/app/components/contents";
import { api, ui } from "@/app/services";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import router from "next/router";

type HandlersProps = {
    getProfile: () => void;
    updateProfile: (formValues: any) => void;
};

export const ProfilePage = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    const handlers: HandlersProps = {
        getProfile: async () => {
            try {
                setLoading(true);
                const profile = await api.auth.profile();
                if (profile) {
                    form.setFieldsValue(profile);
                }
            } catch (err) {
                ui.notify.error(err);
            } finally {
                setLoading(false);
            }
        },
        updateProfile: async (formValues: any) => {
            try {
                setLoading(true);
                if (formValues.password && !formValues.confirmPassword) {
                    ui.notify.error("Please retype your password to proceed.");
                    setLoading(false);
                    return;
                }
                const sendData = {
                    name: formValues.name,
                    password: formValues.password,
                };

                const res = await api.auth.update(sendData);

                if (res) {
                    ui.notify.success("Successfully updated profile");
                    setTimeout(() => {
                        router.reload();
                    }, 500);
                }
            } catch (err) {
                ui.notify.error(err);
            } finally {
                setLoading(false);
            }
        },
    };

    useEffect(() => {
        handlers.getProfile();
    }, []);

    return (
        <PortalContent title="Profile" loading={loading}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handlers.updateProfile}
                style={{ width: "50%" }}
            >
                <Form.Item name="username" label="Username">
                    <Input disabled={true} />
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="New Password">
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Retype Password"
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("password") === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(
                                        "The password that you entered do not match!"
                                    )
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </PortalContent>
    );
};
