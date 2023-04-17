import { IPagination } from "@/app/models/ui.models";
import { Base } from "@/app/services/api/base";

type BodyDTO = {
    username: string;
    name: string;
    type: string;
    role: string;
    password: string;
};

type QueryProps = {
    name: string;
    type: string;
};

export class User extends Base {
    protected path = "user";

    async list(pagination: unknown, query: unknown) {
        const page = this.toPaginationQuery(pagination as IPagination);

        const queryItems = query as QueryProps;

        return this.http.get(
            `/api/core/${this.path}/${this.toQueryString({
                ...page,
                ...queryItems,
            })}`
        );
    }

    async get(id: string) {
        return this.http.get(`/api/core/${this.path}/${id}`);
    }

    async create(body: BodyDTO) {
        return this.http.post(`/api/core/${this.path}`, body);
    }

    async update(id: string, body: BodyDTO) {
        return this.http.put(`/api/core/${this.path}/${id}`, body);
    }

    async delete(id: string) {
        return this.http.delete(`/api/core/${this.path}/${id}`);
    }

    async suspend(id: string) {
        return this.http.put(`/api/core/${this.path}/${id}/suspend`);
    }

    async active(id: string) {
        return this.http.put(`/api/core/${this.path}/${id}/active`);
    }
}
