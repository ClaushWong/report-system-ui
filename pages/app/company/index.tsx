import { PortalLayout } from "@/app/components/layouts/portal";
import { CompanyList } from "@/app/containers/company";
import type { NextPage } from "next";

export default function (props: NextPage) {
    return (
        <PortalLayout>
            <CompanyList />
        </PortalLayout>
    );
}
