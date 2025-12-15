// Demo API credentials for testing
export const DEMO_CREDENTIALS = {
  bria: "demo_bria_key_12345",
  replicate: "demo_r8_abcdef123456789",
  fal: "demo_fal_key_xyz789",
  runware: "demo_runware_token_456"
};

export function loadDemoCredentials() {
  localStorage.setItem("bria_api_key", DEMO_CREDENTIALS.bria);
  localStorage.setItem("replicate_api_key", DEMO_CREDENTIALS.replicate);
  localStorage.setItem("fal_api_key", DEMO_CREDENTIALS.fal);
  localStorage.setItem("runware_api_key", DEMO_CREDENTIALS.runware);
}