import { PortalLayout } from "@/app/components/layouts/portal";
import { UserList } from "@/app/containers/user";
import type { NextPage } from "next";

export default function (props: NextPage) {
    return (
        <PortalLayout>
            <UserList />
        </PortalLayout>
    );
}
