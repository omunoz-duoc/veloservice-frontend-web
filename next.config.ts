import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
	/* config options here */
};

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
export default function config(phase: string): NextConfig {
	if (phase === PHASE_DEVELOPMENT_SERVER) {
		initOpenNextCloudflareForDev();
	}

	return nextConfig;
}
