import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
	turbopack: {
		root: projectRoot,
	},
};

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
export default function config(phase: string): NextConfig {
	if (phase === PHASE_DEVELOPMENT_SERVER) {
		initOpenNextCloudflareForDev();
	}

	return nextConfig;
}
