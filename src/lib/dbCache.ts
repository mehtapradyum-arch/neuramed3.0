import localforage from "localforage";
localforage.config({ name: "neuramed", storeName: "cache" });

export async function cacheSet(key: string, value: any) {
  return localforage.setItem(key, value);
}
export async function cacheGet<T>(key: string): Promise<T | null> {
  return localforage.getItem<T>(key);
}
