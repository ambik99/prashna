// A stand-in for the Workers runtime's "cloudflare:workers" module, so the
// Worker's modules load in Vitest under Node (see vitest.config.ts).

export class DurableObject<Env = unknown> {
  constructor(
    protected ctx: DurableObjectState,
    protected env: Env,
  ) {}
}
