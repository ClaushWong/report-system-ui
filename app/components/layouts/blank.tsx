import React from "react";
import { Row, Col } from "antd";

type Props = {
  children: any;
};

export const BlankLayout = ({ children }: Props) => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: "100vh" }}
      className="login-wrapper-background"
    >
      <Col xs={22} sm={20} md={12} lg={12} xl={8}>
        {children}
      </Col>
    </Row>
  );
};
