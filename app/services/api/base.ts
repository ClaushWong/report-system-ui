import { AxiosInstance } from "axios";
import { IPagination } from "@/app/models/ui.models";
import { SorterResult } from "antd/es/table/interface";

const objectToQueryString = (obj: any) => {
  return Object.keys(obj)
    .map((key) => {
      const v = obj[key];
      return v !== null && v !== undefined ? key + "=" + v : null;
    })
    .filter((v) => v !== null)
    .join("&");
};

export abstract class Base {
  public constructor(protected readonly http: AxiosInstance) {}

  toQueryString(params: any) {
    let query = "";
    if (params) {
      query = "?" + objectToQueryString(params);
    }
    return query;
  }

  toPaginationQuery(pagination: IPagination): {
    offset: number;
    limit: number;
  } {
    const query = {
      offset: 0,
      limit: 50, //default 50
    };
    if (pagination && Object.keys(pagination).length > 0) {
      const { current, pageSize } = pagination;
      query.limit = pageSize ?? query.limit;
      query.offset = current ? (Math.max(1, current) - 1) * query.limit : 0;
    }
    return query;
  }

  toSorter(sorter: SorterResult<any>): any {
    if (sorter?.field) {
      const key = Array.isArray(sorter.field)
        ? sorter.field.join(".")
        : sorter.field;
      if (sorter.order === "descend") {
        return { sort: `-${key}` };
      } else if (sorter.order === "ascend") {
        return { sort: `+${key}` };
      }
    }
    return {};
  }

  protected doDownload(
    path: string,
    { acceptType, download }: { acceptType: string; download?: string }
  ) {
    const headers = {
      Accept: acceptType,
    };
    return this.http
      .get(path, { headers, responseType: "blob" })
      .then((blob: any) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        if (download) {
          link.download = download;
        } else {
          link.target = "_blank";
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        let timeout = setTimeout(() => {
          window.URL.revokeObjectURL(link.href);
          clearTimeout(timeout);
        }, 100);
        return link;
      });
  }

  protected doGet<T, R>(path: string, params: any) {
    return this.http.get<T, R>(`${path}${this.toQueryString(params)}`);
  }
}
