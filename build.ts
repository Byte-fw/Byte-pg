import fs from "fs/promises";
const isNode = process.argv.includes("--node");

await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./build",
    packages: "bundle",
    target: "node",
    format: "cjs"
});

if (isNode) {
    await fs.rename("./build/index.js", "./build/index.cjs");
}
