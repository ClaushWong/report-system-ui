import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, notification as Notification } from "antd";
import React from "react";

type EmptyFC = () => void;

// notify message
// success - used when API return success
// warning - used during process of data before send to API
// error - used in every try catch clause
// info - used for debug purpose for now
export const notify = {
    success: (message: string | React.ReactNode) => {
        Notification.success({ message });
    },
    warning: (message: string | React.ReactNode) => {
        Notification.warning({ message });
    },
    error: (error: string | Error | React.ReactNode | any) => {
        if (error instanceof Error) {
            Notification.error({ message: error.message ?? error });
        } else if (
            typeof error === "object" &&
            error.hasOwnProperty("message")
        ) {
            Notification.error({ message: error.message ?? error });
        } else {
            Notification.error({ message: error });
        }
    },
    info: (message: string | React.ReactNode) => {
        Notification.info({ message });
    },
};

// confirm popup
// used before perform any operation related to send data to API
export const confirm = (
    message: string,
    yes?: EmptyFC,
    opt?: {
        icon?: React.ReactNode;
        okText?: string;
        cancelText?: string;
        no?: EmptyFC;
    }
) => {
    Modal.confirm({
        icon: opt?.icon ?? <ExclamationCircleOutlined />,
        content: message,
        onOk: yes,
        onCancel: opt?.no,
        okText: opt?.okText,
        cancelText: opt?.cancelText,
    });
};
