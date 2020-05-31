const withSass = require("@zeit/next-sass");
const withLess = require("@zeit/next-less");
const withCSS = require("@zeit/next-css");

const isProd = process.env.NODE_ENV === "production";

// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
  require.extensions[".less"] = file => {};
}

module.exports = withCSS(
  withLess(
    withSass({
      webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          issuer: {
            test: /\.(js|ts)x?$/
          },
          use: ["@svgr/webpack"]
        });
        config.module.rules.push({
          test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
          issuer: {
            test: /\.(css|less|scss)$/
          },
          use: {
            loader: "url-loader",
            options: {
              limit: 100000,
              name: "[name].[ext]"
            }
          }
        });

        return config;
      },
      publicRuntimeConfig: {
        localeSubpaths:
          typeof process.env.LOCALE_SUBPATHS === "string"
            ? process.env.LOCALE_SUBPATHS
            : "none"
      },
      lessLoaderOptions: {
        javascriptEnabled: true
      }
    })
  )
);
