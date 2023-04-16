import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function (props: NextPage) {
    const router = useRouter();
    useEffect(() => {
        router.replace("/auth/login");
    }, []);
}
