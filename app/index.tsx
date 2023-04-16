import { Layout } from "antd";

export const App: React.FC<any> = (props) => {
  const { children } = props;
  return (
    <Layout>
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
};
