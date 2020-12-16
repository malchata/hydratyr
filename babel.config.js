/* eslint-env node */

module.exports = {
  presets: [
    "@babel/preset-react"
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
