import { PortalLayout } from "@/app/components/layouts/portal";
import { Dashboard } from "@/app/containers/dashboard";
import type { NextPage } from "next";

export default function (props: NextPage) {
    return (
        <PortalLayout>
            <Dashboard />
        </PortalLayout>
    );
}
