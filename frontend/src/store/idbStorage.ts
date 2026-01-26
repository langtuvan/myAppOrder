"use client";

import type { StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

export function createIDBStorage(keyPrefix = "zustand"): StateStorage {
  return {
    async getItem(name) {
      const key = `${keyPrefix}:${name}`;
      const value = await get<string | null>(key);
      return value ?? null;
    },
    async setItem(name, value) {
      const key = `${keyPrefix}:${name}`;
      await set(key, value);
    },
    async removeItem(name) {
      const key = `${keyPrefix}:${name}`;
      await del(key);
    },
  };
}
