"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Hero = () => {
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 성능 최적화
    container.appendChild(renderer.domElement);

    // 웨이브 그리드 생성
    const gridSize = 30;
    const geometry = new THREE.PlaneGeometry(20, 20, gridSize, gridSize);

    // 셰이더 재질
    const material = new THREE.ShaderMaterial({
      wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x4385ff) },
        uSecondaryColor: { value: new THREE.Color(0x4bf2ab) },
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vPosition;
        varying float vZ;
        
        void main() {
          vPosition = position;
          
          // 웨이브 애니메이션
          float wave1 = sin(position.x * 0.5 + uTime) * 0.5;
          float wave2 = sin(position.y * 0.5 + uTime * 0.8) * 0.5;
          float combinedWave = wave1 + wave2;
          
          // 마우스 인터랙션 시뮬레이션
          float distanceFromCenter = length(position.xy) * 0.5;
          float pulse = sin(distanceFromCenter - uTime * 2.0) * 0.1;
          
          // 최종 z 포지션 계산
          float z = combinedWave + pulse;
          vZ = z;
          
          vec3 newPosition = vec3(position.x, position.y, z);
          vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectedPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uSecondaryColor;
        varying vec3 vPosition;
        varying float vZ;
        
        void main() {
          // 깊이에 따른 색상 그라데이션
          float mixRatio = (vZ + 1.0) * 0.5;
          vec3 color = mix(uColor, uSecondaryColor, mixRatio);
          
          gl_FragColor = vec4(color, 0.8);
        }
      `,
      transparent: true,
    });

    const wave = new THREE.Mesh(geometry, material);
    wave.rotation.x = -Math.PI / 2; // 수평으로 배치
    wave.position.y = -2;
    scene.add(wave);

    // 빛나는 입자 추가
    const particleCount = 150;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // 웨이브 위에 입자 배치
      particlePositions[i3] = (Math.random() - 0.5) * 15;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 15;
      particlePositions[i3 + 2] = Math.random() * 2;

      // 크기 변화
      particleSizes[i] = Math.random() * 0.1 + 0.05;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(particleSizes, 1)
    );

    // 파티클 셰이더 재질
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColor: { value: new THREE.Color(0xffffff) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float size;
        varying float vSize;
        
        void main() {
          vSize = size;
          // 입자 움직임
          vec3 newPosition = position;
          newPosition.z += sin(position.x * 5.0 + uTime) * 0.2;
          newPosition.z += sin(position.y * 5.0 + uTime * 0.5) * 0.2;
          
          vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
          gl_PointSize = size * 500.0 * uPixelRatio / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vSize;
        
        void main() {
          // 원형 파티클 형태
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;
          strength = clamp(strength, 0.0, 1.0);
          
          vec3 finalColor = mix(vec3(0.0), uColor, strength);
          gl_FragColor = vec4(finalColor, strength);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.position.y = -2;
    scene.add(particles);

    // 카메라 위치 설정
    camera.position.set(0, 2, 6);
    camera.lookAt(0, 0, 0);

    // 애니메이션 변수
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let windowHalfX = width / 2;
    let windowHalfY = height / 2;

    // 마우스 이벤트
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) / 100;
      mouseY = (event.clientY - windowHalfY) / 100;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 애니메이션 루프
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // 시간 업데이트
      material.uniforms.uTime.value = elapsedTime;
      particleMaterial.uniforms.uTime.value = elapsedTime;

      // 부드러운 카메라 움직임
      targetX = mouseX * 0.3;
      targetY = mouseY * 0.3;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // 웨이브 회전
      wave.rotation.z = elapsedTime * 0.05;

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
      particleMaterial.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        2
      );

      // 마우스 이벤트 변수 업데이트
      windowHalfX = width / 2;
      windowHalfY = height / 2;
    };

    window.addEventListener("resize", handleResize);

    // 애니메이션 시작
    animate();

    // 정리 함수
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);

      // 메모리 정리
      scene.remove(wave);
      scene.remove(particles);
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full h-[100dvh] relative flex items-center justify-center overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 z-0" />
      <div className="z-10 text-center">
        <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
          펜토리에 오신 것을 환영합니다
        </h1>
        <p className="text-xl mb-8 text-white drop-shadow-md">
          혁신적인 서비스로 여러분의 미래를 함께 만들어갑니다
        </p>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg">
          시작하기
        </button>
      </div>
    </div>
  );
};
