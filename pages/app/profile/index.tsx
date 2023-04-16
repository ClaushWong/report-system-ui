import { PortalLayout } from "@/app/components/layouts/portal";
import { Profile } from "@/app/containers/auth";
import type { NextPage } from "next";

export default function (props: NextPage) {
  return (
    <PortalLayout>
      <Profile />
    </PortalLayout>
  );
}
