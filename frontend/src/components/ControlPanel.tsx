
// frontend/src/components/ControlPanel.tsx
// (Imports remain the same)
import React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Stack from '@mui/joy/Stack';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import VehicleConfig from './VehicleConfig';
import SkillConfig from './SkillConfig';
import NodeConfig from './NodeConfig';
import { VRPNode, VehicleSkills, ScenarioData, SolverResult, Route } from '../types';

interface ControlPanelProps {
   // ... (props remain the same)
    numVehicles: number;
    onNumVehiclesChange: (count: number) => void;
    availableSkills: string[];
    vehicleSkills: VehicleSkills;
    onSkillsChange: (newAvailableSkills: string[], newVehicleSkills: VehicleSkills) => void;
    selectedNode: VRPNode | null;
    onUpdateNode: (updatedNode: VRPNode) => void;
    onSolve: () => void;
    onClearRoutes: () => void;
    onClearAll: () => void;
    onLoadExample: () => void;
    getCurrentScenarioData: () => ScenarioData;
    setStatusMessage: (message: string) => void;
    setRoutes: (routes: Route[]) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
   numVehicles,
   onNumVehiclesChange,
   availableSkills,
   vehicleSkills,
   onSkillsChange,
   selectedNode,
   onUpdateNode,
   onClearRoutes,
   onClearAll,
   onLoadExample,
   getCurrentScenarioData,
   setStatusMessage,
   setRoutes,
}) => {
    const mutation = useMutation<SolverResult, Error, ScenarioData>({
        mutationFn: async (scenarioData: ScenarioData) => {
          // Make sure backend URL and port are correct
          const response = await axios.post<SolverResult>('http://localhost:5002/api/solve', scenarioData);
          return response.data;
        },
        onMutate: () => {
            setStatusMessage('Solving VRP...');
            setRoutes([]); // Clear previous routes visually
          },
          onSuccess: (data) => {
            if (data.status === 'success' && data.routes) {
              setRoutes(data.routes);
              setStatusMessage(`Solution found! Max Distance: ${data.max_distance?.toFixed(1) ?? 'N/A'}. ${data.message ?? ''}`);
            } else {
               // Handle success case with no routes (e.g. only depot) or specific messages
                setRoutes([]);
                setStatusMessage(data.message || 'Solver finished without routes.');
            }
          },
          onError: (error) => {
            // Try to get specific message from backend error if available
            let errorMessage = error.message;
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            setStatusMessage(`Error: ${errorMessage}`);
            setRoutes([]);
          },
        }
      );
    const handleSolveClick = () => {
        const currentData = getCurrentScenarioData();
         console.log("Solve button clicked.");
         console.log("Data being sent:", currentData);
         if (currentData.nodes.length < 1) { /* ... */ return; }
         if (currentData.nodes.length > 1 && currentData.num_vehicles < 1) { /* ... */ return; }
         console.log("Attempting to call mutation.mutate...");
         mutation.mutate(currentData);
         console.log("Called mutation.mutate.");
    };


  // Use consistent spacing for the main Stack and Dividers
  return (
    <Stack spacing={2.5} sx={{ flexGrow: 1 }}> {/* Main spacing between sections */}
      {/* Vehicle Configuration */}
      <VehicleConfig
         numVehicles={numVehicles}
         onNumVehiclesChange={onNumVehiclesChange}
      />
      <Divider />

      {/* Skills Configuration */}
      <SkillConfig
          availableSkills={availableSkills}
          vehicleSkills={vehicleSkills}
          numVehicles={numVehicles}
          onSkillsChange={onSkillsChange}
       />
      <Divider />

      {/* Node Configuration */}
      <NodeConfig
        selectedNode={selectedNode}
        availableSkills={availableSkills}
        onUpdateNode={onUpdateNode}
      />
      {/* Optional Divider if more sections were below */}
      {/* <Divider /> */}

      {/* Action Buttons - Pushed to bottom */}
      <Box sx={{ mt: 'auto', pt: 2 }}> {/* Added padding-top */}
         <Stack spacing={1.5}> {/* Slightly increased spacing */}
             <Button
                 variant="solid"
                 color="primary"
                 onClick={handleSolveClick}
                 loading={mutation.isPending}
                 disabled={mutation.isPending}
                 size="lg" // Make primary button larger
             >
                 Solve VRP
             </Button>
              <Stack direction="row" spacing={1.5} justifyContent="space-between"> {/* Increased spacing */}
                  <Button variant="outlined" color="neutral" onClick={onClearRoutes} disabled={mutation.isPending} sx={{flexGrow: 1}}>Clear Routes</Button>
                  <Button variant="outlined" color="neutral" onClick={onLoadExample} disabled={mutation.isPending} sx={{flexGrow: 1}}>Load Example</Button>
              </Stack>
             <Button variant="soft" color="danger" onClick={onClearAll} disabled={mutation.isPending}>Clear All Nodes</Button>
         </Stack>
      </Box>
    </Stack>
  );
};

export default ControlPanel;