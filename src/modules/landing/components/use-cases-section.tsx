import { USE_CASES } from "../config";

export const UseCasesSection = () => {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-tr from-muted/50 to-muted/30">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6">
            누가 사용하나요?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-4">
            다양한 분야에서 Pentory를 활용하는 방법을 알아보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
          {USE_CASES.map((useCase) => (
            <div
              key={useCase.title}
              className="bg-background p-4 sm:p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-medium mb-2 sm:mb-4">
                {useCase.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-6">
                {useCase.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {useCase.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 sm:px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm"
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
  );
};
