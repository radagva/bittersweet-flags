type IntersectionReturnType = 'key-value-pairs' | 'key-value-object' | 'keys' | 'values'

const freeze = <T extends Record<string, any>>(obj: T) => Object.freeze(obj);

function createOptionset<T extends Record<string, Record<string, number>>>(sets: T) {
  function factory<
    U extends keyof T,
    V extends keyof T[U],
    W extends V | number
  >({
    of: option
  }: {
    of: U;
  }) {

    const origin = sets[option];
    const max = Object.values(origin).reduce<number>((acc, value) => acc + value, 0);
    const keysDict = Object.keys(origin).reduce(
      (acc, key) => ({ ...acc, [key]: key }),
      {} as Record<V, V>,
    );
    const keysArray = Object.keys(origin) as (keyof typeof origin)[];


    function isAccessingByKey(value: unknown): value is V {
      return (value as string) in origin
    }

    function translateValue(value: unknown): number {
      if (isAccessingByKey(value)) {
        return Number(origin[value])
      }

      return Number(value)
    }

    /**
     * @description generates a list of keys for the given flag
     * @param from 
     * @returns number
     */
    function labelsFor(from: number) {
      return Object.entries(origin)
        .filter(([, bit]) => (from & Number(bit)) !== 0)
        .map(([attribute]) => attribute) as V[];
    };

    /**
     * @description takes an array of keys for the created instance of optionset
     * and generates a number representing the flag for that combination of keys
     * @param keys 
     * @returns number
     */
    function valueFor(keys: V[]) {
      return keys.reduce((acc, key) => (acc |= translateValue(key)), 0);
    };

    /**
     * @description Gets the value for an specific key
     * @param ofKey 
     * @returns 
     */
    function valueOf(key: V) {
      return origin[key]
    }

    /**
     * @description checks if an specific key is included into the provided source `value`
     * @param value 
     * @param key 
     * @returns number
     */
    function contains(from: number, key: W) {
      return (from & translateValue(key)) !== 0;
    };

    /**
     * @description checks if all the specified keys are included into the `from` flag
     * @param from 
     * @param keys 
     * @returns 
     */
    function containsAll(from: number, keys: W[]) {
      return keys.map(translateValue).every(key => (from & key) !== 0)
    }

    /**
     * @description adds a new value to a given flag.
     * If the value is already in the flag, the return value will not change.
     * @param from 
     * @param key 
     * @returns number
     */
    function add(from: number, key: W) {
      return from | translateValue(key);
    };

    /**
     * @description Removes a value from a given flag.
     * If the value is not contained by the flag the return value will not change.
     * @param from 
     * @param key 
     * @returns number
     */
    function remove(from: number, key: W) {
      return from & ~translateValue(key);
    };

    /**
     * @description adds a new value to the given flag, is the value was already added, it will be removed
     * @param from 
     * @param key 
     * @returns number
     */
    function toggle(from: number, key: W) {
      return from ^= translateValue(key);
    };

    /**
     * @description return an array of numbers where the given parameters matches.
     * Each number represents the value of the bit flag
     * @param lhs 
     * @param rhs 
     * @returns 
     */
    function intersections(lhs: number, rhs: number, returning?: 'values'): number[]
    /**
     * @description return an array of key,value pairs where the given parameters matches
     * @param lhs 
     * @param rhs 
     * @returns 
     */
    function intersections(lhs: number, rhs: number, returning?: 'key-value-pairs'): [V, number][]
    /**
     * @description return an object of key values pairs where the given parameters matches.
     * The key represents the label and the value represents the bit flag
     * @param lhs 
     * @param rhs 
     * @returns 
     */
    function intersections(lhs: number, rhs: number, returning?: 'key-value-object'): Record<V, number>
    /**
     * @description return an array of strings where the given parameters matches.
     * Each string represents de label of the bit flag
     * @param lhs 
     * @param rhs 
     * @returns 
     */
    function intersections(lhs: number, rhs: number, returning?: 'keys'): V[]
    function intersections(lhs: number, rhs: number, returning: IntersectionReturnType = 'values'): [V, number][] | Record<V, number> | V[] | number[] {
      const filtered = Object.entries(origin).filter(([_, value]) => {
        return (lhs & value) !== 0 && (rhs & value) !== 0;
      })

      switch (returning) {
        case 'key-value-pairs':
          return filtered as [V, number][]
        case 'key-value-object':
          return filtered.reduce((acc, [key, value]) => ({
            ...acc, [key]: value
          }), {}) as Record<V, number>
        case 'keys':
          return filtered.map(([key]) => key as V)
        case 'values':
          return filtered.map(([, value]) => value)
      }
    };

    function difference(lhs: number, rhs: number): number[] {
      return []
    }

    return {
      origin: freeze(origin),
      keysDict: freeze(keysDict),
      keysArray: freeze(keysArray),
      max,
      labelsFor,
      valueFor,
      valueOf,
      contains,
      containsAll,
      add,
      remove,
      toggle,
      intersections,
    };
  };

  return factory;
};

export default createOptionset
