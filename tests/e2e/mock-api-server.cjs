const http = require("node:http");
const { URL } = require("node:url");
const { createInitialState } = require("./mock-api/fixtures.cjs");
const {
  nowIso,
  clone,
  createSharedHelpers,
  parseBody,
  sendJson,
  sendText,
  setCorsHeaders,
} = require("./mock-api/shared.cjs");
const { dispatchRequest } = require("./mock-api/router.cjs");

const port = Number(process.env.PLAYWRIGHT_MOCK_API_PORT || 4010);
const baseUrl = `http://127.0.0.1:${port}`;
const apiBaseUrl = `${baseUrl}/api/v1`;
const state = createInitialState();
const {
  issueTokenPair,
  getCurrentUserFromRequest,
  getUserByRefreshToken,
  envelope,
  makeProperty,
  makeRentRequest,
} = createSharedHelpers(state);

async function handleRequest(req, res) {
  const requestUrl = new URL(req.url, baseUrl);
  const origin = req.headers.origin || "*";

  if (req.method === "OPTIONS") {
    setCorsHeaders(res, origin);
    res.writeHead(204);
    res.end();
    return;
  }

  const handled = await dispatchRequest({
    req,
    res,
    requestUrl,
    origin,
    baseUrl,
    state,
    nowIso,
    clone,
    parseBody,
    sendJson,
    sendText,
    issueTokenPair,
    getCurrentUserFromRequest,
    getUserByRefreshToken,
    envelope,
    makeProperty,
    makeRentRequest,
  });

  if (!handled) {
    sendText(res, 404, "Not found", origin);
  }
}

const server = http.createServer((req, res) => {
  void handleRequest(req, res);
});

function listen() {
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => {
      resolve();
    });
  });
}

function close() {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

module.exports = {
  apiBaseUrl,
  baseUrl,
  port,
  server,
  listen,
  close,
};

if (require.main === module) {
  listen().then(() => {
    console.log(`Mock API server listening on ${apiBaseUrl}`);
  });
}
