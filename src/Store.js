const Store = {
  saveState(key, state) {
    localStorage.setItem(key, JSON.stringify(state));
  },
  getState(key) {
    return JSON.parse(localStorage.getItem(key));
  }
};

export default Store;

