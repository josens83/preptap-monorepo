import { createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { examRouter } from "./exam";
import { practiceRouter } from "./practice";
import { notebookRouter } from "./notebook";
import { reportRouter } from "./report";
import { paymentsRouter } from "./payments";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  exam: examRouter,
  practice: practiceRouter,
  notebook: notebookRouter,
  report: reportRouter,
  payments: paymentsRouter,
});

export type AppRouter = typeof appRouter;
