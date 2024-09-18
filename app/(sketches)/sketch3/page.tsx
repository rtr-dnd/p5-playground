'use client';

import React, {useState} from 'react';
import {NextReactP5Wrapper} from '@p5-wrapper/next';
import {SketchProps, type Sketch} from '@p5-wrapper/react';
import clsx from 'clsx';

import useWindowSize from '@/utils/useWindowSize';

const bg = '#17253d';
const fg = '#d5dae3';

type MySketchProps = SketchProps & {
  scrollY: React.MutableRefObject<number>;
  w: number;
  h: number;
  text: string;
  shape: number; // 0: filled rect, 1: outlined rect, 2: filled ellipse, 3: outlined ellipse
  onClear: () => void;
};

const sketch: Sketch<MySketchProps> = p5 => {
  const margin_x = 64;
  const margin_y = 64;
  let str = 'HONGO DESIGN DAY ';
  const grid_max_x = 10;
  const grid_max_y = 14;

  let x_count = 0;
  let y_count = 0;
  let x_size = 0;
  let y_size = 0;
  let status = [[0]];
  let status_buffer = [[0]];

  let shape = 0;
  let onClear = () => {};

  let plexmono: unknown;
  p5.preload = () => {
    plexmono = p5.loadFont('/plexmonomedium.ttf');
  };

  const initGrid = () => {
    const available_width = p5.width - margin_x * 2;
    const available_height = p5.height - margin_y * 2;
    x_count = Math.floor(available_width / grid_max_x);
    y_count = Math.floor(available_height / grid_max_y);
    x_size = available_width / x_count;
    y_size = available_height / y_count;
    status = createZeros(x_count).map(e => createZeros(y_count));
    status_buffer = createZeros(x_count).map(e => createZeros(y_count));
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
    if (props.text !== str) {
      str = props.text;
    }
    if (props.shape !== shape) {
      shape = props.shape;
    }
    if (props.onClear !== onClear) {
      onClear = props.onClear;
    }
  };

  p5.doubleClicked = () => {
    status = createZeros(x_count).map(e => createZeros(y_count));
    status_buffer = createZeros(x_count).map(e => createZeros(y_count));
    onClear();
    return;
  };

  const showTexts = (status: Array<Array<number>>) => {
    for (let j = 0; j < y_count; j++) {
      for (let i = 0; i < x_count; i++) {
        const x =
          x_count >= 2 ? margin_x + i * x_size + x_size / 2 : p5.width / 2;
        const y =
          y_count >= 2 ? margin_y + j * y_size + y_size / 2 : p5.height / 2;

        const char_index = (i + j * x_count) % str.length;
        if (status[i][j] === 1) p5.text(str[char_index], x, y);
      }
    }
  };

  const satisfiesFilledRect = (
    x: number,
    y: number,
    x_range: number[],
    y_range: number[]
  ): boolean => {
    return (
      x >= x_range[0] && x <= x_range[1] && y >= y_range[0] && y <= y_range[1]
    );
  };

  const satisfiesOutlineRect = (
    x: number,
    y: number,
    x_range: number[],
    y_range: number[]
  ): boolean => {
    return (
      satisfiesFilledRect(x, y, x_range, y_range) &&
      ((x >= x_range[0] && x < x_range[0] + x_size) ||
        (x <= x_range[1] && x > x_range[1] - x_size) ||
        (y >= y_range[0] && y < y_range[0] + y_size) ||
        (y <= y_range[1] && y > y_range[1] - y_size))
    );
  };

  const satisfiesFilledEllipse = (
    x: number,
    y: number,
    x_range: number[],
    y_range: number[]
  ): boolean => {
    const center = [
      (x_range[0] + x_range[1]) / 2,
      (y_range[0] + y_range[1]) / 2,
    ];
    const radius = [center[0] - x_range[0], center[1] - y_range[0]];
    return (
      Math.pow(x - center[0], 2) / Math.pow(radius[0], 2) +
        Math.pow(y - center[1], 2) / Math.pow(radius[1], 2) <=
      1
    );
  };

  const satisfiesOutlineEllipse = (
    x: number,
    y: number,
    x_range: number[],
    y_range: number[]
  ): boolean => {
    return (
      satisfiesFilledEllipse(x, y, x_range, y_range) &&
      !satisfiesFilledEllipse(
        x,
        y,
        [x_range[0] + x_size, x_range[1] - x_size],
        [y_range[0] + y_size, y_range[1] - y_size]
      )
    );
  };

  // while dragged: update status_buffer; display status_buffer
  // while not dragged: display status
  let prev_isPressed = false;
  let start_point = [0, 0];

  p5.draw = () => {
    p5.clear();
    p5.background(bg);
    p5.textFont(plexmono);
    p5.textSize(12);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.fill(fg);

    if (p5.mouseIsPressed) {
      if (prev_isPressed) {
        // dragging
        status_buffer = JSON.parse(JSON.stringify(status));
        const end_point = [p5.mouseX, p5.mouseY];
        const x_range = [
          p5.min(start_point[0], end_point[0]),
          p5.max(start_point[0], end_point[0]),
        ];
        const y_range = [
          p5.min(start_point[1], end_point[1]),
          p5.max(start_point[1], end_point[1]),
        ];
        for (let j = 0; j < y_count; j++) {
          for (let i = 0; i < x_count; i++) {
            const x =
              x_count >= 2 ? margin_x + i * x_size + x_size / 2 : p5.width / 2;
            const y =
              y_count >= 2 ? margin_y + j * y_size + y_size / 2 : p5.height / 2;

            if (
              (shape === 0 && satisfiesFilledRect(x, y, x_range, y_range)) ||
              (shape === 1 && satisfiesOutlineRect(x, y, x_range, y_range)) ||
              (shape === 2 && satisfiesFilledEllipse(x, y, x_range, y_range)) ||
              (shape === 3 && satisfiesOutlineEllipse(x, y, x_range, y_range))
            )
              status_buffer[i][j] = 1;
          }
        }
      } else {
        // started dragging
        status_buffer = JSON.parse(JSON.stringify(status));
        start_point = [p5.mouseX, p5.mouseY];
      }
    } else {
      if (prev_isPressed) {
        // stopped dragging
        status = JSON.parse(JSON.stringify(status_buffer));
      } else {
        // not dragging
      }
    }

    const current_status = p5.mouseIsPressed ? status_buffer : status;
    showTexts(current_status);

    prev_isPressed = p5.mouseIsPressed;
  };
};

