import { PortalContent } from "@/app/components/contents";
import { api, ui } from "@/app/services";
import { Button, Divider, Form, Input, Tree, Radio } from "antd";
import { useState, useEffect } from "react";
import router from "next/router";
import styles from "./css/form.module.css";
import { isEmpty } from "lodash";
import { PORTAL_MENU } from "@/app/menus";
import { PORTAL_PERMISSIONS } from "@/app/permissions";
import { useAppAuthStore } from "@/stores/index";

type HandlersProps = {
    getRecord: () => void;
    onCheck: (checkedKeys: any) => void;
    onCheckPermission: (checkedKeys: any, parentId: string) => void;
    onSubmit: (formValues: unknown) => void;
};

type ComponentProps = {
    id?: string;
};

export const RoleForm = (props: ComponentProps) => {
    const { id } = props;

    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    const [allowedPages, setAllowedPages] = useState<string[]>([]);
    const [allowedPermissionsStaged, setAllowedPermissionsStaged] =
        useState<any>({});

    const [permissions, setPermissions] = useState<any[]>([]);

    const { user } = useAppAuthStore();

    const canCreate = user.role.allowedPermissions.includes(
        "role-management-create"
    );
    const canEdit = user.role.allowedPermissions.includes(
        "role-management-edit"
    );

    const treeItem = (item: any) => {
        let children = [];
        if (item.children && item.children.length > 0) {
            for (const childItem of item.children) {
                children.push(childItem);
            }
        }
        if (children.length > 0) {
            return {
                title: item.name,
                key: item.id,
                children,
            };
        } else {
            return {
                title: item.name,
                key: item.id,
            };
        }
    };

    const treeData = PORTAL_MENU.map((menu: any) => {
        return treeItem(menu);
    });

    const handlers: HandlersProps = {
        getRecord: async () => {
            try {
                const res: any = await api.role.get(id as string);
                if (res) {
                    form.setFieldsValue({
                        name: res.name,
                        type: res.type,
                    });
                    setAllowedPages(res.allowedPages);
                    const permissionStaged: any = {};
                    for (const pages of res.allowedPages) {
                        const masterPermission = PORTAL_PERMISSIONS.find(
                            (perm: any) => perm.id === pages
                        );
                        const allowedPermissions =
                            res.allowedPermissions.filter((perm: string) =>
                                perm.includes(pages)
                            );
                        if (masterPermission) {
                            if (
                                allowedPermissions.length ==
                                masterPermission.permissions.length
                            ) {
                                allowedPermissions.push(`${pages}-select-all`);
                            }
                        }
                        permissionStaged[pages] = allowedPermissions;
                    }
                    setAllowedPermissionsStaged(permissionStaged);
                }
            } catch (err) {
                ui.notify.error(err);
            } finally {
                setLoading(false);
            }
        },
        onCheck: (checkedKeys: any) => {
            setAllowedPages(checkedKeys);
        },
        onCheckPermission: (checkedKeys: any, parentId: string) => {
            const permissionStaged = { ...allowedPermissionsStaged };
            if (!permissionStaged.hasOwnProperty(parentId)) {
                permissionStaged[parentId] = [];
            }
            permissionStaged[parentId] = checkedKeys;

            setAllowedPermissionsStaged(permissionStaged);
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

                const sendData = {
                    name: formValues.name,
                    type: formValues.type,
                    allowedPages,
                    allowedPermissions: Object.values(allowedPermissionsStaged)
                        .flat()
                        .filter((perm: string | unknown) =>
                            typeof perm === "string"
                                ? !perm.includes("select-all")
                                : false
                        ),
                };

                const res = id
                    ? await api.role.update(
                          id,
                          sendData as {
                              name: string;
                              type: string;
                              allowedPages: string[];
                              allowedPermissions: string[];
                          }
                      )
                    : await api.role.create(
                          sendData as {
                              name: string;
                              type: string;
                              allowedPages: string[];
                              allowedPermissions: string[];
                          }
                      );

                if (res) {
                    const successMessage = id
                        ? "Record updated successfully"
                        : "Record created successfully";
                    ui.notify.success(successMessage);
                    router.push("/app/role-management");
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
        if (allowedPages.length > 0) {
            setAllowedPermissionsStaged((permissionStaged: any) => {
                const remainKey = Object.keys(permissionStaged).filter(
                    (key: string) => allowedPages.includes(key)
                );
                const newPermissionStaged: any = {};
                for (const key of remainKey) {
                    newPermissionStaged[key] = permissionStaged[key];
                }
                return newPermissionStaged;
            });

            const localPermissions = PORTAL_PERMISSIONS.filter(
                (permission: any) => allowedPages.includes(permission.id)
            );

            const displayPermissions = localPermissions.map(
                (permissionData: any) => {
                    return {
                        key: permissionData.id,
                        name: permissionData.name,
                        permissions: [
                            {
                                key: `${permissionData.id}-select-all`,
                                title: "Select All",
                                children: permissionData.permissions.map(
                                    (permission: any) => {
                                        return {
                                            key: permission.id,
                                            title: permission.name,
                                        };
                                    }
                                ),
                            },
                        ],
                    };
                }
            );

            setPermissions(displayPermissions);
        }
    }, [allowedPages]);

    const title = id ? "Edit Role Info" : "Create New Role";
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
                        label="Role Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder="Name" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value="operator">Operator</Radio>
                            <Radio value="client">Client</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Pages">
                        <Tree
                            checkable
                            treeData={treeData}
                            onCheck={handlers.onCheck}
                            checkedKeys={allowedPages}
                        />
                    </Form.Item>

                    <Divider orientation="left">Permissions</Divider>

                    {permissions.length > 0 ? (
                        permissions.map((permissionData: any) => {
                            return (
                                <Form.Item
                                    key={permissionData.key}
                                    label={permissionData.name}
                                    style={{ marginLeft: "5%" }}
                                >
                                    <Tree
                                        checkable
                                        treeData={permissionData.permissions}
                                        onCheck={(checked: any) =>
                                            handlers.onCheckPermission(
                                                checked,
                                                permissionData.key
                                            )
                                        }
                                        defaultExpandAll={true}
                                        checkedKeys={
                                            allowedPermissionsStaged[
                                                permissionData.key
                                            ] || []
                                        }
                                    />
                                </Form.Item>
                            );
                        })
                    ) : (
                        <Form.Item style={{ marginLeft: "5%" }}>
                            <i>
                                There is no pages checked, thus no permission
                                data
                            </i>
                        </Form.Item>
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
