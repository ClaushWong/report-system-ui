import { PortalLayout } from "@/app/components/layouts/portal";
import { ClientForm } from "@/app/containers/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";

export default function (props: NextPage) {
    const router = useRouter();
    const { id } = router.query as { id: string };

    let content = <ClientForm />;
    if (id !== "create") {
        content = <ClientForm id={id} />;
    }

    return <PortalLayout>{content}</PortalLayout>;
}
