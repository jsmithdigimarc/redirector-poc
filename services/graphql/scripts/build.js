const { build } = require("esbuild");
const { sync: globSync } = require("glob");

build({
  entryPoints: globSync("./src/**/*.ts"),
  outbase: "./src",
  outdir: "./dist",
  platform: "node",
  format: "cjs",
  watch: false,
});
