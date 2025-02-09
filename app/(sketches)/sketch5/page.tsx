'use client';

import React, {useEffect, useRef} from 'react';
import {NextReactP5Wrapper} from '@p5-wrapper/next';
import {SketchProps, type Sketch} from '@p5-wrapper/react';

import useWindowSize from '@/utils/useWindowSize';

type MySketchProps = SketchProps & {
  scrollY: React.MutableRefObject<number>;
  w: number;
  h: number;
};
const sketch: Sketch<MySketchProps> = p5 => {
  const margin_x = -64;
  const margin_t = 160;
  const margin_b = 100;
  const grid_max_x = 24;
  const grid_max_y = 24;
  const brush_size = 28;

  const waveFrequency = 0.03;
  const waveAmplitude = 15;
  const spatialScale = 0.3;
  const sizeLerpFactor = 0.05;
  const posLerpFactor = 0.05;
  const circle_intermittence_1 = 29;
  const circle_intermittence_2 = 11;

  const bg = '#FFF2DF';
  const circle_color_1 = '#FFD752';
  const circle_color_2 = '#FF8B5D';
  const circle_color_3 = 'rgba(78, 73, 67, 0.2)';

  // const bg = '#1D2B3A';
  // const circle_color_1 = '#08F56B';
  // const circle_color_2 = '#24D3F7';
  // const circle_color_3 = '#031629';

  let x_count = 0;
  let y_count = 0;
  let x_size = 0;
  let y_size = 0;
  let status: [number, number][][] = [[[0, 0]]];
  let initial_draw = false;
  let circle_size_1 = 6;
  let circle_size_2 = 6;
  let circle_size_3 = 4;

  const initGrid = () => {
    const available_width = p5.width - margin_x * 2;
    const available_height = p5.height - (margin_b + margin_t);
    x_count = Math.floor(available_width / grid_max_x);
    y_count = Math.floor(available_height / grid_max_y);
    x_size = available_width / x_count;
    y_size = available_height / y_count;
    status = Array.from({length: x_count}, () =>
      Array.from({length: y_count}, () => [0, 0])
    );
    initial_draw = true;
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.frameRate(60);
    initGrid();
  };

  p5.updateWithProps = (props: MySketchProps) => {
    if (props.w !== p5.width || props.h !== p5.height) {
      p5.resizeCanvas(props.w, props.h);
      initGrid();
    }
  };

  p5.draw = () => {
    p5.clear();
    p5.background(bg);
    p5.noStroke();

    const elapsedSeconds = Math.floor(p5.millis() / 3000);
    const colorIndex = elapsedSeconds % 3;

    switch (colorIndex) {
      case 1:
        circle_size_1 = p5.lerp(circle_size_1, 16, sizeLerpFactor);
        circle_size_2 = p5.lerp(circle_size_2, 4, sizeLerpFactor);
        circle_size_3 = p5.lerp(circle_size_3, 4, sizeLerpFactor);
        break;
      case 2:
        circle_size_1 = p5.lerp(circle_size_1, 4, sizeLerpFactor);
        circle_size_2 = p5.lerp(circle_size_2, 16, sizeLerpFactor);
        circle_size_3 = p5.lerp(circle_size_3, 4, sizeLerpFactor);
        break;
      default:
        circle_size_1 = p5.lerp(circle_size_1, 6, sizeLerpFactor);
        circle_size_2 = p5.lerp(circle_size_2, 6, sizeLerpFactor);
        circle_size_3 = p5.lerp(circle_size_3, 4, sizeLerpFactor);
        break;
    }

    const attractors: {x: number; y: number}[] = [];

    for (let j = 0; j < y_count; j++) {
      for (let i = 0; i < x_count; i++) {
        const x =
          x_count >= 2 ? margin_x + i * x_size + x_size / 2 : p5.width / 2;
        const y =
          y_count >= 2 ? margin_t + j * y_size + y_size / 2 : p5.height / 2;

        const index = i + j * x_count;

        if (index % circle_intermittence_1 === 0) {
          if (colorIndex === 1) attractors.push({x, y});
        } else if (index % circle_intermittence_2 === 0) {
          if (colorIndex === 2) attractors.push({x, y});
        }
      }
    }

    for (let j = 0; j < y_count; j++) {
      for (let i = 0; i < x_count; i++) {
        const x =
          x_count >= 2 ? margin_x + i * x_size + x_size / 2 : p5.width / 2;
        const waveFactor =
          waveAmplitude *
          p5.sin(waveFrequency * p5.frameCount - ((i + j) / 2) * spatialScale);
        const y =
          y_count >= 2 ? margin_t + j * y_size + y_size / 2 : p5.height / 2;

        const index = i + j * x_count;
        let size = circle_size_3;
        let color = circle_color_3;

        if (index % circle_intermittence_1 === 0) {
          size = circle_size_1;
          color = circle_color_1;
        } else if (index % circle_intermittence_2 === 0) {
          size = circle_size_2;
          color = circle_color_2;
        }

        let dx = 0;
        let dy = 0;

        // Calculate repulsion from attractors
        for (const attractor of attractors) {
          const dist = p5.dist(x, y, attractor.x, attractor.y);
          if (dist < 300 && dist > 0) {
            const force = 800 / dist ** 1.3;

            const unitX = (x - attractor.x) / dist;
            const unitY = (y - attractor.y) / dist;

            dx += force * unitX;
            dy += force * unitY;
          }
        }

        if (initial_draw) {
          // initial draw after grid reset
          status[i][j] = [x, y];
        }
        const prev_xy = status[i][j];
        const cur_xy: [number, number] = [
          p5.lerp(prev_xy[0], x + dx, posLerpFactor),
          p5.lerp(prev_xy[1], y + dy, posLerpFactor),
        ];

        p5.fill(color);
        // p5.circle(cur_xy[0], cur_xy[1] + waveFactor, size);
        p5.circle(cur_xy[0], cur_xy[1], size);
        status[i][j] = cur_xy;
      }
    }
    if (initial_draw) initial_draw = false;
  };
};

export default function Sketch() {
  const [width, height] = useWindowSize();
  const scrollSpeed = useRef(0);
  const lastScrollTop = useRef(0);
  const deltaTime = 30;

  useEffect(() => {
    const interval = setInterval(() => {
      const currentScrollTop = window.scrollY;

      const deltaY = currentScrollTop - lastScrollTop.current;

      // スクロールが発生している場合に速度を計算
      if (deltaY !== 0) {
        scrollSpeed.current = deltaY / deltaTime;
      } else {
        scrollSpeed.current = 0;
      }

      lastScrollTop.current = currentScrollTop;
    }, deltaTime);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <>
      {width !== 0 && height !== 0 && (
        <NextReactP5Wrapper
          sketch={sketch}
          scrollY={scrollSpeed}
          w={width}
          h={height}
        />
      )}
    </>
  );
}

const repulsive = (x: number, offset: number) => {
  // x: -1 ~ 1, y: -1 ~ 1
  const base = 2;
  const coeff = 5;

  const new_x = x - offset + 0.03;
  return new_x === 0
    ? 0
    : new_x < 0
      ? -(base ** (coeff * new_x))
      : base ** (-coeff * new_x) * 0.8;
};

const createSequence = (length: number) => {
  return Array.from(
    {length: length},
    (item, index) => 0 + index * (1 / length)
  );
};
const createZeros = (length: number) => {
  return Array.from({length: length}, (item, index) => 0);
};
