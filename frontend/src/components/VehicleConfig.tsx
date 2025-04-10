// frontend/src/components/VehicleConfig.tsx
import React from 'react';
import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Slider from '@mui/joy/Slider';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

interface VehicleConfigProps {
  numVehicles: number;
  onNumVehiclesChange: (count: number) => void;
}

const VehicleConfig: React.FC<VehicleConfigProps> = ({
  numVehicles,
  onNumVehiclesChange,
}) => {
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    onNumVehiclesChange(newValue as number);
  };

  return (
    // Add some padding/margin if needed, e.g., sx={{ mb: 2 }}
    <Box>
      <Typography level="title-md" sx={{ mb: 1.5 }}> {/* Increased bottom margin */}
        Vehicle Configuration
      </Typography>
      <FormControl>
        <FormLabel>Number of Vehicles</FormLabel>
        <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mt: 0.5 }}> {/* Consistent top margin */}
          <Slider
            aria-label="Number of vehicles"
            value={numVehicles}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
            sx={{ flexGrow: 1 }}
          />
          <Typography sx={{ minWidth: '2ch', textAlign: 'right' }}>{numVehicles}</Typography>
        </Stack>
      </FormControl>
    </Box>
  );
};

export default VehicleConfig;