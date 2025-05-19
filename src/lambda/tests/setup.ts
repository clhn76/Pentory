/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "dotenv";
import { resolve } from "path";
import { WebSocket } from "ws";

// Node.js 환경에서 WebSocket polyfill 등록
global.WebSocket = WebSocket as any;

// .env 파일 로드
config({
  path: resolve(process.cwd(), ".env"),
});
