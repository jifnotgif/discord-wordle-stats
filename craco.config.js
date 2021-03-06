const path = require(`path`);
const alias = require(`./src/config/aliases`);

const SRC = `./src`;
const aliases = alias(SRC);

const resolvedAliases = Object.fromEntries(
  Object.entries(aliases).map(([key, value]) => [key, path.resolve(__dirname, value)]),
);

module.exports = {
  webpack: {
    alias: {
        '@': path.join(path.resolve(__dirname, './src')),
        ...resolvedAliases
    }
  },
  jest: {
    configure: {
        globals: {
            "CONFIG": true.valueOf,
            "ts-jest": {
                diagnostics: false
              }
        },
        moduleNameMapper: {
            "^@/(.*)$": "<rootDir>/src/$1",
            "^@components(.*)$": "<rootDir>/src/components$1",
            "^@utils(.*)$": "<rootDir>/src/utils$1"
        }
    }
  }
};