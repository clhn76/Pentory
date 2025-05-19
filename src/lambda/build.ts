import * as esbuild from "esbuild";
import { mkdir, rm } from "fs/promises";

async function build() {
  try {
    // 기존 dist 디렉토리 삭제
    await rm("./src/lambda/dist", { recursive: true, force: true });

    // dist 디렉토리 생성
    await mkdir("./src/lambda/dist", { recursive: true });

    // Lambda 함수 빌드
    await esbuild.build({
      entryPoints: ["src/lambda/index.ts"],
      bundle: true,
      outfile: "./src/lambda/dist/index.js",
      platform: "node",
      target: "node22",
      format: "cjs",
      sourcemap: true,
    });

    console.log("✅ Lambda 빌드가 완료되었습니다.");
  } catch (error) {
    console.error("❌ 빌드 중 오류가 발생했습니다:", error);
    process.exit(1);
  }
}

build();
