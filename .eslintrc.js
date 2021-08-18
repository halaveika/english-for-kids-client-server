module.exports = {
  root: true,
  parser: "@typescript-eslint/parser", 
  ignorePatterns: ["client"],
  extends: [
    "airbnb-base"                          
  ],
  rules: {
    "max-len": ["error", { "code": 120 }],
    "class-methods-use-this": "off",
    "no-undef": "off",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "camelcase": "off",
    "consistent-return": "off",
    "import/no-named-default" : "off"
  }                            
}