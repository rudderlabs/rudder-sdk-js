const presets = [
  [
    "@babel/env",
    {
      targets: {
        chrome: "67"
      },
      useBuiltIns: "usage"
    }
  ]
];

module.exports = { presets };
