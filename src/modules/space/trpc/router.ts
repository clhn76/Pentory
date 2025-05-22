import { createTRPCRouter } from "@/trpc/init";
import { createSpace } from "./create-space";
import { deleteSpace } from "./delete-space";
import { getAiSources } from "./get-ai-sources";
import { getDailySummaryCounts } from "./get-daily-summary-counts";
import { getPublicSpaces } from "./get-public-spaces";
import { getRecentUpdatedSpaces } from "./get-recent-updated-spaces";
import { getSpaceInfoById } from "./get-space-info-by-id";
import { getSpaceSettingsById } from "./get-space-settings-by-id";
import { getSpaceSources } from "./get-space-sources";
import { getSpaces } from "./get-spaces";
import { getSubscribedSpaces } from "./get-subscribed-spaces";
import { getSummariesById } from "./get-summaries-by-id";
import { isSubscribed } from "./is-subscribed";
import { subscribe } from "./subscribe";
import { unsubscribe } from "./unsubscribe";
import { updateSpace } from "./update-space";
import { validateSourceUrl } from "./validate-source-url";
import { getSpaceSummaryById } from "./get-space-summary-by-id";

export const spaceRouter = createTRPCRouter({
  getSpaces: getSpaces,
  getSpaceInfoById: getSpaceInfoById,
  getSpaceSummaryById: getSpaceSummaryById,
  getSpaceSettingsById: getSpaceSettingsById,
  createSpace: createSpace,
  updateSpace: updateSpace,
  getDailySummaryCounts: getDailySummaryCounts,
  getRecentUpdatedSpaces: getRecentUpdatedSpaces,
  getSummariesById: getSummariesById,
  validateSourceUrl: validateSourceUrl,
  getPublicSpaces: getPublicSpaces,
  isSubscribed: isSubscribed,
  subscribe: subscribe,
  unsubscribe: unsubscribe,
  getSpaceSources: getSpaceSources,
  getSubscribedSpaces: getSubscribedSpaces,
  deleteSpace: deleteSpace,
  getAiSources: getAiSources,
});
