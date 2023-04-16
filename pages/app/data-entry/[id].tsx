import { PortalLayout } from "@/app/components/layouts/portal";
import { DataEntryForm } from "@/app/containers/data-entry";
import type { NextPage } from "next";
import { useRouter } from "next/router";

export default function (props: NextPage) {
    const router = useRouter();
    const { id } = router.query as { id: string };

    let content = <DataEntryForm />;
    if (id !== "create") {
        content = <DataEntryForm id={id} />;
    }

    return <PortalLayout>{content}</PortalLayout>;
}
