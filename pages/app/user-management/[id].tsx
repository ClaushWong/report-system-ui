import { PortalLayout } from "@/app/components/layouts/portal";
import { UserForm } from "@/app/containers/user";
import type { NextPage } from "next";
import { useRouter } from "next/router";

export default function (props: NextPage) {
    const router = useRouter();
    const { id } = router.query as { id: string };

    let content = <UserForm />;
    if (id !== "create") {
        content = <UserForm id={id} />;
    }

    return <PortalLayout>{content}</PortalLayout>;
}
