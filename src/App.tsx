import { Button, Stack, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';
import Colorbar from './component/Colorbar';
import ValuedColorscale from './util/ValuedColorscale';

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

  const valuedColorScale: ValuedColorscale =
    useMemo(() => new ValuedColorscale(colorscale, startN, endN, sizeN), [colorscale, startN, endN, sizeN]);

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
    <Colorbar values={valuedColorScale.contourValues} colors={valuedColorScale.fullColorscale.map(([_, c]) => ({ color: c, size: 1 }))} sx={{ flex: 1, height: "600px" }} />
  </Stack>
}
