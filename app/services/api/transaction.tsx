import { IPagination } from "@/app/models/ui.models";
import { Base } from "@/app/services/api/base";

type BodyDTO = {
  client: string;
  category: string;
  date: string;
  amount: number;
  remarks: string;
};

type QueryProps = {
  dateRange: string;
};

export class Transaction extends Base {
  protected path = "transactions";

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

  async exportExcel(query: unknown) {
    return this.doDownload(
      `/api/core/${this.path}/xls${this.toQueryString(query as QueryProps)}`,
      { acceptType: "application/xlsx" }
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
}
