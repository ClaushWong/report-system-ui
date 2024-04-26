import { PortalLayout } from "@/app/components/layouts/portal";
import { TransactionList } from "@/app/containers/transaction";
import type { NextPage } from "next";

export default function (props: NextPage) {
  return (
    <PortalLayout>
      <TransactionList />
    </PortalLayout>
  );
}
