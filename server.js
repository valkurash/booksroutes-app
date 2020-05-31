const express = require("express");
const next = require("next");
const nextI18NextMiddleware = require("next-i18next/middleware").default;
const cookieParser = require("cookie-parser");

const nextI18next = require("./i18n");

const port = process.env.PORT || 3000;
const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();
  server.use(cookieParser());
  await nextI18next.initPromise;
  server.use(nextI18NextMiddleware(nextI18next));

  server.get("*", (req, res) => {
    if (req.url === "/") {
      res
        .status(301)
        .redirect(`/${req.cookies["next-i18next"] === "en" ? "en" : "ru"}/1`);
    } else if (req.url === "/ru" || req.url === "/en") {
      res.status(301).redirect(`/${req.url}/1`);
    } else {
      handle(req, res);
    }
  });

  await server.listen(port);
  console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
})();
