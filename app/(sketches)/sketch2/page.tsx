'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {NextReactP5Wrapper} from '@p5-wrapper/next';
import {SketchProps, type Sketch} from '@p5-wrapper/react';

import useWindowSize from '@/utils/useWindowSize';

const bg = '#17253d';
const fg = '#d5dae3';
const fg_weak = '#d5dae360';

type MySketchProps = SketchProps & {
  scrollY: React.MutableRefObject<number>;
  w: number;
  h: number;
};

const sketch: Sketch<MySketchProps> = p5 => {
  const margin_x = 64;
  const margin_y = 64;
  const str = 'HONGO DESIGN DAY ';
  const grid_max_x = 28;
  const grid_max_y = 32;
  const brush_size = 24;

  let x_count = 0;
  let y_count = 0;
  let x_size = 0;
  let y_size = 0;
  let status = [[0]];

  const initGrid = () => {
    const available_width = p5.width - margin_x * 2;
    const available_height = p5.height - margin_y * 2;
    x_count = Math.floor(available_width / grid_max_x);
    y_count = Math.floor(available_height / grid_max_y);
    x_size = available_width / x_count;
    y_size = available_height / y_count;
    status = createZeros(x_count).map(e => createZeros(y_count));
  };

  let archivo: unknown;
  p5.preload = () => {
    archivo = p5.loadFont('/archivo.ttf');
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

  p5.doubleClicked = () => {
    status = createZeros(x_count).map(e => createZeros(y_count));
    return;
  };

  p5.draw = () => {
    p5.clear();
    p5.background(bg);
    p5.textFont(archivo);
    p5.textSize(16);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.fill(fg);

    for (let j = 0; j < y_count; j++) {
      for (let i = 0; i < x_count; i++) {
        const x =
          x_count >= 2 ? margin_x + i * x_size + x_size / 2 : p5.width / 2;
        const y =
          y_count >= 2 ? margin_y + j * y_size + y_size / 2 : p5.height / 2;

        // check if the mouse is over the text
        const d = p5.dist(p5.mouseX, p5.mouseY, x, y);
        if (d <= brush_size && p5.mouseIsPressed) {
          status[i][j] = 1;
        }

        const char_index = (i + j * x_count) % str.length;
        if (status[i][j] === 1) p5.text(str[char_index], x, y);
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
      <div className="text-white absolute bottom-0 pb-4 left-1/2 -translate-x-1/2 text-xs opacity-30 archivo">
        {/* DRAG TO DRAW / DOUBLE CLICK TO CLEAR */}
        DRAG / DOUBLE CLICK
      </div>
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
