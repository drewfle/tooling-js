module.exports = {
  plugins: [
    // require('autoprefixer'),
    require("postcss-preset-env"),
    require("postcss-import"),
    require("postcss-mixins"), // before simple vars and nested
    require("postcss-nested"),
    require("postcss-modules"),
  ]
}