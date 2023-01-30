/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json";

const getPackageName = () => {
    return packageJson.name;
};

const getPackageNameCamelCase = () => {
    try {
        return getPackageName().replace(/-./g, (char) => char[1].toUpperCase());
    } catch (err) {
        throw new Error("Name property in package.json is missing.");
    }
};

const fileName: { [key: string]: string } = {
    es: `${getPackageName()}.mjs`,
    cjs: `${getPackageName()}.cjs`,
    iife: `${getPackageName()}.iife.js`,
    umd: `${getPackageName()}.umd.js`
};

module.exports = defineConfig({
    base: "./",
    build: {
        target: "esnext",
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: getPackageNameCamelCase(),
            formats: ["es", "cjs", "iife", "umd"],
            fileName: (format) => fileName[format],
        },
    },
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            reporter: ['text-summary', 'text'],
        },
        mockReset: true,
        restoreMocks: true,
    }
});