const ShapeButton = (props: {
  selected: boolean;
  content: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={props.onClick}
      className={clsx(
        'rounded-md flex items-center justify-center w-8 aspect-square',
        props.selected && 'bg-black/60'
      )}
    >
      {props.content}
    </button>
  );
};

export default function Sketch() {
  const [width, height] = useWindowSize();
  const [val, setVal] = useState('HONGO DESIGN DAY ');
  const [shape, setShape] = useState(0);

  const DEFAULT_MSG = 'DRAG / DOUBLE CLICK';
  const [msg, setMsg] = useState(DEFAULT_MSG);
  const onClear = () => {
    setMsg('CLEARED');
    setTimeout(() => setMsg(DEFAULT_MSG), 1000);
  };

  return (
    <>
      <div className="text-white absolute bottom-0 left-0 right-0 p-4 text-xs opacity-30 flex justify-between items-center font-mono">
        <div className="flex-1">{msg}</div>
        <div className="flex flex-1 gap-1 items-center justify-center">
          <ShapeButton
            selected={shape === 0}
            content="■"
            onClick={() => setShape(0)}
          />
          <ShapeButton
            selected={shape === 1}
            content="□"
            onClick={() => setShape(1)}
          />
          <ShapeButton
            selected={shape === 2}
            content="●"
            onClick={() => setShape(2)}
          />
          <ShapeButton
            selected={shape === 3}
            content="◯"
            onClick={() => setShape(3)}
          />
        </div>
        <div className="flex-1 text-right">
          <input
            className="bg-transparent border border-white px-1 text-right"
            value={val}
            onChange={e => setVal(e.target.value)}
          />
        </div>
      </div>
      {width !== 0 && height !== 0 && (
        <NextReactP5Wrapper
          sketch={sketch}
          w={width}
          h={height}
          text={val}
          shape={shape}
          onClear={onClear}
        />
      )}
    </>
  );
}

const createZeros = (length: number) => {
  return Array.from({length: length}, (item, index) => 0);
};
