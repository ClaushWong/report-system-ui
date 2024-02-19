import { PortalLayout } from "@/app/components/layouts/portal";
import { ClientList } from "@/app/containers/client";
import type { NextPage } from "next";

export default function (props: NextPage) {
    return (
        <PortalLayout>
            <ClientList />
        </PortalLayout>
    );
}
