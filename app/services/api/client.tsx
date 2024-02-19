import { IPagination } from "@/app/models/ui.models";
import { Base } from "@/app/services/api/base";

type BodyDTO = {
    name: string;
    user?: string;
};

type QueryProps = {
    name: string;
    user?: string;
};

export class Client extends Base {
    async list(pagination: unknown, query: unknown) {
        const page = this.toPaginationQuery(pagination as IPagination);

        const queryItems = query as QueryProps;

        return this.http.get(
            `/api/core/clients${this.toQueryString({ ...page, ...queryItems })}`,
        );
    }

    async get(id: string) {
        return this.http.get(`/api/core/clients/${id}`);
    }

    async create(body: BodyDTO) {
        return this.http.post(`/api/core/clients`, body);
    }

    async update(id: string, body: BodyDTO) {
        return this.http.put(`/api/core/clients/${id}`, body);
    }

    async delete(id: string) {
        return this.http.delete(`/api/core/clients/${id}`);
    }
}
