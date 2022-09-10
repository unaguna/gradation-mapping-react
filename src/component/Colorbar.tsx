import { Stack } from '@mui/material';
import { SxProps } from '@mui/material/styles';
import Color from 'color';
import React, { useMemo } from 'react';


interface ColorbarProps {
  colors: { key?: string, color: string | Color, size: number }[];
  values: (string | number)[];
  sx?: SxProps;
}

const Colorbar: React.FC<ColorbarProps> = (props) => {
  const {
    colors,
    values: values_,
    sx: sx_,
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

  return (
    <Stack direction="column-reverse" sx={sx}>
      {colors.map(({ key, color: color_, size }, i) => {
        const color = typeof color_ === "string" ? color_ : color_.string();
        return (<div
          key={key ?? `color-${i}`}
          style={{
            position: "relative",
            backgroundColor: color,
            flex: size,
          }}>
          <span className="colorbar__value">{values[i]}</span>
        </div>);
      })}
    </Stack>
  );
};

export default Colorbar;
