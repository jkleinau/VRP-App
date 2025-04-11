// frontend/src/components/ControlPanel.tsx
import React, { useState } from 'react'
import Box from '@mui/joy/Box'
import Divider from '@mui/joy/Divider'
import Stack from '@mui/joy/Stack'

import Drawer from '@mui/joy/Drawer'
import IconButton from '@mui/joy/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

import VehicleConfig from './VehicleConfig'
import SkillConfig from './SkillConfig'
import { VRPNode, VehicleSkills, ScenarioData, Route } from '../types'

interface ControlPanelProps {
  // ... (props remain the same)
  numVehicles: number
  onNumVehiclesChange: (count: number) => void
  availableSkills: string[]
  vehicleSkills: VehicleSkills
  onSkillsChange: (newAvailableSkills: string[], newVehicleSkills: VehicleSkills) => void
  selectedNode: VRPNode | null
  onUpdateNode: (updatedNode: VRPNode) => void
  onSolve: () => void
  onClearRoutes: () => void
  onClearAll: () => void
  onLoadExample: () => void
  getCurrentScenarioData: () => ScenarioData
  setStatusMessage: (message: string) => void
  setRoutes: (routes: Route[]) => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  numVehicles,
  onNumVehiclesChange,
  availableSkills,
  vehicleSkills,
  onSkillsChange
}) => {
  const [open, setOpen] = useState(false)

  // Use consistent spacing for the main Stack and Dividers
  return (
    <>
      <IconButton
        variant='outlined'
        color='neutral'
        onClick={() => setOpen(true)}
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1100,
          bgcolor: 'background.surface'
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer size='md' variant='outlined' open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
          <Stack spacing={2.5} sx={{ flexGrow: 1, height: '100%' }}>
            {/* Vehicle Configuration */}
            <VehicleConfig numVehicles={numVehicles} onNumVehiclesChange={onNumVehiclesChange} />
            <Divider />

            {/* Skills Configuration */}
            <SkillConfig
              availableSkills={availableSkills}
              vehicleSkills={vehicleSkills}
              numVehicles={numVehicles}
              onSkillsChange={onSkillsChange}
            />
            <Divider />
          </Stack>
        </Box>
      </Drawer>
    </>
  )
}

export default ControlPanel
