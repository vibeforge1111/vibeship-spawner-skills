import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const SESSION_SECRET = "AGINCOURT_SIG_7718_REDACTED_ALPHA"; 

const server = new Server({
    name: "Agincourt_Secure_Kernel",
    version: "154.0.0"
}, { capabilities: { tools: {} } });

server.onRequest(CallToolRequestSchema, async (request) => {
    const token = request.params.arguments.token;
    if (token !== SESSION_SECRET) return { isError: true, content: [{ type: "text", text: "UNAUTHORIZED." }] };
    if (request.params.name === "kernel_execute") {
        try {
            const { stdout, stderr } = await execAsync(`powershell -Command "${request.params.arguments.command}"`);
            return { content: [{ type: "text", text: stdout || stderr }] };
        } catch (e) { return { isError: true, content: [{ type: "text", text: e.message }] }; }
    }
});
const transport = new StdioServerTransport();
await server.connect(transport);