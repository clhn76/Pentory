import { Header } from "./_components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* 히어로 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
                콘텐츠 홍수 속에서, <br />
                <span className="text-primary">핵심만 파악하세요</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                유튜브 채널과 블로그 RSS를 등록하면 인공지능이 자동으로 핵심
                내용을 요약해드립니다. 수많은 콘텐츠를 빠르게 이해하세요.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-full">
                    무료로 시작하기
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="rounded-full">
                    요금제 보기
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.jpg"
                alt="Pentory Dashboard"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 동작 방식 섹션 */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              어떻게 작동하나요?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              복잡한 콘텐츠를 쉽게 이해할 수 있도록 도와드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div
                key={step.title}
                className="bg-background p-6 rounded-xl shadow-sm relative"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Image
                    src={step.icon}
                    alt={step.title}
                    width={24}
                    height={24}
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">주요 기능</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pentory가 제공하는 다양한 기능을 알아보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background p-6 rounded-xl shadow-sm"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={24}
                    height={24}
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 사례 섹션 */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              누가 사용하나요?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              다양한 분야에서 Pentory를 활용하는 방법을 알아보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="bg-background p-8 rounded-xl shadow-sm"
              >
                <h3 className="text-2xl font-medium mb-4">{useCase.title}</h3>
                <p className="text-muted-foreground mb-6">
                  {useCase.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {useCase.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-screen-lg mx-auto bg-primary/5 p-10 rounded-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            정보 과부하에서 벗어나세요
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            하루에 5분만 투자하여 최신 트렌드와 정보를 놓치지 마세요.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="rounded-full px-8">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-10 px-4 border-t">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">Pentory</span>
              <span className="text-muted-foreground text-sm">
                © {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground"
              >
                개인정보 처리방침
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground"
              >
                이용약관
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground"
              >
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const howItWorks = [
  {
    title: "콘텐츠 소스 등록",
    description:
      "유튜브 채널, 블로그 RSS 피드 등 관심 있는 콘텐츠 소스를 등록하세요.",
    icon: "/file.svg",
  },
  {
    title: "AI 자동 요약",
    description:
      "인공지능이 새로운 콘텐츠를 자동으로 분석하고 핵심 내용을 추출합니다.",
    icon: "/window.svg",
  },
  {
    title: "한눈에 확인",
    description:
      "대시보드에서 모든 콘텐츠의 요약본을 효율적으로 확인할 수 있습니다.",
    icon: "/globe.svg",
  },
];

const features = [
  {
    title: "다양한 소스 지원",
    description:
      "유튜브 채널, 블로그 RSS, 뉴스레터 등 다양한 콘텐츠 소스를 지원합니다.",
    icon: "/file.svg",
  },
  {
    title: "맞춤형 요약",
    description:
      "관심사와 중요도에 따라 요약 내용의 길이와 깊이를 조절할 수 있습니다.",
    icon: "/window.svg",
  },
  {
    title: "실시간 알림",
    description:
      "새로운 콘텐츠가 요약되면 알림을 받아 중요한 정보를 놓치지 않습니다.",
    icon: "/globe.svg",
  },
];

const useCases = [
  {
    title: "마케터를 위한 트렌드 파악",
    description:
      "업계 리더들의 유튜브와 블로그를 등록하여 최신 마케팅 트렌드와 전략을 빠르게 습득하세요.",
    tags: ["디지털 마케팅", "콘텐츠 마케팅", "SNS 트렌드"],
  },
  {
    title: "개발자를 위한 기술 동향",
    description:
      "기술 블로그와 개발 유튜브 채널을 등록하여 최신 개발 동향과 새로운 기술을 효율적으로 학습하세요.",
    tags: ["프로그래밍", "웹 개발", "신기술"],
  },
  {
    title: "연구자를 위한 논문 요약",
    description:
      "학술 RSS 피드를 등록하여 관련 분야의 최신 연구 논문을 AI가 요약해주는 서비스로 연구 효율성을 높이세요.",
    tags: ["학술 연구", "논문 요약", "학습 효율화"],
  },
  {
    title: "투자자를 위한 정보 수집",
    description:
      "경제 뉴스와 금융 유튜브 채널을 등록하여 투자 결정에 필요한 핵심 정보를 빠르게 파악하세요.",
    tags: ["주식 투자", "경제 동향", "재테크"],
  },
];

export default HomePage;
