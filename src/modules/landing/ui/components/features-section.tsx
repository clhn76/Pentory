import Image from "next/image";

const features = [
  {
    title: "손쉬운 시작",
    description:
      "유튜브 채널이나 블로그 RSS URL만 입력하면 자동으로 콘텐츠를 수집하고 요약합니다. 복잡한 설정 없이 바로 시작하세요.",
    icon: "/file.svg",
  },
  {
    title: "자동화된 일일 요약",
    description:
      "새로운 콘텐츠가 업로드될 때마다 자동으로 요약해드립니다. 매일 아침, 중요한 정보를 놓치지 않고 확인하세요.",
    icon: "/window.svg",
  },
  {
    title: "맞춤형 요약 스타일",
    description:
      "원하는 형식과 길이로 요약 스타일을 커스터마이징하세요. 전문적인 분석부터 간단한 하이라이트까지, 당신의 필요에 맞게 조정됩니다.",
    icon: "/globe.svg",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            주요 기능
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
            Pentory가 제공하는 다양한 기능으로 콘텐츠 관리의 새로운 경험을
            시작하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-background/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/20"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl bg-primary/10 mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={24}
                  height={24}
                  className="text-primary sm:w-7 sm:h-7"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
