export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (globalThis.__instrumentation_setup) return;
    globalThis.__instrumentation_setup = true;
    
    const { startPolling } = await import("@/utils/scraper");
    console.log("Starting polling...");
    await startPolling();
  }
}
