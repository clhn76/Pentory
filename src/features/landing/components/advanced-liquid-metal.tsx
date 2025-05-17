"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type AdvancedLiquidMetalProps = {
  scale?: number;
  colorPrimary?: string;
  colorSecondary?: string;
  colorTertiary?: string;
  colorQuaternary?: string;
  intensity?: number;
  speed?: number;
  children?: React.ReactNode;
};

export const AdvancedLiquidMetal = ({
  scale = 0.4,
  colorPrimary = "#ffffff",
  colorSecondary = "#ffafaf",
  colorTertiary = "#0099ff",
  colorQuaternary = "#aaffff",
  intensity = 1.0,
  speed = 1.0,
  children,
}: AdvancedLiquidMetalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 컨테이너 크기 계산
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Three.js 초기화
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 액체 금속 평면 생성
    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

    // 색상 변환
    const color1 = new THREE.Color(colorPrimary);
    const color2 = new THREE.Color(colorSecondary);
    const color3 = new THREE.Color(colorTertiary);
    const color4 = new THREE.Color(colorQuaternary);

    // 액체 금속 셰이더 재질
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(width, height) },
        scale: { value: scale },
        ax: { value: 5 },
        ay: { value: 7 },
        az: { value: 9 },
        aw: { value: 13 },
        bx: { value: 1 },
        by: { value: 1 },
        intensity: { value: intensity },
        speed: { value: speed },
        color1: { value: color1 },
        color2: { value: color2 },
        color3: { value: color3 },
        color4: { value: color4 },
      },
      vertexShader: `
        precision highp float;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float time;
        uniform float scale;
        uniform float intensity;
        uniform float speed;
        uniform vec2 resolution;
        uniform vec3 color1, color2, color3, color4;
        uniform float ax, ay, az, aw;
        uniform float bx, by;
        const float PI = 3.141592654;
        
        // 노이즈 패턴 생성 함수
        float cheapNoise(vec3 stp) {
          vec3 p = vec3(stp.st, stp.p);
          vec4 a = vec4(ax, ay, az, aw);
          return mix(
            sin(p.z + p.x * a.x + cos(p.x * a.x - p.z)) * 
            cos(p.z + p.y * a.y + cos(p.y * a.x + p.z)),
            sin(1. + p.x * a.z + p.z + cos(p.y * a.w - p.z)) * 
            cos(1. + p.y * a.w + p.z + cos(p.x * a.x + p.z)), 
            .436
          );
        }
        
        // 금속 반사 효과
        float metalReflection(vec2 st, float time, float intensity) {
          float angle = atan(st.y, st.x);
          float dist = length(st) * 2.0;
          float ring = sin(dist * 3.0 - time * 2.0) * 0.5 + 0.5;
          ring *= 1.0 - dist;
          return smoothstep(0.1, 0.8, ring) * intensity;
        }
        
        void main() {
          vec2 aR = vec2(resolution.x/resolution.y, 1.);
          vec2 st = vUv * aR * scale;
          float S = sin(time * .005 * speed);
          float C = cos(time * .005 * speed);
          
          // 첫 번째 변위 벡터 계산
          vec2 v1 = vec2(cheapNoise(vec3(st, 2.)), cheapNoise(vec3(st, 1.)));
          
          // 두 번째 변위 벡터 계산
          vec2 v2 = vec2(
            cheapNoise(vec3(st + bx*v1 + vec2(C * 1.7, S * 9.2), 0.15 * time * speed)),
            cheapNoise(vec3(st + by*v1 + vec2(S * 8.3, C * 2.8), 0.126 * time * speed))
          );
          
          // 최종 노이즈 값 계산
          float n = .5 + .5 * cheapNoise(vec3(st + v2, 0.));
          
          // 금속 반사 효과 계산
          float reflection = metalReflection(st - 0.5, time * speed, intensity);
          
          // 색상 혼합
          vec3 color = mix(color1, color2, clamp((n*n)*8.0, 0.0, 1.0));
          color = mix(color, color3, clamp(length(v1) * intensity, 0.0, 1.0));
          color = mix(color, color4, clamp(length(v2.x) * intensity, 0.0, 1.0));
          
          // 금속 느낌을 위한 색상 조정
          color /= n*n + n * 7.;
          
          // 반사 효과 적용
          color += reflection * color4;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // 카메라 위치 설정
    camera.position.z = 1;

    // 마우스 상호작용 변수
    let mouseX = 0;
    let mouseY = 0;

    // 마우스 이벤트
    const handleMouseMove = (event: MouseEvent) => {
      const windowHalfX = width / 2;
      const windowHalfY = height / 2;
      mouseX = (event.clientX - windowHalfX) / windowHalfX;
      mouseY = (event.clientY - windowHalfY) / windowHalfY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 애니메이션 루프
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // 시간 업데이트
      material.uniforms.time.value = elapsedTime;

      // 마우스 상호작용으로 셰이더 파라미터 조정
      material.uniforms.bx.value = THREE.MathUtils.lerp(
        material.uniforms.bx.value,
        1.0 + mouseX * 0.2,
        0.05
      );
      material.uniforms.by.value = THREE.MathUtils.lerp(
        material.uniforms.by.value,
        1.0 + mouseY * 0.2,
        0.05
      );

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    // 화면 크기 변경 시 리사이징
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.resolution.value.set(width, height);
    };

    window.addEventListener("resize", handleResize);

    // 애니메이션 시작
    animate();

    // 정리 함수
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);

      // 메모리 정리
      scene.remove(plane);
      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    scale,
    colorPrimary,
    colorSecondary,
    colorTertiary,
    colorQuaternary,
    intensity,
    speed,
  ]);

  return (
    <div className="w-full h-[100dvh] relative flex items-center justify-center overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 z-0" />
      <div className="z-10 text-center">
        {children || (
          <>
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
              고급 액체 금속 효과
            </h1>
            <p className="text-xl mb-8 text-white drop-shadow-md">
              다양한 설정으로 커스터마이징 가능한 인터랙티브 디자인
            </p>
          </>
        )}
      </div>
    </div>
  );
};
