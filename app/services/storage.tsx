const security = {
  encrypt: (value: any) => value,
  decrypt: (encrypted: any) => encrypted,
};

export const local = {
  has: (key: string) => localStorage.getItem(key) !== null,
  get: {
    value: (key: string, defaultValue: any = null) => {
      const v = localStorage.getItem(key);
      if (v === null || v === undefined) {
        return defaultValue;
      }
      return security.decrypt(v);
    },
    object: (key: string, defaultValue: any = null) => {
      const v = localStorage.getItem(key);
      if (v === null || v === undefined) {
        return defaultValue;
      }
      return JSON.parse(security.decrypt(v));
    },
  },
  set: (key: string, value: any) => {
    const v = typeof value === "object" ? JSON.stringify(value) : value;
    return localStorage.setItem(key, security.encrypt(v));
  },
  remove: (key: string) => localStorage.removeItem(key),
};

export const session = {
  remove: (key: string) => sessionStorage.removeItem(key),
  set: (key: string, value: any) => {
    const v = typeof value === "object" ? JSON.stringify(value) : value;
    return sessionStorage.setItem(key, security.encrypt(v));
  },
  has: (key: string) => sessionStorage.getItem(key) !== null,
  get: {
    value: (key: string, defaultValue = null): any => {
      const v = sessionStorage.getItem(key);
      if (v === null || v === undefined) {
        return defaultValue;
      }
      return security.decrypt(v);
    },
    object: (key: string, defaultValue: any = null): any => {
      const v = sessionStorage.getItem(key);
      if (v === null || v === undefined) {
        return defaultValue;
      }
      return JSON.parse(security.decrypt(v));
    },
  },
};
