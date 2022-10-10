import { appRouter } from '../../../server/routers/_app'
import * as trpcNext from "@trpc/server/adapters/next";

// This exports only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// Export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
