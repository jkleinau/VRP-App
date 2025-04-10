// frontend/src/components/SkillConfig.tsx
// (Imports remain the same)
import React, { useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import IconButton from '@mui/joy/IconButton';
import Sheet from '@mui/joy/Sheet';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider'; // Import Divider

interface SkillConfigProps {
  // ... (props remain the same)
   availableSkills: string[];
   vehicleSkills: { [key: string]: string[] };
   numVehicles: number;
   onSkillsChange: (newAvailableSkills: string[], newVehicleSkills: { [key: string]: string[] }) => void;
}

const SkillConfig: React.FC<SkillConfigProps> = ({
   availableSkills,
   vehicleSkills,
   numVehicles,
   onSkillsChange,
}) => {
  const [newSkill, setNewSkill] = useState('');

  // ... (handler functions remain the same)
   const handleAddSkill = () => {
       const trimmedSkill = newSkill.trim();
       if (trimmedSkill && !availableSkills.includes(trimmedSkill)) {
         const updatedAvailable = [...availableSkills, trimmedSkill];
         onSkillsChange(updatedAvailable, vehicleSkills);
         setNewSkill('');
       } else if (availableSkills.includes(trimmedSkill)) {
          console.warn(`Skill "${trimmedSkill}" already exists.`);
          setNewSkill('');
       }
   };

   const handleDeleteSkill = (skillToDelete: string) => {
       const updatedAvailable = availableSkills.filter(s => s !== skillToDelete);
       const updatedVehicleSkills: { [key: string]: string[] } = {};
       for (const vehicleId in vehicleSkills) {
          updatedVehicleSkills[vehicleId] = vehicleSkills[vehicleId].filter(s => s !== skillToDelete);
       }
       onSkillsChange(updatedAvailable, updatedVehicleSkills);
   };

   const handleVehicleSkillToggle = (vehicleId: string, skill: string, checked: boolean) => {
       const currentSkills = vehicleSkills[vehicleId] || [];
       let updatedSkills: string[];
       if (checked) {
           updatedSkills = Array.from(new Set([...currentSkills, skill]));
       } else {
           updatedSkills = currentSkills.filter(s => s !== skill);
       }
       const updatedVehicleSkills = { ...vehicleSkills, [vehicleId]: updatedSkills };
       onSkillsChange(availableSkills, updatedVehicleSkills);
   };


  return (
    <Box>
      <Typography level="title-md" sx={{ mb: 1.5 }}>Skills Configuration</Typography>

      {/* Group for Adding and Listing Skills */}
      <Stack spacing={2} sx={{ mb: 2 }}>
        <FormControl>
          <FormLabel>Add New Skill</FormLabel>
          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            <Input
              placeholder="e.g., refrigeration"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill(); }}
              sx={{ flexGrow: 1 }}
            />
            <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>Add</Button>
          </Stack>
        </FormControl>

        <FormControl>
           <FormLabel>Available Skills</FormLabel>
           {availableSkills.length > 0 ? (
               <List size="sm" sx={{ maxWidth: 300, mt: 0.5 }}> {/* Added mt */}
                   {availableSkills.map(skill => (
                       <ListItem
                           key={skill}
                           endAction={
                               <IconButton aria-label={`Delete skill ${skill}`} size="sm" color="danger" variant="plain" onClick={() => handleDeleteSkill(skill)}>X</IconButton>
                           }
                           sx={{py: 0.5}} // Adjust vertical padding
                       >
                           {skill}
                       </ListItem>
                   ))}
               </List>
           ) : (
               <Typography level="body-sm" sx={{ mt: 0.5 }}>No skills defined yet.</Typography>
           )}
       </FormControl>
      </Stack>

      <Divider sx={{ mb: 2 }}/> {/* Divider before assignment section */}

      {/* Vehicle Skill Assignment */}
      <FormControl>
        <FormLabel>Assign Skills to Vehicles</FormLabel>
        {availableSkills.length > 0 ? (
          <Stack spacing={1.5} sx={{ mt: 0.5 }}> {/* Added mt */}
            {Array.from({ length: numVehicles }, (_, i) => String(i)).map(vehicleId => (
              <Sheet key={`vehicle-${vehicleId}`} variant="outlined" sx={{ p: 1.5, borderRadius: 'sm' }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>Vehicle {vehicleId}</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap> {/* Added useFlexGap */}
                  {availableSkills.map(skill => (
                    <Checkbox
                      key={`${vehicleId}-${skill}`}
                      label={skill}
                      size="sm"
                      checked={vehicleSkills[vehicleId]?.includes(skill) ?? false}
                      onChange={(e) => handleVehicleSkillToggle(vehicleId, skill, e.target.checked)}
                    />
                  ))}
                  {(!vehicleSkills[vehicleId] || vehicleSkills[vehicleId].length === 0) && (
                       <Chip size="sm" variant='outlined' color='neutral' disabled>No skills assigned</Chip>
                   )}
                </Stack>
              </Sheet>
            ))}
          </Stack>
        ) : (
           <Typography level="body-sm" sx={{ mt: 0.5 }}>Define skills above to assign them.</Typography>
        )}
      </FormControl>
    </Box>
  );
};

export default SkillConfig;