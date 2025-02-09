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
  const color_bg = '#FFF2DF';

  const color_black = '#2A2A2A';
  const color_red = '#FA5D1F';
  const color_yellow = '#F8C347';

  let radius_plot: number;

  const radiusLerpFactor = 0.2;
  let radius_black = 0;
  let radius_red = 0;
  let radius_yellow = 0;
  let target_radius_black: number;
  let target_radius_red: number;
  let target_radius_yellow: number;

  const preferredScale = 1500;
  let scale: number;

  let starsRight: Point[] = [];
  let starsLeft: Point[] = [];
  let sunstars: Point[] = [];
  let sunstartips: Point[] = [];

  // 点の配列をメンバー変数として保持
  let blackPoints: Point[] = [];
  let redPoints: Point[] = [];
  let yellowPoints: Point[] = [];

  // global random rotation/offset
  let rotation: number;
  let offsetX: number;
  let offsetY: number;
  let waveAngle: number;

  const waveFrequency = 0.05;
  const waveAmplitude = 3;
  const spatialScale = 0.008;

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.frameRate(60);

    rotation = p5.random(-30, 30) * (Math.PI / 180);
    offsetX = p5.random(-50, 50);
    offsetY = p5.random(-50, 50);
    waveAngle = p5.random(0, 2 * Math.PI);
  };

  const calculatePoints = () => {
    scale = preferredScale;
    radius_plot = scale / 50;

    // 点の配列を更新
    blackPoints = [];
    redPoints = [];
    yellowPoints = [];

    // starsRightの点を計算
    starsRight.forEach(point => {
      blackPoints.push({x: point.x * scale, y: point.y * scale});

      for (let i = 0; i < 5; i++) {
        const angle = i * ((2 * Math.PI) / 5);
        redPoints.push({
          x: point.x * scale + radius_plot * Math.cos(angle),
          y: point.y * scale + radius_plot * Math.sin(angle),
        });
      }
      for (let i = 0; i < 5; i++) {
        const angle = i * ((2 * Math.PI) / 5) + Math.PI;
        yellowPoints.push({
          x: point.x * scale + radius_plot * Math.cos(angle),
          y: point.y * scale + radius_plot * Math.sin(angle),
        });
      }
    });

    // starsLeftの点を計算
    starsLeft.forEach(point => {
      blackPoints.push({x: point.x * scale, y: point.y * scale});

      for (let i = 0; i < 5; i++) {
        const angle = i * ((2 * Math.PI) / 5) + Math.PI;
        redPoints.push({
          x: point.x * scale + radius_plot * Math.cos(angle),
          y: point.y * scale + radius_plot * Math.sin(angle),
        });
      }
      for (let i = 0; i < 5; i++) {
        const angle = i * ((2 * Math.PI) / 5);
        yellowPoints.push({
          x: point.x * scale + radius_plot * Math.cos(angle),
          y: point.y * scale + radius_plot * Math.sin(angle),
        });
      }
    });

    // sunstarsとsunstartipsの点を追加
    sunstars.forEach(point => {
      blackPoints.push({x: point.x * scale, y: point.y * scale});
    });

    sunstartips.forEach(point => {
      yellowPoints.push({x: point.x * scale, y: point.y * scale});
    });
  };

  p5.updateWithProps = (props: MySketchProps) => {
    if (props.w !== p5.width || props.h !== p5.height) {
      p5.resizeCanvas(props.w, props.h);
    }
    starsRight = props.starsRight;
    starsLeft = props.starsLeft;
    sunstars = props.sunstars;
    sunstartips = props.sunstartips;
    calculatePoints();
  };

  const calculateWaveFactor = (x: number, y: number, offset: number) =>
    waveAmplitude *
    p5.sin(
      waveFrequency * p5.frameCount -
        (x * Math.cos(waveAngle) + y * Math.sin(waveAngle)) * spatialScale +
        offset
    );

  p5.draw = () => {
    p5.translate(p5.width / 2 + offsetX, p5.height / 2 + offsetY);
    p5.rotate(rotation);
    p5.background(color_bg);
    p5.noStroke();

    const elapsedSeconds = Math.floor(p5.millis() / 3000);
    const colorIndex = elapsedSeconds % 3;
    // const colorIndex = 1;

    switch (colorIndex) {
      case 1:
        target_radius_black = scale / 60;
        target_radius_yellow = scale / 320;
        target_radius_red = scale / 480;
        break;
      case 2:
        target_radius_black = scale / 320;
        target_radius_yellow = scale / 90;
        target_radius_red = scale / 480;
        break;
      default:
        target_radius_black = scale / 480;
        target_radius_yellow = scale / 320;
        target_radius_red = scale / 90;
        break;
    }

    radius_black = p5.lerp(radius_black, target_radius_black, radiusLerpFactor);
    radius_yellow = p5.lerp(
      radius_yellow,
      target_radius_yellow,
      radiusLerpFactor
    );
    radius_red = p5.lerp(radius_red, target_radius_red, radiusLerpFactor);

    // まとめて描画
    p5.fill(color_black);
    blackPoints.forEach(point => {
      p5.circle(
        point.x,
        point.y + calculateWaveFactor(point.x, point.y, 0),
        radius_black
      );
    });

    p5.fill(color_red);
    redPoints.forEach(point => {
      p5.circle(
        point.x,
        point.y + calculateWaveFactor(point.x, point.y, 0.2),
        radius_red
      );
    });

    p5.fill(color_yellow);
    yellowPoints.forEach(point => {
      p5.circle(
        point.x,
        point.y + calculateWaveFactor(point.x, point.y, 0.4),
        radius_yellow
      );
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
