/* eslint-env node */

module.exports = {
  presets: [
    [
      "@babel/preset-env", {
        modules: false,
        loose: true,
        targets: {
          esmodules: true
        }
      }
    ],
    [
      "@babel/preset-react", {
        pragma: "h"
      }
    ]
  ],
  plugins: [
    [
      "transform-react-remove-prop-types", {
        mode: "remove",
        removeImport: true
      }
    ]
  ]
};
