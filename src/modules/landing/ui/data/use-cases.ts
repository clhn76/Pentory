interface UseCase {
  title: string;
  description: string;
  tags: string[];
}

export const useCases: UseCase[] = [
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
