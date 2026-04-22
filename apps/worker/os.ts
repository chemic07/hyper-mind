import { prismaClient } from "db/client";
import path from "path";
import fs from "fs";

// Use Windows path for local development
const BASE_WORKER_DIR =
  process.platform === "win32" ? "G:\\tmp\\bolty-worker" : "/tmp/bolty-worker";

// Ensure directory exists
if (!fs.existsSync(BASE_WORKER_DIR)) {
  fs.mkdirSync(BASE_WORKER_DIR, { recursive: true });
}

const ws = new WebSocket(process.env.WS_RELAYER_URL || "ws://localhost:9093");

ws.addEventListener("open", () => {
  console.log("WebSocket connected to relayer");
});

ws.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});

ws.addEventListener("close", () => {
  console.log("WebSocket disconnected from relayer");
});

export async function onFileUpdate(
  filePath: string,
  fileContent: string,
  projectId: string
) {
  console.log(`Updating file: ${filePath}`);

  await prismaClient.action.create({
    data: {
      projectId,
      content: `Updated file ${filePath}`,
    },
  });

  // For Docker container, use /tmp/bolty-worker
  const dockerPath = `/tmp/bolty-worker/${filePath}`;

  ws.send(
    JSON.stringify({
      event: "admin",
      data: {
        type: "update-file",
        content: fileContent,
        path: dockerPath,
      },
    })
  );

  // Also write locally for development
  try {
    const fullPath = path.join(BASE_WORKER_DIR, filePath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, fileContent, "utf-8");
    console.log(`File written locally: ${fullPath}`);
  } catch (error) {
    console.error(`Error writing file locally:`, error);
  }
}

export async function onShellCommand(shellCommand: string, projectId: string) {
  const commands = shellCommand.split("&&").map((cmd) => cmd.trim());

  for (const command of commands) {
    console.log(`Running command: ${command}`);
    console.log(`Working directory: ${BASE_WORKER_DIR}`);

    ws.send(
      JSON.stringify({
        event: "admin",
        data: {
          type: "command",
          content: command,
          cwd: "/tmp/bolty-worker", // Use Docker path for container
        },
      })
    );

    await prismaClient.action.create({
      data: {
        projectId,
        content: `Ran command: ${command}`,
      },
    });

    // Optional: Run command locally for development
    // Uncomment if you want to execute commands locally too
    /*
    try {
      const result = Bun.spawnSync({
        cmd: command.split(" "),
        cwd: BASE_WORKER_DIR,
      });
      console.log(`Command output:`, result.stdout?.toString());
      if (result.stderr) {
        console.error(`Command error:`, result.stderr.toString());
      }
    } catch (error) {
      console.error(`Error running command locally:`, error);
    }
    */
  }
}
