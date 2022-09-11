import { Stack, Tooltip } from '@mui/material';
import { SxProps } from '@mui/material/styles';
import Color from 'color';
import React, { useMemo } from 'react';


interface ColorbarProps {
  colors: { key?: string, level: number, color: string | Color }[];
  values: (string | number)[];
  edgeSize?: number;
  sx?: SxProps;
}

const Colorbar: React.FC<ColorbarProps> = (props) => {
  const {
    colors,
    values: values_,
    sx: sx_,
    edgeSize = 1,
  } = props;

  const sx: SxProps = useMemo(() => Object.assign({}, sx_, {
    "& .colorbar__value": {
      backgroundColor: "rgba(255,255,255,0.5)",
      display: "block",
      position: "absolute",
      bottom: "-1ex",
      right: 0,
    },
  }), [sx_])

  const values = [null, ...values_];
  const size = 1.0;

  return (
    <Stack direction="column-reverse" sx={sx}>
      {colors.map(({ key, color: color_, level }, i) => {
        const color = typeof color_ === "string" ? color_ : color_.string();
        return (<Tooltip
          title={`${level}, ${color}`}
          placement="left"
          key={key ?? `color-${i}`}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: color,
              flex: (i === 0 || i === colors.length - 1) ? edgeSize * size : size,
            }}>
            <span className="colorbar__value">{values[i]}</span>
          </div>
        </Tooltip>);
      })}
    </Stack>
  );
};

export default Colorbar;
