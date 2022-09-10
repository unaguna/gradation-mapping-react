import Color from 'color';
import React, { useMemo } from 'react';
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
  const start = 0;
  const end = 1000;
  const size = 100;
  const colorscale: [number, string][] = [
    [0.0, "red"],
    [0.2, "yellow"],
    [1.0, "blue"],
  ];
  const colorscaleObj: [number, Color][] = colorscale.map(([level, color]) => [level, Color(color)]);

  // 等値線の値。昇順。
  const contourValues: number[] = useMemo(() => {
    const values = [];

    for (let v = start; v < end + size * 1.0E-3; v += size) {
      values.push(v);
    }

    return values;
  }, [start, end, size]);


  // 使用する色のレベル。昇順ですべて0以上1以下。
  const colorBalance: number[] = useMemo(() => {
    if (contourValues.length <= 0) return [0.0];

    return Array(contourValues.length + 1).fill(0).map((_, i) => i / contourValues.length);
  }, contourValues);

  const colors: [number, Color][] = useMemo(() => {
    return colorBalance.map(level => {
      const [prev, next] = between(level, colorscaleObj, v => v[0]);
      console.debug(level, prev, next);

      if (prev == null) return [level, colorscaleObj[0][1]];
      else if (next == null) return [level, colorscaleObj[colorscaleObj.length - 1][1]];
      else if (prev[0] == next[0]) return [level, prev[1]];
      else return [level, weightedMean(prev[1], next[1], (next[0] - level) / (next[0] - prev[0]))]
    });
  }, colorBalance);

  return <div>
    <Colorbar colors={colors.map(([_, c]) => ({ color: c, size: 1 }))} sx={{ height: "600px" }} />
  </div>
}
