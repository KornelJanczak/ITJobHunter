declare global {
  namespace globalThis {
    var __BROWSER__: { newPage: () => Promise<any> };
  }
}

export {};
