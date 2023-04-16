import { Base } from "@/app/services/api/base";
import { storage } from "@/app/services";

import { STORAGE_KEYS } from "@/app/constants";
import { IUser } from "@/app/models/api.models";
import { IMessage, LoginCredentitals } from "@/app/models/ui.models";

export class Auth extends Base {
    async login(credential: LoginCredentitals) {
        return this.http
            .post<any, { token: string }>("/api/core/auth/login", credential)
            .then((rs) => {
                storage.local.set(STORAGE_KEYS.ACCESS_TOKEN, rs.token);
                return { success: true };
            });
    }

    profile() {
        return this.http.get<any, { user: IUser }>("/api/core/auth/profile");
    }

    get token() {
        return {
            clear: (): void => {
                storage.local.remove(STORAGE_KEYS.USER);
                storage.local.remove(STORAGE_KEYS.ACCESS_TOKEN);
                storage.local.remove(STORAGE_KEYS.REFRESH_TOKEN);
            },
            is_exists: (): boolean =>
                storage.local.has(STORAGE_KEYS.ACCESS_TOKEN),
        };
    }

    logout(): Promise<IMessage> {
        return new Promise((resolve, reject) => {
            this.token.clear();
            resolve({ message: "success" });
        });
    }

    get password() {
        return {
            forget: (username: string) =>
                this.http.post<any, any>("/api/core/auth/forget-password", {
                    username,
                }),
            reset: (username: string, reset_code: string, password: string) =>
                this.http.post("/api/core/auth/reset-password", {
                    username,
                    reset_code,
                    password,
                }),
            update: (current: string, new_password: string) =>
                this.http.put("/api/core/auth/password", {
                    current,
                    password: new_password,
                }),
        };
    }
}
