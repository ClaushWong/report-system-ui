import { PortalContent } from "@/app/components/contents";
import { api, ui } from "@/app/services";
import { Button, Divider, Form, Input, Select } from "antd";
import { useState, useEffect } from "react";
import router from "next/router";
import styles from "./css/form.module.css";
import { isEmpty } from "lodash";
import { useAppAuthStore } from "@/stores/index";

type HandlersProps = {
    getRecord: () => void;
    getUsers: () => void;
    getRoles: () => void;
    onSubmit: (formValues: unknown) => void;
};

type ComponentProps = {
    id?: string;
};

export const ClientForm = (props: ComponentProps) => {
    const { id } = props;

    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [form] = Form.useForm();

    const { user } = useAppAuthStore();
    const isAdmin: boolean = user?.role?.name?.toLowerCase() === "admin";

    const canEdit = user.role.allowedPermissions.includes("client-edit");
    const canCreate = user.role.allowedPermissions.includes("client-create");

    const handlers: HandlersProps = {
        getRecord: async () => {
            try {
                const res: any = await api.client.get(id as string);
                if (res) {
                    const fields: any = {
                        name: res.name,
                        username: res.username,
                        role: res.role,
                    };

                    if (isAdmin) {
                        fields.user = res.user;
                    }
                    form.setFieldsValue(fields);
                }
            } catch (err) {
                ui.notify.error(err);
            } finally {
                setLoading(false);
            }
        },
        getUsers: async () => {
            try {
                const res: any = await api.user.list(
                    {
                        current: 1,
                        pageSize: 1000,
                    },
                    {},
                );
                if (!!res) {
                    setUsers(
                        res.items.map((item: any) => ({
                            label: item.name,
                            value: item._id,
                        })),
                    );
                }
            } catch (err) {
                ui.notify.error(err);
            } finally {
                setLoading(false);
            }
        },
        getRoles: async () => {
            try {
                const res: any = await api.role.list(
                    {
                        current: 1,
                        pageSize: 1000,
                    },
                    {
                        type: "client",
                    },
                );
                if (!!res) {
                    setRoles(
                        res.items.map((item: any) => ({
                            label: item.name,
                            value: item._id,
                        })),
                    );
                }
            } catch (err) {
                ui.notify.error(err);
            } finally {
                setLoading(false);
            }
        },
        onSubmit: async (formValues: unknown) => {
            try {
                if (id && !canEdit) {
                    ui.notify.error("You are not allowed to edit this record");
                    return;
                } else if (!canCreate) {
                    ui.notify.error(
                        "You are not allowed to create a new record",
                    );
                    return;
                }
                setLoading(true);

                const res = id
                    ? await api.client.update(
                          id,
                          formValues as {
                              name: string;
                              user?: string;
                              username: string;
                              role: string;
                              password?: string;
                          },
                      )
                    : await api.client.create(
                          formValues as {
                              name: string;
                              user?: string;
                              username: string;
                              role: string;
                              password?: string;
                          },
                      );
                if (res) {
                    const successMessage = id
                        ? "Record updated successfully"
                        : "Record created successfully";
                    ui.notify.success(successMessage);
                    router.push("/app/client");
                }
            } catch (err) {
                ui.notify.error(err);
            }
        },
    };

    useEffect(() => {
        if (!isEmpty(id)) handlers.getRecord();
    }, [id]);

    useEffect(() => {
        handlers.getUsers();
        handlers.getRoles();
    }, []);

    const title = id ? "Edit Client" : "Add Client";
    const saveText = id ? "Save" : "Create";

    return (
        <PortalContent title={title} loading={loading} back={true}>
            <div className={styles.formHalf}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handlers.onSubmit}
                    validateMessages={{ required: "${label} is required" }}
                >
                    {isAdmin && (
                        <Form.Item
                            label="User"
                            name="user"
                            rules={[
                                { required: true, message: "User is required" },
                            ]}
                        >
                            <Select options={users} />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Name is required",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {isAdmin && (
                        <Form.Item
                            label="Role"
                            name="role"
                            rules={[
                                { required: true, message: "Role is required" },
                            ]}
                        >
                            <Select options={roles} />
                        </Form.Item>
                    )}
                    <Divider orientation="left">Login Credentials</Divider>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Username is required",
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
                                                    "The password that you entered do not match!",
                                                ),
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
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={!canEdit && !canCreate}
                        >
                            {saveText}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </PortalContent>
    );
};
