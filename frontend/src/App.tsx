// frontend/src/App.tsx
import React, { useState, useCallback } from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import Stack from '@mui/joy/Stack'
import Sheet from '@mui/joy/Sheet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { VRPNode, Route, ScenarioData } from './types'
import ControlPanel from './components/ControlPanel'
import NodeConfigPanel from './components/NodeConfigPanel'
import Canvas from './components/Canvas' // Assuming Canvas component exists
import StatusBar from './components/StatusBar'
// Load example data if needed
import exampleScenario from './assets/basic example.json' // Adjust path if needed
import ActionButtons from './components/ActionButtons'

const queryClient = new QueryClient()

function App() {
  // Ensure the loaded data matches the ScenarioData type
  const initialScenario: ScenarioData = {
    nodes: exampleScenario.nodes as VRPNode[], // Type assertion
    num_vehicles: exampleScenario.num_vehicles,
    available_skills: exampleScenario.available_skills,
    // Ensure vehicle_skills keys are strings if needed by backend/solver
    vehicle_skills: Object.fromEntries(
      Object.entries(exampleScenario.vehicle_skills).map(([k, v]) => [String(k), v as string[]])
    )
  }

  const [nodes, setNodes] = useState<VRPNode[]>(initialScenario.nodes)
  const [numVehicles, setNumVehicles] = useState<number>(initialScenario.num_vehicles)
  const [availableSkills, setAvailableSkills] = useState<string[]>(initialScenario.available_skills)
  const [vehicleSkills, setVehicleSkills] = useState<{ [key: string]: string[] }>(initialScenario.vehicle_skills)
  const [selectedNode, setSelectedNode] = useState<VRPNode | null>(initialScenario.nodes[0] || null)
  const [routes, setRoutes] = useState<Route[]>([])
  const [statusMessage, setStatusMessage] = useState<string>('Ready')

  // --- Callbacks for ControlPanel ---
  const handleAddNode = useCallback((newNode: VRPNode) => {
    setNodes((prevNodes) => [...prevNodes, newNode])
    setStatusMessage(`Added Node ${newNode.id}`)
  }, [])

  const handleRemoveNode = useCallback(
    (nodeIdToRemove: number) => {
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeIdToRemove))
      if (selectedNode?.id === nodeIdToRemove) {
        setSelectedNode(null)
      }
      setStatusMessage(`Removed Node ${nodeIdToRemove}`)
      setRoutes([]) // Clear routes when nodes change
    },
    [selectedNode]
  )

  const handleSelectNode = useCallback((node: VRPNode | null) => {
    setSelectedNode(node)
    setStatusMessage(node ? `Selected Node ${node.id}` : 'Node deselected')
  }, [])

  const handleUpdateNode = useCallback((updatedNode: VRPNode) => {
    setNodes((prevNodes) => prevNodes.map((node) => (node.id === updatedNode.id ? updatedNode : node)))
    setSelectedNode(updatedNode) // Keep it selected
    setStatusMessage(`Updated Node ${updatedNode.id}`)
    setRoutes([]) // Clear routes when node constraints change
  }, [])

  const handleNumVehiclesChange = useCallback((count: number) => {
    setNumVehicles(count)
    // Adjust vehicleSkills if count decreases
    setVehicleSkills((prevSkills) => {
      const newSkills: { [key: string]: string[] } = {}
      for (let i = 0; i < count; i++) {
        newSkills[String(i)] = prevSkills[String(i)] || []
      }
      return newSkills
    })
    setStatusMessage(`Number of vehicles set to ${count}`)
    setRoutes([]) // Clear routes
  }, [])

  const handleSkillsChange = useCallback(
    (newAvailableSkills: string[], newVehicleSkills: { [key: string]: string[] }) => {
      setAvailableSkills(newAvailableSkills)
      setVehicleSkills(newVehicleSkills)
      // Optionally update nodes if a removed skill was required
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          required_skills: node.required_skills?.filter((skill) => newAvailableSkills.includes(skill))
        }))
      )
      setStatusMessage(`Skills updated`)
      setRoutes([]) // Clear routes
    },
    []
  )

  const handleClearRoutes = useCallback(() => {
    setRoutes([])
    setStatusMessage('Routes cleared.')
  }, [])

  const handleClearAll = useCallback(() => {
    const depot = nodes.find((n) => n.is_depot)
    setNodes(depot ? [depot] : []) // Keep only depot
    setSelectedNode(null)
    setRoutes([])
    setStatusMessage('Scenario cleared.')
    // Reset other settings if desired
    // setNumVehicles(initialScenario.num_vehicles);
    // setAvailableSkills(initialScenario.available_skills);
    // setVehicleSkills(initialScenario.vehicle_skills);
  }, [nodes])

  const handleLoadExample = useCallback(() => {
    // Reload the initial example data
    setNodes(initialScenario.nodes)
    setNumVehicles(initialScenario.num_vehicles)
    setAvailableSkills(initialScenario.available_skills)
    setVehicleSkills(initialScenario.vehicle_skills)
    setSelectedNode(null)
    setRoutes([])
    setStatusMessage('Loaded example scenario.')
  }, [initialScenario])

  // --- Current Scenario Data for Solver ---
  const getCurrentScenarioData = (): ScenarioData => ({
    nodes,
    num_vehicles: numVehicles,
    available_skills: availableSkills,
    vehicle_skills: vehicleSkills
  })

  return (
    <CssVarsProvider>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Box sx={{ display: 'flex', height: '100vh', p: 1, gap: 1 }}>
          {/* Control Panel Area */}
          <ControlPanel
            numVehicles={numVehicles}
            onNumVehiclesChange={handleNumVehiclesChange}
            availableSkills={availableSkills}
            vehicleSkills={vehicleSkills}
            onSkillsChange={handleSkillsChange}
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            onSolve={() => {
              /* Triggered by useMutation */
            }} // Let react-query handle solve
            onClearRoutes={handleClearRoutes}
            onClearAll={handleClearAll}
            onLoadExample={handleLoadExample}
            getCurrentScenarioData={getCurrentScenarioData} // Pass function to get data
            setStatusMessage={setStatusMessage} // Pass setter for status
            setRoutes={setRoutes} // Pass setter for routes
          />
          {selectedNode && (
            <NodeConfigPanel
              node={selectedNode}
              availableSkills={availableSkills}
              updateNode={handleUpdateNode}
              onClose={() => setSelectedNode(null)}
            />
          )}

          {/* Canvas and Status Area */}
          <Stack sx={{ flexGrow: 1, gap: 1 }}>
            <Sheet
              variant='outlined'
              sx={{
                flexGrow: 1,
                p: 1,
                borderRadius: 'sm',
                display: 'flex', // Added for centering canvas if needed
                justifyContent: 'center', // Added
                alignItems: 'center', // Added
                overflow: 'hidden' // Prevent canvas overflow issues
              }}
            >
              <ActionButtons
                onClearNodes={handleClearAll}
                onSave={function (): void {
                  throw new Error('Function not implemented.')
                }}
                onLoad={handleLoadExample}
                onClearRoutes={handleClearRoutes}
                setStatusMessage={setStatusMessage}
                setRoutes={setRoutes}
                getCurrentScenarioData={getCurrentScenarioData}
              />
              {/* --- Canvas Component --- */}
              <Canvas
                nodes={nodes}
                routes={routes}
                selectedNodeId={selectedNode?.id ?? null}
                onAddNode={handleAddNode}
                onRemoveNode={handleRemoveNode} // Pass remove handler
                onSelectNode={handleSelectNode} // Pass select handler
                width={800} // Example dimensions
                height={600}
              />
            </Sheet>
            {/* --- Status Bar --- */}
            <StatusBar message={statusMessage} />
          </Stack>
        </Box>
      </QueryClientProvider>
    </CssVarsProvider>
  )
}

export default App
