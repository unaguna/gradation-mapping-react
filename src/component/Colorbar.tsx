import { Stack } from '@mui/material';
import { SxProps } from '@mui/material/styles';
import React from 'react';


interface ColorbarProps {
  colors: { key?: string, color: string, size: number }[];
  sx?: SxProps;
}

const Colorbar: React.FC<ColorbarProps> = (props) => {
  const {
    colors,
    sx,
  } = props;

  return (
    <Stack direction="column" sx={sx}>
      {colors.map(({ key, color, size }, i) => (
        <div key={key ?? `color-${i}`} style={{ backgroundColor: color, flex: size }}></div>
      ))}
    </Stack>
  );
};

export default Colorbar;
