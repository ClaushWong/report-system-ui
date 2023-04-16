import { IPagination } from "@/app/models/ui.models";
import { Base } from "@/app/services/api/base";

type BodyDTO = {
  name: string;
};

type QueryProps = {
  name: string;
};

export class Company extends Base {
  async list(pagination: unknown, query: unknown) {
    const page = this.toPaginationQuery(pagination as IPagination);

    const queryItems = query as QueryProps;

    return this.http.get(
      `/api/core/company${this.toQueryString({ ...page, ...queryItems })}`
    );
  }

  async get(id: string) {
    return this.http.get(`/api/core/company/${id}`);
  }

  async create(body: BodyDTO) {
    return this.http.post(`/api/core/company`, body);
  }

  async update(id: string, body: BodyDTO) {
    return this.http.put(`/api/core/company/${id}`, body);
  }

  async delete(id: string) {
    return this.http.delete(`/api/core/company/${id}`);
  }
}
