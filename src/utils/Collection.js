class Collection extends Map {

  filter(fn) {
    const results = new Collection();
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }
    return results;
  }

  map(fn) {
    const arr = [];
    for (const [key, val] of this) arr.push(fn(val, key, this));
    return arr;
  }

  random(condition) {
    const arr = Array.from(this.values());
    if (arr.length === 0) return undefined;
    if (!arr.length) return arr[Math.floor(Math.random() * arr.length)];

    if (typeof condition === "string") return arr.filter(val => val === condition)[Math.floor(Math.random() * arr.filter(val => val === condition).length)];

    if (condition) arr.filter(condition);
    return arr[Math.floor(Math.random() * arr.length)];
  }

  ensure(key, value) {
    if (!this.has(key)) this.set(key, value);
    return this.get(key);
  }

  forEach(fn) {
    for (const [key, val] of this) fn(val, key, this);
  }

  get(key) {
    return super.get(key);
  }

  sort(fn) {
    return this.array().sort(fn);
  }

  sweep(fn) {
    const results = new Collection();
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }
    return results;
  }

  update(key, value) {
    if (!this.has(key)) return;
    const val = this.get(key);
    const res = typeof value === "function" ? value(val) : value;
    this.set(key, res);
    return res;
  }

}

module.exports = Collection;