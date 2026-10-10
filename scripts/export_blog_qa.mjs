/** Load the same typed article records as Vite for the browser QA harness. */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const server = await createServer({
  root,
  configFile: false,
  logLevel: "silent",
  appType: "custom",
  server: { middlewareMode: true, watch: null },
});

try {
  const { blogPosts } = await server.ssrLoadModule("/src/data/blog.ts");
  process.stdout.write(JSON.stringify(blogPosts));
} finally {
  await server.close();
}
