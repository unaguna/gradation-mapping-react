import { Button, Checkbox, FormControlLabel, Paper, Stack, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';
import Colorbar from './component/Colorbar';
import { validateColorscaleJson, validateInteger, validateNumber, validatePositiveNumber } from './util/validation';
import ValuedColorscale from './util/ValuedColorscale';

const defaultColorscale: [number, string][] = [
  [0, "rgb(0,0,131)"],
  [0.2, "rgb(0,60,170)"],
  [0.4, "rgb(5,255,255)"],
  [0.6, "rgb(255,255,0)"],
  [0.8, "rgb(255,0,0)"],
  [1, "rgb(128,0,0)"],
];

export const App: React.FC = () => {
  const [start, setStart] = useState("2");
  const [end, setEnd] = useState("18");
  const [size, setSize] = useState("2");
  const [reversescale, setReversescale] = useState(false);
  const [deltaStart, setDeltaStart] = useState("1");
  const [deltaEnd, setDeltaEnd] = useState("1");
  const [colorscale, setColorscale] = useState(() => JSON.stringify(defaultColorscale))

  const [reversescaleN, setReversescaleN] = useState(reversescale);
  const [startN, setStartN] = useState(0);
  const [endN, setEndN] = useState(0);
  const [sizeN, setSizeN] = useState(2);
  const [colorscaleN, setColorscaleN] = useState<[number, string][]>(() => parseJsonOrUndefined(colorscale));

  const valuedColorScale: ValuedColorscale =
    useMemo(() => new ValuedColorscale(colorscaleN, startN, endN, sizeN, reversescaleN), [colorscaleN, startN, endN, sizeN, reversescaleN]);

  const [deltaStartN, setDeltaStartN] = useState(0);
  const [deltaEndN, setDeltaEndN] = useState(0);

  const newValuedColorScale: ValuedColorscale =
    useMemo(() => valuedColorScale.subsetByContourIndex(deltaStartN, valuedColorScale.contourValues.length - 1 - deltaEndN), [valuedColorScale, deltaStartN, deltaEndN]);

  /** 描画のパラメータの変更の有無 */
  const calcParamChanged = parseStart(start) !== startN || parseEnd(end) !== endN || parseSize(size) !== sizeN || JSON.stringify(parseJsonOrUndefined(colorscale)) !== JSON.stringify(colorscaleN) || reversescale !== reversescaleN;

  /** 変換のパラメータの変更の有無 */
  const transParamChanged = parseDeltaStart(deltaStart) !== deltaStartN || parseDeltaEnd(deltaEnd) !== deltaEndN;

  // 入力値をバリデーション
  const startValidationMessage = useMemo(() => validateNumber(start, true), [start]);
  const endValidationMessage = useMemo(() => validateNumber(end, true), [end]);
  const sizeValidationMessage = useMemo(() => validatePositiveNumber(size, true), [size]);
  const colorscaleValidationMessage = useMemo(() => validateColorscaleJson(colorscale, true), [colorscale]);
  const deltaStartValidationMessage = useMemo(() => validateInteger(deltaStart, true), [deltaStart]);
  const deltaEndValidationMessage = useMemo(() => validateInteger(deltaEnd, true), [deltaEnd]);

  /** 入力されている描画のパラメータが正しいか否か */
  const calcParamValid =
    startValidationMessage == null
    && endValidationMessage == null
    && sizeValidationMessage == null
    && colorscaleValidationMessage == null;

  /** 入力されている変換のパラメータが正しいか否か */
  const transParamValid =
    deltaStartValidationMessage == null
    && deltaEndValidationMessage == null;

  /** 描画ボタンをクリックした際の処理 */
  const handleClickCalcButton = () => {
    const _start = parseStart(start);
    const _end = parseEnd(end);
    const _size = parseSize(size);

    setStartN(_start <= _end ? _start : _end);
    setEndN(_start <= _end ? _end : _start);
    setSizeN(_size);
    setColorscaleN(JSON.parse(colorscale));
    setReversescaleN(reversescale);
  };

  /** 変換ボタンをクリックした際の処理 */
  const handleClickTransButton = () => {
    setDeltaStartN(parseDeltaStart(deltaStart));
    setDeltaEndN(parseDeltaEnd(deltaEnd));
  };

  return (<Stack direction="column" spacing={1}>
    <Stack direction="row" spacing={1} sx={{ height: "34rem" }}>
      <Paper elevation={3} sx={{ flex: 1, padding: "1em" }}>
        <Stack direction="row" spacing={1} sx={{ height: "100%" }}>
          <Stack direction="column" spacing={1} sx={{ flex: 1 }}>
            <TextField
              value={end}
              onChange={e => setEnd(e.target.value)}
              error={endValidationMessage != null}
              helperText={endValidationMessage}
              label="end"
              variant="standard"
              inputProps={{ inputMode: 'numeric' }}
            />
            <TextField
              value={start}
              onChange={e => setStart(e.target.value)}
              error={startValidationMessage != null}
              helperText={startValidationMessage}
              label="start"
              variant="standard"
              inputProps={{ inputMode: 'numeric' }}
            />
            <TextField
              value={size}
              onChange={e => setSize(e.target.value)}
              error={sizeValidationMessage != null}
              helperText={sizeValidationMessage}
              label="size"
              variant="standard"
              inputProps={{ inputMode: 'numeric', pattern: '-?[0-9\.]*' }}
            />
            <TextField
              value={colorscale}
              onChange={e => setColorscale(e.target.value)}
              error={colorscaleValidationMessage != null}
              helperText={colorscaleValidationMessage}
              label="colorscale"
              variant="standard"
              multiline
              rows={8}
            />
            <FormControlLabel control={<Checkbox checked={reversescale} onChange={e => setReversescale(e.target.checked)} />} label="reversescale" />
            <Button
              variant={calcParamChanged ? "contained" : "outlined"}
              onClick={handleClickCalcButton}
              disabled={!calcParamValid}
            >{"(1) 変換前の設定を反映"}</Button>
          </Stack>
          <Colorbar
            values={valuedColorScale.contourValues}
            colors={valuedColorScale.fullColorscale.map(([l, c]) => ({ color: c, level: l }))}
            edgeSize={0.6}
            sx={{ width: "6rem", height: "100%" }} />
        </Stack>
      </Paper>
      <Stack direction="column" spacing={1}>
        <TextField
          value={deltaEnd}
          onChange={e => setDeltaEnd(e.target.value)}
          error={deltaEndValidationMessage != null}
          helperText={deltaEndValidationMessage}
          label="上側をnメモリ減らす"
          variant="standard"
          inputProps={{ inputMode: 'numeric', pattern: '-?[0-9]*' }}
        />
        <TextField
          value={deltaStart}
          onChange={e => setDeltaStart(e.target.value)}
          error={deltaStartValidationMessage != null}
          helperText={deltaStartValidationMessage}
          label="下側をnメモリ減らす"
          variant="standard"
          inputProps={{ inputMode: 'numeric', pattern: '-?[0-9]*' }}
        />
        <Button
          variant={transParamChanged ? "contained" : "outlined"}
          onClick={handleClickTransButton}
          disabled={!transParamValid}
        >{"(2) 変換"}</Button>
      </Stack>
      <Paper elevation={3} sx={{ flex: 1, padding: "1em" }}>
        <Stack direction="row" spacing={1} sx={{ height: "100%" }}>
          <Stack direction="column" spacing={1} sx={{ flex: 1 }}>
            <TextField
              value={newValuedColorScale.end}
              label="end"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              value={newValuedColorScale.start}
              label="start"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              value={newValuedColorScale.size}
              label="size"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              value={JSON.stringify(newValuedColorScale.colorscale.map(([l, c]) => [l, c.rgb().string()]), undefined, 2)}
              label="colorscale"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
              multiline
              rows={8}
            />
            <TextField
              value={String(newValuedColorScale.reversescale)}
              label="reversescale"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
            />
          </Stack>
          <Colorbar
            values={newValuedColorScale.contourValues}
            colors={newValuedColorScale.fullColorscale.map(([l, c]) => ({ color: c, level: l }))}
            edgeSize={0.6}
            sx={{ width: "6rem", height: "100%" }} />
        </Stack>
      </Paper>
    </Stack>
    <Paper sx={{ padding: "1rem" }}>
      <h1>Gradation Mapping</h1>
      <p>plotlyで使われるグラデーションを拡張・縮小します。既存の（色，値）の対応を変えることなく拡大・縮小するための設定値を取得できます。</p>
      <h2>手順</h2>
      <ol>
        <li>現在plotlyで使用している設定値を画面左の入力欄に入力し、その下のボタンをクリックする。</li>
        <li>中央の入力欄に、変換のパラメータを入力し、その下のボタンをクリックする。</li>
        <li>画面右に表示されるカラーバーが期待通りであれば、画面右に表示される設定値をplotlyで使用してください。</li>
      </ol>
    </Paper>
  </Stack>);
}

function parseStart(value: string): number {
  return Number.parseFloat(value);
}

function parseEnd(value: string): number {
  return Number.parseFloat(value);
}

function parseSize(value: string): number {
  return Number.parseFloat(value);
}

function parseJsonOrUndefined(value: string): any {
  try {
    return JSON.parse(value);
  } catch (e) {
    return undefined;
  }
}

function parseDeltaStart(value: string): number {
  return Number.parseInt(value);
}

function parseDeltaEnd(value: string): number {
  return Number.parseInt(value);
}
