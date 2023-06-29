module.exports = {
  extends: ["taro/react"],
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "jsx-quotes": ["error", "prefer-double"],
    "no-shadow": "off", // 关闭，变量名重复警告
    "@typescript-eslint/no-shadow": "off", // 关闭，变量名重复警告
  },
};
