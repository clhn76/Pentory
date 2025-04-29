import { FeaturesSection } from "../components/features-section";
import { Hero } from "../components/hero";
import { UseCasesSection } from "../components/use-cases-section";
import { CTASection } from "../components/cta-section";

export const HomePage = () => {
  return (
    <div>
      {/* 히어로 섹션 */}
      <Hero />

      {/* 주요 특징 섹션 */}
      <FeaturesSection />

      {/* 사용 사례 섹션 */}
      <UseCasesSection />

      {/* CTA 섹션 */}
      <CTASection />
    </div>
  );
};
