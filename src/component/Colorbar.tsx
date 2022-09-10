import { Stack } from '@mui/material';
import { SxProps } from '@mui/material/styles';
import Color from 'color';
import React from 'react';


interface ColorbarProps {
  colors: { key?: string, color: string | Color, size: number }[];
  sx?: SxProps;
}

const Colorbar: React.FC<ColorbarProps> = (props) => {
  const {
    colors,
    sx,
  } = props;

  return (
    <Stack direction="column" sx={sx}>
      {colors.map(({ key, color: color_, size }) => {
        const color = typeof color_ === "string" ? color_ : color_.string();
        return (<div
          key={key ?? `color-${color}`}
          style={{
            backgroundColor: color,
            flex: size,
          }}>
        </div>);
      })}
    </Stack>
  );
};

export default Colorbar;
