import Color from "color";

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

class ValuedColorscale {
  private readonly colorscale: [number, Color][];
  private readonly start: number;
  private readonly end: number;
  private readonly size: number;
  /** 等値線の値。昇順。 */
  readonly contourValues: number[];
  /** 使用する色のレベル。昇順ですべて0以上1以下。 */
  readonly colorBalance: number[];
  /** 使用するすべての色を明示するcolorscale */
  readonly fullColorscale: [number, Color][];

  constructor(colorscale: [number, string][], start: number, end: number, size: number) {
    this.colorscale = colorscale.map(([level, color]) => [level, Color(color)]);
    this.start = start;
    this.end = end;
    this.size = size;

    this.contourValues = ValuedColorscale.calcContourValues(start, end, size);
    this.colorBalance = ValuedColorscale.calcColorBalance(this.contourValues);
    this.fullColorscale = ValuedColorscale.calcFullColorscale(this.colorscale, this.colorBalance);
  }

  private static calcContourValues(start: number, end: number, size: number): number[] {
    const values = [];

    for (let v = start; v < end + size * 1.0E-3; v += size) {
      values.push(v);
    }

    return values;
  }

  private static calcColorBalance(contourValues: number[]): number[] {
    if (contourValues.length <= 0) return [0.0];

    return Array(contourValues.length + 1).fill(0).map((_, i) => i / contourValues.length);
  }

  private static calcFullColorscale(colorscale: [number, Color][], colorBalance: number[]): [number, Color][] {
    return colorBalance.map(level => {
      const [prev, next] = between(level, colorscale, v => v[0]);
      console.debug(level, prev, next);

      if (prev == null) return [level, colorscale[0][1]];
      else if (next == null) return [level, colorscale[colorscale.length - 1][1]];
      else if (prev[0] == next[0]) return [level, prev[1]];
      else return [level, weightedMean(prev[1], next[1], (next[0] - level) / (next[0] - prev[0]))]
    });
  }
}

export default ValuedColorscale;
