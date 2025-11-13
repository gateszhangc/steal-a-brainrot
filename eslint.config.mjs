import next from "eslint-config-next";

export default [
  ...next(),
  {
    rules: {
      // 禁用所有规则
      "@next/next/no-sync-scripts": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-implicit-any": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/rules-of-hooks": "off",
      "no-console": "off",
      "no-debugger": "off",
      "no-unused-vars": "off",
      "no-undef": "off"
    }
  }
];
