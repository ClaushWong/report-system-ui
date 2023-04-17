import { PortalLayout } from "@/app/components/layouts/portal";
import { RoleList } from "@/app/containers/role";
import type { NextPage } from "next";

export default function (props: NextPage) {
    return (
        <PortalLayout>
            <RoleList />
        </PortalLayout>
    );
}
