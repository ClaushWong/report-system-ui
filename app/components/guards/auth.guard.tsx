import React, { useEffect } from "react";
import { REDUX_ACTIONS, useAppAuthStore } from "@/stores/index";
import { api, ui } from "@/app/services";

import { Status } from "@/app/screens";
import { useDispatch } from "react-redux";
import { useFetchProfile } from "@/stores/dispatcher";
import { useRouter } from "next/router";

export const AuthGuard: React.FC<any> = ({ children }) => {
    const user = useAppAuthStore()?.user;
    const dispatch = useDispatch();
    const router = useRouter();

    const fetchProfile = useFetchProfile();
    useEffect(() => {
        if (user) {
            api.auth
                .profile()
                .then((user) => {
                    dispatch({
                        type: REDUX_ACTIONS.SET_USER,
                        payload: { user },
                    });
                    fetchProfile();
                })
                .catch((err) => {
                    if (err?.statusCode === 401) {
                        if (api.auth.token.is_exists()) {
                            api.auth.token.clear();
                            ui.notify.info("Session Expired");
                        }
                        router.replace("/auth/login");
                    }
                });
        } else {
            api.auth.token.clear();
            ui.notify.info("Login Required");
            router.replace("/auth/login");
        }
        return () => {};
    }, []);

    return user ? children : <Status.Unauthorized message="Unauthorized" />;
};
