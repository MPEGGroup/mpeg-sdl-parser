/**
 * A hierarchical search structure that allows for searching with progressively shorter suffixes of ID arrays.
 */
export class HierarchicalSearch<T> {
  private store = new Map<string, T>();

  constructor(initialData?: [number[], T][]) {
    if (initialData) {
      for (const [ids, value] of initialData) {
        this.set(ids, value);
      }
    }
  }

  private serializeKey(ids: number[]): string {
    return ids.join(",");
  }

  set(ids: number[], value: T): void {
    this.store.set(this.serializeKey(ids), value);
  }

  get(ids: number[]): T | undefined {
    // Try exact match first
    const exactKey = this.serializeKey(ids);

    if (this.store.has(exactKey)) {
      return this.store.get(exactKey);
    }

    // Try progressively shorter suffixes
    for (let i = 1; i < ids.length; i++) {
      const suffix = ids.slice(i);
      const key = this.serializeKey(suffix);

      if (this.store.has(key)) {
        return this.store.get(key);
      }
    }

    return undefined;
  }
}
