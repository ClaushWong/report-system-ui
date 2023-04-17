import { PortalLayout } from "@/app/components/layouts/portal";
import { RoleForm } from "@/app/containers/role";
import type { NextPage } from "next";
import { useRouter } from "next/router";

export default function (props: NextPage) {
    const router = useRouter();
    const { id } = router.query as { id: string };

    let content = <RoleForm />;
    if (id !== "create") {
        content = <RoleForm id={id} />;
    }

    return <PortalLayout>{content}</PortalLayout>;
}
