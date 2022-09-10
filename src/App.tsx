import { Button, Stack, TextField } from '@mui/material';
import Color from 'color';
import React, { useMemo, useState } from 'react';
import Colorbar from './component/Colorbar';

/**
 * 指定の値の前後に当たる要素を取り出す。
 * 
 * @param value 
 * @param array 昇順の配列
 */
function between(value: number, array: number[]): [number | null, number | null]
/**
 * 指定の値の前後に当たる要素を取り出す。
 * 
 * @param value 
 * @param array 昇順の配列
 * @param by 配列の要素を value と比較するための値
 */
function between<T>(value: number, array: T[], by: (v: T) => number): [T | null, T | null]
function between<T>(value: number, array: T[], by?: (v: T) => number): [T | null, T | null] {
  if (!by) by = (v: any) => v;

  let prev = null;
  for (let i = 0; i < array.length; i++) {
    if (by(array[i]) <= value) prev = array[i];
    else break;
  }

  let next = null;
  for (let i = array.length - 1; i >= 0; i--) {
    if (by(array[i]) >= value) next = array[i];
    else break;
  }

  return [prev, next];
}

/**
 * 色の加重平均
 * 
 * @param base 色1
 * @param other 色2
 * @param baseWeight 色1の割合
 * @returns 平均値
 */
function weightedMean(base: Color, other: Color, baseWeight: number): Color {
  const b = base.rgb().object();
  const o = other.rgb().object();

  const otherWeight = 1 - baseWeight;

  return Color.rgb([
    b.r * baseWeight + o.r * otherWeight,
    b.g * baseWeight + o.g * otherWeight,
    b.b * baseWeight + o.b * otherWeight,
  ]);
}

export const App: React.FC = () => {
  const [start, setStart] = useState("2");
  const [end, setEnd] = useState("18");
  const [size, setSize] = useState("2");

  const [startN, setStartN] = useState(Number.parseFloat(start) <= Number.parseFloat(end) ? Number.parseFloat(start) : Number.parseFloat(end));
  const [endN, setEndN] = useState(Number.parseFloat(start) <= Number.parseFloat(end) ? Number.parseFloat(end) : Number.parseFloat(start));
  const [sizeN, setSizeN] = useState(Number.parseFloat(size));

  const colorscale: [number, string][] = [
    [0, "rgb(166,206,227)"],
    [0.25, "rgb(31,120,180)"],
    [0.45, "rgb(178,223,138)"],
    [0.65, "rgb(51,160,44)"],
    [0.85, "rgb(251,154,153)"],
    [1, "rgb(227,26,28)"],
  ];
  const colorscaleObj: [number, Color][] = colorscale.map(([level, color]) => [level, Color(color)]);

  // 等値線の値。昇順。
  const contourValues: number[] = useMemo(() => {
    const values = [];

    for (let v = startN; v < endN + sizeN * 1.0E-3; v += sizeN) {
      values.push(v);
    }

    return values;
  }, [startN, endN, sizeN]);


  // 使用する色のレベル。昇順ですべて0以上1以下。
  const colorBalance: number[] = useMemo(() => {
    if (contourValues.length <= 0) return [0.0];

    return Array(contourValues.length + 1).fill(0).map((_, i) => i / contourValues.length);
  }, [contourValues]);

  const colors: [number, Color][] = useMemo(() => {
    return colorBalance.map(level => {
      const [prev, next] = between(level, colorscaleObj, v => v[0]);
      console.debug(level, prev, next);

      if (prev == null) return [level, colorscaleObj[0][1]];
      else if (next == null) return [level, colorscaleObj[colorscaleObj.length - 1][1]];
      else if (prev[0] == next[0]) return [level, prev[1]];
      else return [level, weightedMean(prev[1], next[1], (next[0] - level) / (next[0] - prev[0]))]
    });
  }, [colorBalance]);

  /** 描画ボタンをクリックした際の処理 */
  const handleClickCalcButton = () => {
    const _start = Number.parseFloat(start);
    const _end = Number.parseFloat(end);
    const _size = Number.parseFloat(size);

    setStartN(_start <= _end ? _start : _end);
    setEndN(_start <= _end ? _end : _start);
    setSizeN(_size);
  };

  return <Stack direction="row" spacing={1}>
    <Stack direction="column">
      <TextField
        value={start}
        onChange={e => setStart(e.target.value)}
        label="start"
        variant="standard"
        inputProps={{ inputMode: 'numeric', pattern: '-?[0-9\.]*' }}
      />
      <TextField
        value={end}
        onChange={e => setEnd(e.target.value)}
        label="end"
        variant="standard"
        inputProps={{ inputMode: 'numeric', pattern: '-?[0-9\.]*' }}
      />
      <TextField
        value={size}
        onChange={e => setSize(e.target.value)}
        label="size"
        variant="standard"
        inputProps={{ inputMode: 'numeric', pattern: '-?[0-9\.]*' }}
      />
      <Button variant="contained" onClick={handleClickCalcButton}>描画</Button>
    </Stack>
    <Colorbar values={contourValues} colors={colors.map(([_, c]) => ({ color: c, size: 1 }))} sx={{ flex: 1, height: "600px" }} />
  </Stack>
}
