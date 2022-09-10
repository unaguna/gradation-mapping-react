import { Button, Stack, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';
import Colorbar from './component/Colorbar';
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
  const [deltaStart, setDeltaStart] = useState("1");
  const [deltaEnd, setDeltaEnd] = useState("1");
  const [colorscale, setColorscale] = useState(JSON.stringify(defaultColorscale))

  const [startN, setStartN] = useState(Number.parseFloat(start) <= Number.parseFloat(end) ? Number.parseFloat(start) : Number.parseFloat(end));
  const [endN, setEndN] = useState(Number.parseFloat(start) <= Number.parseFloat(end) ? Number.parseFloat(end) : Number.parseFloat(start));
  const [sizeN, setSizeN] = useState(Number.parseFloat(size));
  const [colorscaleN, setColorscaleN] = useState<[number, string][]>(JSON.parse(colorscale));

  const valuedColorScale: ValuedColorscale =
    useMemo(() => new ValuedColorscale(colorscaleN, startN, endN, sizeN), [colorscaleN, startN, endN, sizeN]);

  const [deltaStartN, setDeltaStartN] = useState(Number.parseInt(deltaStart));
  const [deltaEndN, setDeltaEndN] = useState(Number.parseInt(deltaEnd));

  const newValuedColorScale: ValuedColorscale =
    useMemo(() => valuedColorScale.subsetByContourIndex(deltaStartN, valuedColorScale.contourValues.length - 1 - deltaEndN), [valuedColorScale, deltaStartN, deltaEndN]);

  /** 描画ボタンをクリックした際の処理 */
  const handleClickCalcButton = () => {
    const _start = Number.parseFloat(start);
    const _end = Number.parseFloat(end);
    const _size = Number.parseFloat(size);

    setStartN(_start <= _end ? _start : _end);
    setEndN(_start <= _end ? _end : _start);
    setSizeN(_size);
    setColorscaleN(JSON.parse(colorscale));
  };

  /** 変換ボタンをクリックした際の処理 */
  const handleClickTransButton = () => {
    setDeltaStartN(Number.parseInt(deltaStart));
    setDeltaEndN(Number.parseInt(deltaEnd));
  };

  return <Stack direction="row" spacing={1}>
    <Stack direction="column">
      <TextField
        value={end}
        onChange={e => setEnd(e.target.value)}
        label="end"
        variant="standard"
        inputProps={{ inputMode: 'numeric', pattern: '-?[0-9\.]*' }}
      />
      <TextField
        value={start}
        onChange={e => setStart(e.target.value)}
        label="start"
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
      <TextField
        value={colorscale}
        onChange={e => setColorscale(e.target.value)}
        label="colorscale"
        variant="standard"
        multiline
      />
      <Button variant="contained" onClick={handleClickCalcButton}>描画</Button>
    </Stack>
    <Colorbar values={valuedColorScale.contourValues} colors={valuedColorScale.fullColorscale.map(([_, c]) => ({ color: c, size: 1 }))} sx={{ flex: 1, height: "600px" }} />
    <Stack direction="column">
      <TextField
        value={deltaEnd}
        onChange={e => setDeltaEnd(e.target.value)}
        label="end側をnメモリ減らす"
        variant="standard"
        inputProps={{ inputMode: 'numeric', pattern: '-?[0-9]*' }}
      />
      <TextField
        value={deltaStart}
        onChange={e => setDeltaStart(e.target.value)}
        label="start側をnメモリ減らす"
        variant="standard"
        inputProps={{ inputMode: 'numeric', pattern: '-?[0-9]*' }}
      />
      <Button variant="contained" onClick={handleClickTransButton}>変換</Button>
    </Stack>
    <Stack direction="column">
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
        multiline
      />
    </Stack>
    <Colorbar values={newValuedColorScale.contourValues} colors={newValuedColorScale.fullColorscale.map(([_, c]) => ({ color: c, size: 1 }))} sx={{ flex: 1, height: "600px" }} />
  </Stack>
}
