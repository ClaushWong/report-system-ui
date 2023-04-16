import { Base } from "@/app/services/api/base";

export class Setting extends Base {
  general(): Promise<any> {
    return this.http.get<any>(`/api/settings/general`);
  }

  options(): Promise<any> {
    return this.http.get<any>(`/api/settings/options`);
  }

  get(keys: string[]): Promise<any> {
    return this.http.get<any>(`/api/settings${this.toQueryString({ keys })}`);
  }

  getOne(key: string): Promise<any> {
    return this.http.get<any>(`/api/customer/settings/${key}`);
  }

  update(settings: any): Promise<any> {
    return this.http.put("/api/settings", settings);
  }

  get test() {
    return {
      email: (
        to: string,
        settings: any
      ): Promise<{ message: string; success: boolean }> => {
        return this.http.post("/api/settings/test/email", { ...settings, to });
      },
    };
  }
}
