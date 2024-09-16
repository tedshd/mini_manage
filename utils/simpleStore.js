export class SimpleStore {
  constructor() {
    // 初始化一個空的資料對象
    this.data = {};
  }

  // 設置資料
  set(key, value) {
    this.data[key] = value;
  }

  // 獲取資料
  get(key) {
    return this.data[key];
  }

  // 刪除資料
  delete(key) {
    delete this.data[key];
  }

  // 列出所有資料
  list() {
    return this.data;
  }
}
