import { Box, Button } from '@mui/joy'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { SolverResult, ScenarioData, Route } from '../types'
// Optional: Import CSS module if you created one
// import styles from './Components.module.css';

interface ActionButtonsProps {
  onClearNodes: () => void
  onSave: () => void
  onLoad: () => void
  onClearRoutes: () => void
  setStatusMessage: (message: string) => void
  setRoutes: (routes: Route[]) => void
  getCurrentScenarioData: () => ScenarioData
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onClearNodes,
  onSave,
  onLoad,
  onClearRoutes,
  setStatusMessage,
  setRoutes,
  getCurrentScenarioData
}) => {
  const mutation = useMutation<SolverResult, Error, ScenarioData>({
    mutationFn: async (scenarioData: ScenarioData) => {
      // Make sure backend URL and port are correct
      const response = await axios.post<SolverResult>('http://localhost:5002/api/solve', scenarioData)
      return response.data
    },
    onMutate: () => {
      setStatusMessage('Solving VRP...')
      setRoutes([]) // Clear previous routes visually
    },
    onSuccess: (data) => {
      if (data.status === 'success' && data.routes) {
        setRoutes(data.routes)
        setStatusMessage(
          `Solution found! Max Distance: ${data.max_distance?.toFixed(1) ?? 'N/A'}. ${data.message ?? ''}`
        )
      } else {
        // Handle success case with no routes (e.g. only depot) or specific messages
        setRoutes([])
        setStatusMessage(data.message || 'Solver finished without routes.')
      }
    },
    onError: (error) => {
      // Try to get specific message from backend error if available
      let errorMessage = error.message
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      setStatusMessage(`Error: ${errorMessage}`)
      setRoutes([])
    }
  })
  const handleSolveClick = () => {
    const currentData = getCurrentScenarioData()
    console.log('Solve button clicked.')
    console.log('Data being sent:', currentData)
    if (currentData.nodes.length < 1) {
      /* ... */ return
    }
    if (currentData.nodes.length > 1 && currentData.num_vehicles < 1) {
      /* ... */ return
    }
    console.log('Attempting to call mutation.mutate...')
    mutation.mutate(currentData)
    console.log('Called mutation.mutate.')
  }
  return (
    <Box
      className='action-buttons'
      sx={{ padding: 2, position: 'absolute', bottom: 20, right: 10, zIndex: 1000, width: '240px' }}
    >
      <Button 
        size='lg' 
        color='success' 
        onClick={handleSolveClick} 
        className='solve-button'
        sx={{ width: '100%', mb: 1 }}
      >
        Solve
      </Button>
      
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', mb: 1 }}>
        <Button onClick={onLoad} sx={{ width: '50%', mr: 0.5 }}>Load</Button>
        <Button onClick={onSave} sx={{ width: '50%', ml: 0.5 }}>Save</Button>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <Button onClick={onClearNodes} color='danger' sx={{ width: '50%', mr: 0.5 }}>Clear Nodes</Button>
        <Button onClick={onClearRoutes} color='danger' sx={{ width: '50%', ml: 0.5 }}>Clear Routes</Button>
      </Box>
    </Box>
  )
}

export default ActionButtons
