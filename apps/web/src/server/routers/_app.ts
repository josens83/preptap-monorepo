import { createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { examRouter } from "./exam";
import { practiceRouter } from "./practice";
import { notebookRouter } from "./notebook";
import { reportRouter } from "./report";
import { paymentsRouter } from "./payments";
import { contactRouter } from "./contact";
import { adminRouter } from "./admin";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  exam: examRouter,
  practice: practiceRouter,
  notebook: notebookRouter,
  report: reportRouter,
  payments: paymentsRouter,
  contact: contactRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
