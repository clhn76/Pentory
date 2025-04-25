import { createTRPCRouter } from "@/trpc/init";
import { createSpace } from "./create-space";
import { getDailySummaryCounts } from "./get-daily-summary-counts";
import { getRecentUpdatedSpaces } from "./get-recent-updated-spaces";
import { getSpaceSettingsById } from "./get-space-settings-by-id";
import { getSpaces } from "./get-spaces";
import { updateSpace } from "./update-space";
import { getSummariesBySpaceId } from "./get-summaries-by-space-id";
import { validateSourceUrl } from "./validate-source-url";
import { getPublicSpaces } from "./get-public-spaces";
import { isSubscribed } from "./is-subscribed";
import { subscribe } from "./subscribe";
import { unsubscribe } from "./unsubscribe";
import { getSpaceSources } from "./get-space-sources";
import { getSubscribedSpaces } from "./get-subscribed-spaces";

export const spaceRouter = createTRPCRouter({
  getSpaces: getSpaces,
  getSpaceSettingsById: getSpaceSettingsById,
  createSpace: createSpace,
  updateSpace: updateSpace,
  getDailySummaryCounts: getDailySummaryCounts,
  getRecentUpdatedSpaces: getRecentUpdatedSpaces,
  getSummariesBySpaceId: getSummariesBySpaceId,
  validateSourceUrl: validateSourceUrl,
  getPublicSpaces: getPublicSpaces,
  isSubscribed: isSubscribed,
  subscribe: subscribe,
  unsubscribe: unsubscribe,
  getSpaceSources: getSpaceSources,
  getSubscribedSpaces: getSubscribedSpaces,
});
