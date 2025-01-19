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

  const waveFrequency = 0.05; // 周波数: 値が小さいほど周期が長い
  const waveAmplitude = 2; // 振幅: サイン波による上下の揺れ幅
  const sizeLerpFactor = 0.6;

  let x_count = 0;
  let y_count = 0;
  let x_size = 0;
  let y_size = 0;
  let status = [[0]];
  let circle_size_1 = 6;
  let circle_size_2 = 6;

  const initGrid = () => {
    const available_width = p5.width - margin_x * 2;
    const available_height = p5.height - margin_y * 2;
    x_count = Math.floor(available_width / grid_max_x);
    y_count = Math.floor(available_height / grid_max_y);
    x_size = available_width / x_count;
    y_size = available_height / y_count;
    status = createZeros(x_count).map(e => createZeros(y_count));
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
    p5.textSize(16);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.noStroke();

    const elapsedSeconds = Math.floor(p5.millis() / 3000);
    const colorIndex = elapsedSeconds % 3; // 0, 1, 2 の繰り返し

    switch (colorIndex) {
      case 1:
        circle_size_1 = p5.lerp(circle_size_1, 16, sizeLerpFactor);
        circle_size_2 = p5.lerp(circle_size_2, 6, sizeLerpFactor);
        break;
      case 2:
        circle_size_1 = p5.lerp(circle_size_1, 6, sizeLerpFactor);
        circle_size_2 = p5.lerp(circle_size_2, 16, sizeLerpFactor);
        break;
      default:
        circle_size_1 = p5.lerp(circle_size_1, 6, sizeLerpFactor);
        circle_size_2 = p5.lerp(circle_size_2, 6, sizeLerpFactor);
        break;
    }

    for (let j = 0; j < y_count; j++) {
      for (let i = 0; i < x_count; i++) {
        const x =
          x_count >= 2 ? margin_x + i * x_size + x_size / 2 : p5.width / 2;

        const waveFactor =
          waveAmplitude * p5.sin(waveFrequency * p5.frameCount + i + j);
        const y =
          (y_count >= 2 ? margin_y + j * y_size + y_size / 2 : p5.height / 2) +
          waveFactor;

        // check if the mouse is over the text
        const d = p5.dist(p5.mouseX, p5.mouseY, x, y);
        if (d <= brush_size && p5.mouseIsPressed) {
          status[i][j] = 1;
        }

        const index = i + j * x_count;
        if (index % 24 === 0) {
          p5.fill('#F5BE08');
          p5.circle(x, y, circle_size_1);
        } else if (index % 8 === 0) {
          p5.fill('#EA5C15');
          p5.circle(x, y, circle_size_2);
        } else {
          p5.fill('rgba(78, 73, 67, 0.2)');
          p5.circle(x, y, 4);
        }
      }
    }
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
