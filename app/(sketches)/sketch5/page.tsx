'use client';

import React, {useEffect, useRef} from 'react';
import {NextReactP5Wrapper} from '@p5-wrapper/next';
import {SketchProps, type Sketch} from '@p5-wrapper/react';

import useWindowSize from '@/utils/useWindowSize';

const bg = '#FFF2DF';
const fg = '#333333';

type MySketchProps = SketchProps & {
  scrollY: React.MutableRefObject<number>;
  w: number;
  h: number;
};
const sketch: Sketch<MySketchProps> = p5 => {
  const margin_x = 32;
  const margin_y = 32;
  const grid_max_x = 42;
  const grid_max_y = 42;
  const brush_size = 24;

  const waveFrequency = 0.01;
  const waveAmplitude = 10;
  const spatialScale = 0.8;
  const sizeLerpFactor = 0.1;
  const posLerpFactor = 0.1;

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
    const available_height = p5.height - margin_y * 2;
    x_count = Math.floor(available_width / grid_max_x);
    y_count = Math.floor(available_height / grid_max_y);
    x_size = available_width / x_count;
    y_size = available_height / y_count;
    status = Array.from({length: x_count}, () => Array(y_count).fill([0, 0]));
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
        circle_size_1 = p5.lerp(circle_size_1, 24, sizeLerpFactor);
        circle_size_2 = p5.lerp(circle_size_2, 6, sizeLerpFactor);
        circle_size_3 = p5.lerp(circle_size_3, 4, sizeLerpFactor);
        break;
      case 2:
        circle_size_1 = p5.lerp(circle_size_1, 6, sizeLerpFactor);
        circle_size_2 = p5.lerp(circle_size_2, 24, sizeLerpFactor);
        circle_size_3 = p5.lerp(circle_size_3, 4, sizeLerpFactor);
        break;
      default:
        circle_size_1 = p5.lerp(circle_size_1, 6, sizeLerpFactor);
        circle_size_2 = p5.lerp(circle_size_2, 6, sizeLerpFactor);
        circle_size_3 = p5.lerp(circle_size_3, 8, sizeLerpFactor);
        break;
    }

    const attractors: {x: number; y: number}[] = [];

    for (let j = 0; j < y_count; j++) {
      for (let i = 0; i < x_count; i++) {
        const x =
          x_count >= 2 ? margin_x + i * x_size + x_size / 2 : p5.width / 2;
        const y =
          y_count >= 2 ? margin_y + j * y_size + y_size / 2 : p5.height / 2;

        const index = i + j * x_count;

        if (index % 24 === 0) {
          if (colorIndex === 1) attractors.push({x, y});
        } else if (index % 8 === 0) {
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
          y_count >= 2 ? margin_y + j * y_size + y_size / 2 : p5.height / 2;

        const index = i + j * x_count;
        let size = circle_size_3;
        let color = 'rgba(78, 73, 67, 0.2)';

        if (index % 24 === 0) {
          size = circle_size_1;
          color = '#F5BE08';
        } else if (index % 8 === 0) {
          size = circle_size_2;
          color = '#EA5C15';
        }

        let dx = 0;
        let dy = 0;

        // Calculate repulsion from attractors
        for (const attractor of attractors) {
          const dist = p5.dist(x, y, attractor.x, attractor.y);
          if (dist < 300 && dist > 0) {
            const force = 3000 / dist ** 1.3;

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
        p5.circle(cur_xy[0], cur_xy[1] + waveFactor, size);
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
