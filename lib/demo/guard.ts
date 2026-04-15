export class DemoModeError extends Error {
  constructor() {
    super("DEMO_MODE_BLOCKED");
    this.name = "DemoModeError";
  }
}

export function assertNotDemo(demoMode: boolean) {
  if (demoMode) throw new DemoModeError();
}
