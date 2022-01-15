import { useState, useEffect } from 'preact/hooks';
import differenceInSeconds from 'date-fns/differenceInSeconds';

// In-memory cache
const CACHE = {};
const cache = {
  get(key) {
    return CACHE[key];
  },

  set(key, data) {
    CACHE[key] = {
      storedAt: new Date(),
      data,
    };
  },

  delete(key) {
    delete CACHE[key];
  },
};

/**
 * @typedef UsePromiseOptions
 * @property [defaultValue] {any}
 * @property [dependencies = []] {Array}
 * @property [conditions = []] {Array}
 * @property [cacheKey] {string}
 * @property [updateWithRevalidated = false] {boolean}
 * @property [cachePeriodInSecs = 10] {number}
 */

/**
 * @template T
 * @param {(() => Promise<T>)} promise
 * @param {UsePromiseOptions} [options]
 * @returns {[T, { isFetching: boolean, fetchedAt: Date, reFetch: Function, error: Error }]}
 */
function usePromise(promise, options = {}) {
  const {
    defaultValue, dependencies = [], cacheKey, updateWithRevalidated = true, cachePeriodInSecs = 10,
    conditions = [],
  } = options;

  let cachedData;
  if (cacheKey) {
    cachedData = cache.get(cacheKey);
  }

  const [result, setResult] = useState(defaultValue);
  const [fetchedAt, setFetchedAt] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  let didCancel = false;

  async function fetch() {
    if (cachedData) {
      if (cachedData.storedAt
        && differenceInSeconds(new Date(), new Date(cachedData.storedAt)) < cachePeriodInSecs) {
        return;
      }
    }

    setIsFetching(true);

    try {
      const data = await promise();
      if (!didCancel) {
        // In some cases newly fetched data don't have to be updated (updateWithRevalidated = false)
        if (updateWithRevalidated || cachedData === undefined) {
          setResult(data);
          setFetchedAt(new Date());
        }

        if (cacheKey) {
          cache.set(cacheKey, data);
        }
      }
    } catch (e) {
      if (!didCancel) {
        // eslint-disable-next-line no-console
        console.error('Error on fetching data', e);
        setError(e);

        if (cacheKey) {
          cache.delete(cacheKey);
        }
      }
    }

    setIsFetching(false);
  }

  useEffect(() => {
    const allConditionsValid = conditions.every((condition) => {
      if (typeof condition === 'function') return !!condition();
      return !!condition;
    });

    if (!allConditionsValid) return;

    fetch();

    // eslint-disable-next-line consistent-return
    return () => {
      didCancel = true;
    };
  }, [...dependencies, ...conditions]);

  function reFetch() {
    if (cacheKey) {
      cache.delete(cacheKey);
      cachedData = undefined;
    }
    return fetch();
  }

  return [cachedData ? cachedData.data : result, {
    isFetching, fetchedAt: cachedData ? cachedData.storedAt : fetchedAt, reFetch, error,
  }];
}

export default usePromise;
