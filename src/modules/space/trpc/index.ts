import { createTRPCRouter } from "@/trpc/init";
import { getSpaceById } from "./get-space-by-id";
// import { getSpaces } from "./get-spaces";
import { createSpace } from "./create-space";
import { getDailySummaryCounts } from "./get-daily-summary-counts";
import { getRecentUpdatedSpaces } from "./get-recent-updated-spaces";
import { getSpaceSettingsById } from "./get-space-settings-by-id";
import { getSpaces } from "./get-spaces";
import { updateSpace } from "./update-space";
import { getSummariesBySpaceId } from "./get-summaries-by-space-id";
import { validateSourceUrl } from "./validate-source-url";

export const spaceRouter = createTRPCRouter({
  getSpaces: getSpaces,
  getSpaceById: getSpaceById,
  getSpaceSettingsById: getSpaceSettingsById,
  createSpace: createSpace,
  updateSpace: updateSpace,
  getDailySummaryCounts: getDailySummaryCounts,
  getRecentUpdatedSpaces: getRecentUpdatedSpaces,
  getSummariesBySpaceId: getSummariesBySpaceId,
  validateSourceUrl: validateSourceUrl,
});
