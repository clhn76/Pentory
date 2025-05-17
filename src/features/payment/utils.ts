export const calculateUpgradeAmount = ({
  currentSubscriptionStartAt,
  currentSubscriptionEndAt,
  currentPlanPrice,
  newPlanPrice,
}: {
  currentSubscriptionStartAt: string;
  currentSubscriptionEndAt: string;
  currentPlanPrice: number;
  newPlanPrice: number;
}) => {
  const currentSubscriptionStartAtDate = new Date(currentSubscriptionStartAt);
  const currentSubscriptionEndAtDate = new Date(currentSubscriptionEndAt);

  // 구매한 플랜의 1일당 가격 계산
  const totalDaysInPlan = Math.ceil(
    (currentSubscriptionEndAtDate.getTime() -
      currentSubscriptionStartAtDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const pricePerDay = currentPlanPrice / totalDaysInPlan;

  // 할인 금액 계산
  const remainingDays = Math.ceil(
    (currentSubscriptionEndAtDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const discountAmount = Math.round(pricePerDay * remainingDays);

  // 총 업그레이드 금액 계산
  const totalUpgradeAmount = Math.max(newPlanPrice - discountAmount, 0);

  return totalUpgradeAmount;
};
