const { spawn } = require("node:child_process");

const mockApi = require("../tests/e2e/mock-api-server.cjs");

const nextBin = require.resolve("next/dist/bin/next");
const devPort = process.env.PORT || "3000";

let nextProcess = null;

async function main() {
  await mockApi.listen();
  console.log(`Mock API server ready at ${mockApi.apiBaseUrl}`);

  nextProcess = spawn(process.execPath, [nextBin, "dev"], {
    stdio: "inherit",
    shell: false,
    env: {
      ...process.env,
      PORT: devPort,
      NEXT_PRIVATE_API_URL: mockApi.apiBaseUrl,
    },
  });

  nextProcess.on("exit", async (code, signal) => {
    try {
      await mockApi.close();
    } catch {
      // ignore
    }

    process.exit(signal ? 1 : (code ?? 0));
  });
}

async function shutdown(signal) {
  if (nextProcess && !nextProcess.killed) {
    nextProcess.kill(signal);
  }
  try {
    await mockApi.close();
  } catch {
    // ignore
  }
}

process.on("SIGINT", () => {
  void shutdown("SIGINT").then(() => process.exit(130));
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM").then(() => process.exit(143));
});

main().catch(async (error) => {
  console.error(error);
  try {
    await mockApi.close();
  } catch {
    // ignore
  }
  process.exit(1);
});
