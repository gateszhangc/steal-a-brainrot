import next from "eslint-config-next";

export default [
  ...next(),
  {
    rules: {
      "@next/next/no-sync-scripts": "off"
    }
  }
];
