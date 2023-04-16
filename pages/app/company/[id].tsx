import { PortalLayout } from "@/app/components/layouts/portal";
import { CompanyForm } from "@/app/containers/company";
import type { NextPage } from "next";
import { useRouter } from "next/router";

export default function (props: NextPage) {
    const router = useRouter();
    const { id } = router.query as { id: string };

    let content = <CompanyForm />;
    if (id !== "create") {
        content = <CompanyForm id={id} />;
    }

    return <PortalLayout>{content}</PortalLayout>;
}
