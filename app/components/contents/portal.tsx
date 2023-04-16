import React from "react";
import { Card, Breadcrumb, Spin } from "antd";
import { PageHeader } from "@ant-design/pro-components";
import { useRouter } from "next/router";

type AppProps = {
  children?: any;
  back?: any;
  title?: string;
  subTitle?: string | React.ReactNode;
  extra?: React.ReactElement;
  loading?: boolean;
  breadcrumbs?: {
    name: string;
    path?: string;
  }[];
};

export const Portal = ({
  children,
  back,
  title,
  subTitle,
  extra,
  loading = false,
  breadcrumbs,
}: AppProps) => {
  const router = useRouter();

  return (
    <Card>
      {(title || extra) && (
        <PageHeader
          style={{ paddingLeft: 0, paddingRight: 0 }}
          ghost={false}
          onBack={
            back
              ? () =>
                  typeof back === "string"
                    ? router.replace(back)
                    : router.back()
              : undefined
          }
          title={title}
          subTitle={subTitle}
          extra={extra}
        />
      )}

      {breadcrumbs && (
        <Breadcrumb style={{ marginBottom: 8 }}>
          {breadcrumbs?.map((b, i) => {
            return (
              <Breadcrumb.Item key={i} href={b.path}>
                {b.name}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      )}

      <div className="wt-portal-content">
        <Spin spinning={loading}>{children}</Spin>
      </div>
    </Card>
  );
};
