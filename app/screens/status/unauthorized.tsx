import { Button, Result } from "antd";

type Props = {
  message: string;
};
export const UnauthorizedScreen = (props: Props) => {
  const { message } = props;
  return (
    <Result
      status="warning"
      title={message}
      extra={
        <Button type="primary" key="console" href={"/auth/login"}>
          Go to Login
        </Button>
      }
    />
  );
};
