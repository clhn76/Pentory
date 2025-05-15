import { CTASection } from "../components/cta-section";
import { FeaturesSection } from "../components/features-section";
import { Hero } from "../components/hero";
import { PricingSection } from "../components/pricing-section";
import { UseCasesSection } from "../components/use-cases-section";

export const HomePage = () => {
  return (
    <div>
      {/* 히어로 섹션 */}
      <Hero />

      {/* 주요 특징 섹션 */}
      <FeaturesSection />

      {/* 사용 사례 섹션 */}
      <UseCasesSection />

      {/* 요금제 */}
      <PricingSection />

      {/* CTA 섹션 */}
      <CTASection />
    </div>
  );
};
