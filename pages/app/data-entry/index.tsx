import { PortalLayout } from "@/app/components/layouts/portal";
import { DataEntryList } from "@/app/containers/data-entry";
import type { NextPage } from "next";

export default function (props: NextPage) {
    return (
        <PortalLayout>
            <DataEntryList />
        </PortalLayout>
    );
}
