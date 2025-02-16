'use client';

import React, {useEffect, useRef} from 'react';
import {NextReactP5Wrapper} from '@p5-wrapper/next';
import {SketchProps, type Sketch} from '@p5-wrapper/react';
import {useMeasure} from 'react-use';

import {points as pathPoints} from './path_points';
import starsRightData from './stars_right.csv';
import starsLeftData from './stars_left.csv';
import sunstarsData from './sunstars.csv';
import sunstartipsData from './sunstartips.csv';

// 型定義を拡張
type Point = {
  x: number;
  y: number;
};

type RadiusPoint = Point & {
  radius: number;
};

type RadiusFunc = (
  x: number,
  y: number,
  color: 'black' | 'red' | 'yellow'
) => number;

type MySketchProps = SketchProps & {
  scrollY: React.MutableRefObject<number>;
  w: number;
  h: number;
  starsRight: Point[];
  starsLeft: Point[];
  sunstars: Point[];
  sunstartips: Point[];
};

// 点と線分の最短距離を計算するヘルパー関数
const distanceToSegment = (
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number => {
  const dx = bx - ax;
  const dy = by - ay;
  // セグメントが1点の場合
  if (dx === 0 && dy === 0) {
    return Math.hypot(px - ax, py - ay);
  }
  // 射影のパラメータtを求める
  const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
  if (t < 0) {
    return Math.hypot(px - ax, py - ay);
  } else if (t > 1) {
    return Math.hypot(px - bx, py - by);
  }
  const projX = ax + t * dx;
  const projY = ay + t * dy;
  return Math.hypot(px - projX, py - projY);
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
  let parentWidth = 400;
  let parentHeight = 400;

  const color_bg = '#FFF2DF';
  const color_black = '#2A2A2A';
  const color_red = '#FA5D1F';
  const color_yellow = '#F8C347';

  const switchInterval = 2500;
  const radiusLerpFactor = 0.2;

  const preferredScale = 1200;
  let scale = 0;

  let starsRight: Point[] = [];
  let starsLeft: Point[] = [];
  let sunstars: Point[] = [];
  let sunstartips: Point[] = [];

  // 点の配列をメンバー変数として保持
  let blackPoints: RadiusPoint[] = [];
  let redPoints: RadiusPoint[] = [];
  let yellowPoints: RadiusPoint[] = [];

  // global random rotation/offset
  let rotation: number;
  let offsetX: number;
  let offsetY: number;

  const waveFrequency = 0.02;
  const waveAmplitude = 5;
  const spatialScale = 0.002;

  let rippleCenterX: number;
  let rippleCenterY: number;

  let currentRadiusIndex = 0;
  let lastSwitchTimestamp = 0;

  p5.setup = () => {
    p5.createCanvas(parentWidth, parentHeight);
    p5.frameRate(60);

    rotation = p5.random(-30, 30) * (Math.PI / 180);
    offsetX = p5.random(-50, 50);
    offsetY = p5.random(-50, 50);

    // Set rippleCenter to be always outside the canvas
    const edge = p5.floor(p5.random(4));
    if (edge === 0) {
      // left of canvas
      rippleCenterX = -p5.random(0.5 * parentWidth, parentWidth);
      rippleCenterY = p5.random(0, parentHeight);
    } else if (edge === 1) {
      // right of canvas
      rippleCenterX = parentWidth + p5.random(0.5 * parentWidth, parentWidth);
      rippleCenterY = p5.random(0, parentHeight);
    } else if (edge === 2) {
      // above canvas
      rippleCenterY = -p5.random(0.5 * parentHeight, parentHeight);
      rippleCenterX = p5.random(0, parentWidth);
    } else {
      // below canvas
      rippleCenterY =
        parentHeight + p5.random(0.5 * parentHeight, parentHeight);
      rippleCenterX = p5.random(0, parentWidth);
    }
  };

  const calculatePoints = () => {
    scale = preferredScale;
    const plotRadius = scale / 50;

    // 点の配列を更新
    blackPoints = [];
    redPoints = [];
    yellowPoints = [];

    // starsRightの点を計算
    starsRight.forEach(point => {
      blackPoints.push({x: point.x * scale, y: point.y * scale, radius: 0});

      for (let i = 0; i < 5; i++) {
        const angle = i * ((2 * Math.PI) / 5);
        redPoints.push({
          x: point.x * scale + plotRadius * Math.cos(angle),
          y: point.y * scale + plotRadius * Math.sin(angle),
          radius: 0,
        });
      }
      for (let i = 0; i < 5; i++) {
        const angle = i * ((2 * Math.PI) / 5) + Math.PI;
        yellowPoints.push({
          x: point.x * scale + plotRadius * Math.cos(angle),
          y: point.y * scale + plotRadius * Math.sin(angle),
          radius: 0,
        });
      }
    });

    // starsLeftの点を計算
    starsLeft.forEach(point => {
      blackPoints.push({x: point.x * scale, y: point.y * scale, radius: 0});

      for (let i = 0; i < 5; i++) {
        const angle = i * ((2 * Math.PI) / 5) + Math.PI;
        redPoints.push({
          x: point.x * scale + plotRadius * Math.cos(angle),
          y: point.y * scale + plotRadius * Math.sin(angle),
          radius: 0,
        });
        for (let i = 0; i < 5; i++) {
          const angle = i * ((2 * Math.PI) / 5);
          yellowPoints.push({
            x: point.x * scale + plotRadius * Math.cos(angle),
            y: point.y * scale + plotRadius * Math.sin(angle),
            radius: 0,
          });
        }
      }
    });

    // sunstarsとsunstartipsの点を追加
    sunstars.forEach(point => {
      blackPoints.push({x: point.x * scale, y: point.y * scale, radius: 0});
    });

    sunstartips.forEach(point => {
      yellowPoints.push({x: point.x * scale, y: point.y * scale, radius: 0});
    });
  };

  p5.updateWithProps = (props: MySketchProps) => {
    parentWidth = props.w;
    parentHeight = props.h;
    p5.resizeCanvas(parentWidth, parentHeight);
    starsRight = props.starsRight;
    starsLeft = props.starsLeft;
    sunstars = props.sunstars;
    sunstartips = props.sunstartips;
    calculatePoints();
  };

  const calculateWaveFactor = (
    x: number,
    y: number,
    centerX: number,
    centerY: number,
    offset: number
  ): [number, number] => {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = p5.sqrt(dx * dx + dy * dy);
    const magnitude =
      waveAmplitude *
      p5.sin(waveFrequency * p5.frameCount - distance * spatialScale + offset) *
      distance *
      0.002;
    if (distance === 0) return [0, 0];
    return [(dx / distance) * magnitude, (dy / distance) * magnitude];
  };

  const blackWave: RadiusFunc = (x, y, color) => {
    const localFrequency = 0.08;
    const localAmplitude = 1.4;
    const localSpatialScale = 0.009;
    switch (color) {
      case 'black':
        return (
          (scale / 60) *
          (localAmplitude *
            p5.sin(p5.frameCount * localFrequency + x * localSpatialScale))
        );
      case 'red':
        return scale / 200;
      case 'yellow':
        return scale / 480;
    }
  };

  // transform mouse coordinates to sketch draw coordinate system
  const transformMouse = (mouseX: number, mouseY: number): [number, number] => {
    const cosR = p5.cos(rotation);
    const sinR = p5.sin(rotation);
    const tx = mouseX - (parentWidth / 2 + offsetX);
    const ty = mouseY - (parentHeight / 2 + offsetY);
    const transformedX = tx * cosR + ty * sinR;
    const transformedY = -tx * sinR + ty * cosR;
    return [transformedX, transformedY];
  };

  // Modified yellowMouse function for concentric ripple effect:
  const yellowMouse: RadiusFunc = (x, y, color) => {
    if (color === 'yellow') {
      const [transformedMouseX, transformedMouseY] = transformMouse(
        p5.mouseX,
        p5.mouseY
      );
      const d = p5.dist(x, y, transformedMouseX, transformedMouseY);
      const frequency = 0.03; // Adjust frequency as needed
      // const timeOffset = p5.millis() * 0.005; // Dynamic time shift
      const wave = (p5.sin(d * frequency) + 1) / 2;
      return p5.lerp(scale / 360, scale / 90, wave);
    }
    switch (color) {
      case 'black':
        return scale / 480;
      case 'red':
        return scale / 320;
      default:
        return scale / 90;
    }
  };

  const redCircular: RadiusFunc = (x, y, color) => {
    if (color !== 'red') {
      switch (color) {
        case 'black':
          return scale / 320;
        case 'yellow':
          return scale / 480;
        default:
          return scale / 360;
      }
    }
    const bigCircleRadius = scale / 8;
    const d = p5.dist(x, y, -offsetX, -offsetY);
    const smallCircleRadius = scale / 12;
    const smallCircleD = scale / 3;
    for (let i = 0; i < 8; i++) {
      const angle = i * (Math.PI / 4); // 60° increment
      const cx = smallCircleD * p5.cos(angle);
      const cy = smallCircleD * p5.sin(angle);
      if (p5.dist(x, y, cx - offsetX, cy - offsetY) < smallCircleRadius) {
        return scale / 320;
      }
    }
    if (d < bigCircleRadius) {
      return scale / 480;
    }
    return scale / 90;
  };

  const checkPath = (
    x: number,
    y: number,
    pathPoints: Point[], // x, y: 0 to 1
    brushWidth: number,
    progress: number // 0 to 1
  ): boolean => {
    // progressに応じて描画済みの点群を取得する
    const totalPoints = pathPoints.length;
    // progressが0の場合は開始点のみ、それ以外は進捗に応じた点群
    const drawnCount = progress === 0 ? 1 : Math.ceil(progress * totalPoints);
    const drawnPoints = pathPoints.slice(0, drawnCount).map(p => {
      // undo offset
      return {
        x: (p.x - 0.5) * p5.width,
        y: (p.y - 0.5) * p5.height,
      };
    });

    // 描画済み部分が1点のみの場合、その点との距離で判定
    if (drawnPoints.length === 1) {
      const dist = Math.hypot(x - drawnPoints[0].x, y - drawnPoints[0].y);
      return dist <= brushWidth / 2;
    }

    // 描画済みの各セグメントについて、指定の点までの距離を計算する
    for (let i = 0; i < drawnPoints.length - 1; i++) {
      const p0 = drawnPoints[i];
      const p1 = drawnPoints[i + 1];
      const dist = distanceToSegment(x, y, p0.x, p0.y, p1.x, p1.y);
      if (dist <= brushWidth / 2) {
        return true;
      }
    }

    return false;
  };

  const blackPath: RadiusFunc = (x, y, color) => {
    const brushWidth = scale / 3;
    const progress = (p5.millis() - lastSwitchTimestamp) / switchInterval;
    if (color === 'black') {
      return checkPath(
        x,
        y,
        pathPoints.map(p => {
          return {
            x: p.x / 100,
            y: p.y / 100,
          };
        }),
        brushWidth,
        progress
      )
        ? scale / 60
        : scale / 400;
    }
    switch (color) {
      case 'red':
        return scale / 480;
      case 'yellow':
        return scale / 320;
      default:
        return scale / 50;
    }
  };

  const blackSimple: RadiusFunc = (x, y, color) => {
    switch (color) {
      case 'black':
        return scale / 50;
      case 'red':
        return scale / 480;
      case 'yellow':
        return scale / 320;
    }
  };

  const redSimple: RadiusFunc = (x, y, color) => {
    switch (color) {
      case 'black':
        return scale / 320;
      case 'red':
        return scale / 90;
      case 'yellow':
        return scale / 480;
    }
  };

  const yellowSimple: RadiusFunc = (x, y, color) => {
    switch (color) {
      case 'black':
        return scale / 480;
      case 'red':
        return scale / 320;
      case 'yellow':
        return scale / 90;
    }
  };

  const switchingRadius = (
    x: number,
    y: number,
    color: 'black' | 'red' | 'yellow'
  ): number => {
    const radiusFuncs: RadiusFunc[] = [
      // blackSimple,
      redSimple,
      yellowSimple,
      blackWave,
      yellowMouse,
      redCircular,
      blackPath,
    ];
    if (p5.millis() - lastSwitchTimestamp > switchInterval) {
      let a = true;
      while (a) {
        const newIndex = p5.floor(p5.random(radiusFuncs.length));
        if (newIndex !== currentRadiusIndex) {
          currentRadiusIndex = newIndex;
          a = false;
        }
      }
      // currentRadiusIndex = 5;
      lastSwitchTimestamp = p5.millis();
    }
    return radiusFuncs[currentRadiusIndex](x, y, color);
  };

  p5.draw = () => {
    p5.background(color_bg);
    p5.noStroke();

    p5.translate(parentWidth / 2 + offsetX, parentHeight / 2 + offsetY);
    p5.rotate(rotation);

    p5.fill(color_black);
    blackPoints.forEach(point => {
      const [dx, dy] = calculateWaveFactor(
        point.x,
        point.y,
        rippleCenterX,
        rippleCenterY,
        0
      );
      const target_radius = switchingRadius(point.x, point.y, 'black');
      const radius = p5.lerp(point.radius, target_radius, radiusLerpFactor);
      p5.circle(point.x + dx, point.y + dy, radius);
      point.radius = radius;
    });

    p5.fill(color_red);
    redPoints.forEach(point => {
      const [dx, dy] = calculateWaveFactor(
        point.x,
        point.y,
        rippleCenterX,
        rippleCenterY,
        0.2
      );
      const target_radius = switchingRadius(point.x, point.y, 'red');
      const radius = p5.lerp(point.radius, target_radius, radiusLerpFactor);
      p5.circle(point.x + dx, point.y + dy, radius);
      point.radius = radius;
    });

    p5.fill(color_yellow);
    yellowPoints.forEach(point => {
      const [dx, dy] = calculateWaveFactor(
        point.x,
        point.y,
        rippleCenterX,
        rippleCenterY,
        0.4
      );
      const target_radius = switchingRadius(point.x, point.y, 'yellow');
      const radius = p5.lerp(point.radius, target_radius, radiusLerpFactor);
      p5.circle(point.x + dx, point.y + dy, radius);
      point.radius = radius;
    });
  };
};

export default function Sketch() {
  // const [width, height] = useWindowSize();
  const [ref, {width, height}] = useMeasure<HTMLDivElement>();

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
      <div className="w-full h-screen bg-[#FFF2DF] flex-col text-[#2A2A2A]">
        <header className="px-6 py-6 flex justify-between">
          <div className="text-lg">田中 太郎</div>
          <div className="text-lg">JA / EN</div>
        </header>
        <div ref={ref} className="w-full h-[400px]">
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
        </div>
        <div className="flex-1"></div>
      </div>
    </>
  );
}
