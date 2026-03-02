import type { backendInterface } from "./backend.d";
/**
 * Singleton backend client for use throughout the app.
 * Uses anonymous (unauthenticated) actor by default.
 * For authenticated calls, the useActor hook should be used with React Query.
 */
import { createActorWithConfig } from "./config";

let _backend: backendInterface | null = null;

export async function getBackend(): Promise<backendInterface> {
  if (_backend) return _backend;
  _backend = await createActorWithConfig();
  return _backend;
}

// Proxy-based backend that lazily initializes the actor
// This allows synchronous usage in components while the actor loads asynchronously
const handler: ProxyHandler<object> = {
  get(_target, prop) {
    if (typeof prop === "string") {
      return (...args: unknown[]) =>
        getBackend().then((b) =>
          (b as unknown as Record<string, (...a: unknown[]) => unknown>)[
            prop
          ]?.(...args),
        );
    }
    return undefined;
  },
};

export const backend = new Proxy({}, handler) as backendInterface;
