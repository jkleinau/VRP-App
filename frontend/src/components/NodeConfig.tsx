// frontend/src/components/NodeConfig.tsx
// (Imports remain the same)
import React, { useState, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import FormHelperText from '@mui/joy/FormHelperText';
import Chip from '@mui/joy/Chip';

import { VRPNode } from '../types';

interface NodeConfigProps {
  // ... (props remain the same)
   selectedNode: VRPNode | null;
   availableSkills: string[];
   onUpdateNode: (updatedNode: VRPNode) => void;
}

const NodeConfig: React.FC<NodeConfigProps> = ({
   selectedNode,
   availableSkills,
   onUpdateNode,
}) => {
  // ... (state and handlers remain the same)
   const [timeWindowStart, setTimeWindowStart] = useState<string>('');
   const [timeWindowEnd, setTimeWindowEnd] = useState<string>('');
   const [timeWindowError, setTimeWindowError] = useState<string | null>(null);

   useEffect(() => {
       if (selectedNode?.time_window) {
         setTimeWindowStart(String(selectedNode.time_window[0]));
         setTimeWindowEnd(String(selectedNode.time_window[1]));
         setTimeWindowError(null);
       } else {
         setTimeWindowStart('');
         setTimeWindowEnd('');
         setTimeWindowError(null);
       }
   }, [selectedNode]);

   const isDepot = selectedNode?.is_depot ?? false;
   const isDisabled = !selectedNode || isDepot;

   const handleSetTimeWindow = () => {
       if (!selectedNode) return;
       const startNum = parseInt(timeWindowStart, 10);
       const endNum = parseInt(timeWindowEnd, 10);
       setTimeWindowError(null);
       if (isNaN(startNum) || isNaN(endNum) || startNum < 0 || endNum < 0) {
         setTimeWindowError("Times must be non-negative numbers.");
         return;
       }
       if (startNum >= endNum) {
         setTimeWindowError("End time must be after start time.");
         return;
       }
       onUpdateNode({ ...selectedNode, time_window: [startNum, endNum] });
   };

   const handleClearTimeWindow = () => {
       if (!selectedNode) return;
       setTimeWindowStart('');
       setTimeWindowEnd('');
       setTimeWindowError(null);
       onUpdateNode({ ...selectedNode, time_window: null });
   };

   const handleSkillToggle = (skill: string, checked: boolean) => {
        if (!selectedNode) return;
        const currentSkills = selectedNode.required_skills || [];
        let updatedSkills: string[];
        if (checked) {
             updatedSkills = Array.from(new Set([...currentSkills, skill]));
        } else {
            updatedSkills = currentSkills.filter(s => s !== skill);
        }
        onUpdateNode({ ...selectedNode, required_skills: updatedSkills });
   };


  return (
    <Box>
      <Typography level="title-md" sx={{ mb: 1.5 }}>Node Configuration</Typography>
      <Sheet variant="outlined" sx={{ p: 1.5, borderRadius: 'sm', mb: 2 }}>
          <Typography level="body-sm">
             {selectedNode
               ? `Selected: ${isDepot ? 'Depot' : 'Customer'} Node ${selectedNode.id} (${selectedNode.x}, ${selectedNode.y})`
            : 'No node selected. Click on the canvas to add or select a node.'}
          </Typography>
      </Sheet>

      {/* Time Window Configuration */}
      <Box sx={{ mb: 2 }}>
        <FormLabel sx={{ mb: 0.5 }}>Time Window</FormLabel> {/* Added mb to label */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}> {/* Removed mt */}
          <Input
            type="number"
            placeholder="Start"
            value={timeWindowStart}
            onChange={(e) => setTimeWindowStart(e.target.value)}
            slotProps={{ input: { min: 0, 'aria-label': 'Time Window Start' } }}
            error={!!timeWindowError}
            sx={{ width: 80 }}
            disabled={isDisabled}
          />
          <Typography>–</Typography>
          <Input
            type="number"
            placeholder="End"
            value={timeWindowEnd}
            onChange={(e) => setTimeWindowEnd(e.target.value)}
            slotProps={{ input: { min: 0, 'aria-label': 'Time Window End' } }}
            error={!!timeWindowError}
            sx={{ width: 80 }}
            disabled={isDisabled}
          />
          <Button size="sm" onClick={handleSetTimeWindow} disabled={isDisabled || !timeWindowStart || !timeWindowEnd}>Set</Button>
          <Button size="sm" variant="soft" color="neutral" onClick={handleClearTimeWindow} disabled={isDisabled || !selectedNode?.time_window}>Clear</Button>
        </Stack>
         {timeWindowError && <FormHelperText sx={{ color: 'danger.500', mt: 0.5 }}>{timeWindowError}</FormHelperText>}
      </Box>

      {/* Required Skills Configuration */}
      <FormControl disabled={isDisabled}>
        <FormLabel sx={{ mb: 0.5 }}>Required Skills</FormLabel> {/* Added mb to label */}
         {isDisabled ? (
              <Typography level="body-sm">Select a customer node to set required skills.</Typography>
         ) : availableSkills.length > 0 ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{mt: 0.5}}> {/* Added useFlexGap */}
            {availableSkills.map(skill => (
              <Checkbox
                key={`req-${skill}`}
                label={skill}
                size="sm"
                checked={selectedNode?.required_skills?.includes(skill) ?? false}
                 onChange={(e) => handleSkillToggle(skill, e.target.checked)}
                disabled={isDisabled}
              />
            ))}
             {(!selectedNode?.required_skills || selectedNode.required_skills.length === 0) && (
                  <Chip size="sm" variant='outlined' color='neutral' disabled>No skills required</Chip>
             )}
          </Stack>
        ) : (
           <Typography level="body-sm" sx={{ mt: 0.5 }}>Define skills in 'Skills Configuration' to set requirements.</Typography>
        )}
      </FormControl>
    </Box>
  );
};

export default NodeConfig;