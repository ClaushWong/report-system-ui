import type { NextPage } from "next";
import { Auth } from "@/app/containers";

export default function (props: NextPage) {
  return <Auth.Login />;
}
