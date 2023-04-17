import { Base } from "@/app/services/api/base";

export class Dashboard extends Base {
    protected path = "dashboard";

    async getData(query: any) {
        return this.http.get(
            `/api/core/${this.path}/${this.toQueryString({
                ...query,
            })}`
        );
    }

    async exportExcel(query: unknown) {
        return this.doDownload(
            `/api/core/${this.path}/xls${this.toQueryString(query)}`,
            { acceptType: "application/xlsx" }
        );
    }
}
