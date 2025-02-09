'use client';

import React, {useEffect, useRef} from 'react';
import {NextReactP5Wrapper} from '@p5-wrapper/next';
import {SketchProps, type Sketch} from '@p5-wrapper/react';

import useWindowSize from '@/utils/useWindowSize';

import starsRightData from './stars_right.csv';
import starsLeftData from './stars_left.csv';
import sunstarsData from './sunstars.csv';
import sunstartipsData from './sunstartips.csv';

// 型定義を拡張
type Point = {
  x: number;
  y: number;
};

type MySketchProps = SketchProps & {
  scrollY: React.MutableRefObject<number>;
  w: number;
  h: number;
  starsRight: Point[];
  starsLeft: Point[];
  sunstars: Point[];
  sunstartips: Point[];
};

// CSVデータを解析
const parseCSV = (csvData: string): Point[] => {
  const lines = csvData.split('\n');
  return lines
    .slice(1) // ヘッダーをスキップ
    .filter(line => line.trim() !== '')
    .map(line => {
      const [x, y] = line.split(',').map(Number);
      return {x, y};
    });
};

const sketch: Sketch<MySketchProps> = p5 => {
  const bg = '#FFF2DF';
  let starsRight: Point[] = [];
  let starsLeft: Point[] = [];
  let sunstars: Point[] = [];
  let sunstartips: Point[] = [];

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.frameRate(60);
  };

  p5.updateWithProps = (props: MySketchProps) => {
    if (props.w !== p5.width || props.h !== p5.height) {
      p5.resizeCanvas(props.w, props.h);
    }
    starsRight = props.starsRight;
    starsLeft = props.starsLeft;
    sunstars = props.sunstars;
    sunstartips = props.sunstartips;
  };

  p5.draw = () => {
    p5.background(bg);
    p5.noStroke();

    const scale = p5.max(p5.width, p5.height) * 0.7;
    p5.translate(p5.width / 2, p5.height / 2);

    // 白い点を描画
    p5.fill(255);
    starsRight.forEach(point => {
      p5.circle(point.x * scale, point.y * scale, 4);
    });

    // 赤い点を描画
    p5.fill(255, 0, 0);
    starsLeft.forEach(point => {
      p5.circle(point.x * scale, point.y * scale, 4);
    });

    // 黄色い点を描画
    p5.fill(255, 255, 0);
    sunstars.forEach(point => {
      p5.circle(point.x * scale, point.y * scale, 4);
    });

    // 青い点を描画
    p5.fill(0, 255, 255);
    sunstartips.forEach(point => {
      p5.circle(point.x * scale, point.y * scale, 4);
    });
  };
};

export default function Sketch() {
  const [width, height] = useWindowSize();
  const scrollSpeed = useRef(0);
  const lastScrollTop = useRef(0);
  const deltaTime = 30;
  const starsRight = parseCSV(starsRightData);
  const starsLeft = parseCSV(starsLeftData);
  const sunstars = parseCSV(sunstarsData);
  const sunstartips = parseCSV(sunstartipsData);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentScrollTop = window.scrollY;
      const deltaY = currentScrollTop - lastScrollTop.current;
      if (deltaY !== 0) {
        scrollSpeed.current = deltaY / deltaTime;
      } else {
        scrollSpeed.current = 0;
      }
      lastScrollTop.current = currentScrollTop;
    }, deltaTime);

    return () => clearInterval(interval);
  });

  return (
    <>
      {width !== 0 && height !== 0 && (
        <NextReactP5Wrapper
          sketch={sketch}
          scrollY={scrollSpeed}
          w={width}
          h={height}
          starsRight={starsRight}
          starsLeft={starsLeft}
          sunstars={sunstars}
          sunstartips={sunstartips}
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
