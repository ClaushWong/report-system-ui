import { PortalLayout } from "@/app/components/layouts/portal";
import { TransactionForm } from "@/app/containers/transaction";
import type { NextPage } from "next";
import { useRouter } from "next/router";

export default function (props: NextPage) {
  const router = useRouter();
  const { id } = router.query as { id: string };

  let content = <TransactionForm />;
  if (id !== "create") {
    content = <TransactionForm id={id} />;
  }

  return <PortalLayout>{content}</PortalLayout>;
}
