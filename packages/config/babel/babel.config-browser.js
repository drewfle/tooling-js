module.exports = {
  presets: [
    require.resolve("@babel/preset-react"),
    [
      require.resolve("@babel/preset-env"),
      {
        targets: "> 0.25%, not dead"
      }
    ]
  ],
  plugins: [
    require.resolve("@babel/plugin-proposal-object-rest-spread")
  ]
}
