import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cacheMap: Map<
    string | null,
    {
      expiresAfter: number;
      value: any;
    }
  > | null = null;

  constructor() {}

  getValue<T>(key: string | null): T | null | undefined {
    if (!this.cacheMap) return null;

    const { expiresAfter, value } = this.cacheMap.get(key) || {};
    const cacheExpired = expiresAfter ? Date.now() > expiresAfter : true;

    return cacheExpired ? null : value;
  }

  setValue<T>(key: string | undefined | null, value: T) {
    if (!key) return;
    const fiveMinutes = Date.now() + 1000 * 60 * 5;

    if (!this.cacheMap) this.cacheMap = new Map();

    this.cacheMap.set(key, {
      expiresAfter: fiveMinutes,
      value,
    });
  }
}
