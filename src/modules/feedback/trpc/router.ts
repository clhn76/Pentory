import { createTRPCRouter } from "@/trpc/init";
import { submitFeedback } from "./submit-feedback";

export const feedbackRouter = createTRPCRouter({
  submitFeedback,
});
