import { PortalContent } from "@/app/components/contents";
import { api, ui } from "@/app/services";
import { Button, Select, Form, Input, Tree, Radio, Divider, Space } from "antd";
import { useState, useEffect } from "react";
import router from "next/router";
import styles from "./css/form.module.css";
import { isEmpty } from "lodash";
import { useAppAuthStore } from "@/stores/index";

type HandlersProps = {
    getRecord: () => void;
    getRole: (type: string) => void;
    onSubmit: (formValues: unknown) => void;
};

type ComponentProps = {
    id?: string;
};

export const UserForm = (props: ComponentProps) => {
    const { id } = props;

    const [loading, setLoading] = useState<boolean>(false);

    const [roleList, setRoleList] = useState<any[]>([]);

    const [form] = Form.useForm();

    const { user } = useAppAuthStore();

    const isAdmin = user.role.name === "admin" && user.role.type === "operator";

    const canEdit = user.role.allowedPermissions.includes(
        "user-management-edit"
    );
    const canCreate = user.role.allowedPermissions.includes(
        "user-management-create"
    );

    const handlers: HandlersProps = {
        getRecord: async () => {
            try {
                const res: any = await api.user.get(id as string);
                if (res) {
                    form.setFieldsValue({
                        name: res.name,
                        username: res.username,
                        type: res.type,
                        role: res.role,
                    });

                    handlers.getRole(res.type);
                }
            } catch (err) {
                ui.notify.error(err);
            } finally {
                setLoading(false);
            }
        },
        getRole: async (type: string) => {
            if (type) {
                const roles: any = await api.role.list(
                    { current: 0, pageSize: 0 },
                    { type }
                );
                if (roles) {
                    setRoleList(
                        roles.items.map((role: any) => {
                            return {
                                label: role.name,
                                value: role._id,
                            };
                        })
                    );
                }
            }
        },
        onSubmit: async (formValues: any) => {
            try {
                if (id && !canEdit) {
                    ui.notify.error(
                        "Your account is not allowed to edit record."
                    );
                    return;
                } else if (!canCreate) {
                    ui.notify.error(
                        "Your account is not allowed to create record."
                    );
                    return;
                }

                setLoading(true);

                if (id && formValues.password && !formValues.confirmPassword) {
                    ui.notify.error("Please retype your password to proceed.");
                    setLoading(false);
                    return;
                }

                const sendData = {
                    username: formValues.username,
                    name: formValues.name,
                    type: formValues.type || "client",
                    role: formValues.role,
                    password: formValues.password,
                };

                const res = id
                    ? await api.user.update(
                          id,
                          sendData as {
                              username: string;
                              name: string;
                              type: string;
                              role: string;
                              password: string;
                          }
                      )
                    : await api.user.create(
                          sendData as {
                              username: string;
                              name: string;
                              type: string;
                              role: string;
                              password: string;
                          }
                      );

                if (res) {
                    const successMessage = id
                        ? "Record updated successfully"
                        : "Record created successfully";
                    ui.notify.success(successMessage);
                    router.push("/app/user-management");
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

    useEffect(() => {
        if (!isAdmin) {
            handlers.getRole("client");
        }
    }, []);

    const title = id ? "Edit User Info" : "Create New User";
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
                        label="Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder="Name" />
                    </Form.Item>

                    {isAdmin ? (
                        <Form.Item
                            name="type"
                            label="Type"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Radio.Group
                                onChange={(event: any) =>
                                    handlers.getRole(event.target.value)
                                }
                            >
                                <Radio value="operator">Operator</Radio>
                                <Radio value="client">Client</Radio>
                            </Radio.Group>
                        </Form.Item>
                    ) : (
                        <></>
                    )}

                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            disabled={roleList.length == 0}
                            options={roleList}
                            allowClear
                        />
                    </Form.Item>

                    {!id ? (
                        <Divider orientation="left">Login Credential</Divider>
                    ) : (
                        <></>
                    )}
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input disabled={!!id} />
                    </Form.Item>

                    {!id ? (
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    ) : (
                        <>
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
                                                getFieldValue("password") ===
                                                    value
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
                        </>
                    )}

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
