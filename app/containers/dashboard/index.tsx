import { api, ui } from "@/app/services";
import { Card, Col, Row, Spin, Typography } from "antd";
import { useEffect, useState } from "react";

import BarChart from "@/app/components/dashboard/bar-chart";

type HandlersProps = {
  getData: (dateRange?: string) => void;
};

const CustomCard = (props: any) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MYR",
  });

  return (
    <Card>
      <Typography.Title level={4}>{props.title}</Typography.Title>
      <Typography.Title level={5} style={{ textAlign: "right" }}>
        {props.isPrice
          ? formatter.format(props.value)
          : props.value.toLocaleString("en-US")}
      </Typography.Title>
    </Card>
  );
};

export const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>({
    total_amount: 0,
    total_clients: 0,
    total_transactions: 0,
    client_vs_total_amount: [
      {
        label: "",
        value: 0,
      },
    ],
  });

  const handlers: HandlersProps = {
    getData: async (dateRange?: string) => {
      try {
        setLoading(true);
        const query: any = {};
        if (dateRange) {
          query.dateRange = dateRange;
        }

        const res: any = await api.dashboard.getData(dateRange);

        if (res) {
          setData(res);
        }
      } catch (err) {
        ui.notify.error(err);
      } finally {
        setLoading(false);
      }
    },
  };

  useEffect(() => {
    handlers.getData();
  }, []);

  return (
    <Spin spinning={loading}>
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <br />
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <CustomCard
            title="Total Amount"
            value={data.total_amount}
            isPrice={true}
          />
        </Col>
        <Col span={8}>
          <CustomCard
            title="Total Clients"
            value={data.total_clients}
            isPrice={false}
          />
        </Col>
        <Col span={8}>
          <CustomCard
            title="Total Transactions"
            value={data.total_transactions}
            isPrice={false}
          />
        </Col>
      </Row>
      <br />
      <Card>
        <Typography.Title level={4}>Client VS Total Amount</Typography.Title>
        <br />
        <BarChart data={data.client_vs_total_amount} decimal={2} />
      </Card>
    </Spin>
  );
};
