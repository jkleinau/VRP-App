import React, { useState, useEffect } from 'react';
import { VRPNode } from '../types'; // [cite: uploaded:src/types.ts]
// Optional: Import CSS module if you created one
// import styles from './Components.module.css';

interface NodeConfigPanelProps {
  node: VRPNode;
  availableSkills: string[];
  updateNode: (updatedNode: VRPNode) => void;
  onClose: () => void;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ node, availableSkills, updateNode, onClose }) => {
  // Use local state to manage form edits before updating the main state
  const [editableNode, setEditableNode] = useState<VRPNode>(node);

  // Update local state if the selected node prop changes
  useEffect(() => {
    setEditableNode(node);
  }, [node]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    setEditableNode(prev => {
        if (name === 'x' || name === 'y') {
            return { ...prev, [name]: parseFloat(value) || 0 };
        }
        // Basic handling for time window - needs more robust input (e.g., two number inputs)
        if (name === 'time_window_start' || name === 'time_window_end') {
             const win = prev.time_window || [0,0];
             const index = name === 'time_window_start' ? 0 : 1;
             win[index] = parseInt(value, 10) || 0;
            return { ...prev, time_window: win as [number, number]};
        }
        if (type === 'checkbox') {
             const { checked } = event.target as HTMLInputElement;
             const skill = name; // Assuming checkbox name is the skill name
             const currentSkills = prev.required_skills || [];
             let newSkills: string[];
             if(checked) {
                newSkills = [...currentSkills, skill];
             } else {
                newSkills = currentSkills.filter(s => s !== skill);
             }
            return { ...prev, required_skills: newSkills };
        }

        return { ...prev, [name]: value };
    });
  };

  const handleSave = () => {
    updateNode(editableNode); // Send the updated node data back to App
    // Optionally close after save: onClose();
  };

  return (
    // Add 'node-config-panel' class to potentially exclude from panning
    <div className="node-config-panel">
      <h3>Node {editableNode.id} Config</h3>
      <button onClick={onClose} className="close-button">X</button>
      <div>
        <label>X:</label>
        <input name="x" type="number" value={editableNode.x} onChange={handleChange} />
      </div>
      <div>
        <label>Y:</label>
        <input name="y" type="number" value={editableNode.y} onChange={handleChange} />
      </div>
       <div>
        <label>Is Depot:</label>
        {/* Typically Depots might not be editable? Display only? */}
        <span>{editableNode.is_depot ? 'Yes' : 'No'}</span>
      </div>
       {/* Basic Time Window Example - Enhance this UI */}
      <div>
        <label>Time Window:</label>
        <input
            name="time_window_start"
            type="number"
            placeholder="Start"
            value={editableNode.time_window?.[0] ?? ''}
            onChange={handleChange}
            disabled={editableNode.is_depot} // Often depots don't have TWs
         />
        <input
            name="time_window_end"
            type="number"
            placeholder="End"
            value={editableNode.time_window?.[1] ?? ''}
            onChange={handleChange}
            disabled={editableNode.is_depot}
         />
      </div>
      <div>
        <h4>Required Skills</h4>
         {availableSkills.map(skill => (
             <div key={skill}>
                 <input
                     type="checkbox"
                     id={`skill-${skill}`}
                     name={skill} // Use skill name as input name for checkbox handling
                     checked={editableNode.required_skills?.includes(skill) || false}
                     onChange={handleChange}
                     disabled={editableNode.is_depot} // Often depots don't have skills
                 />
                 <label htmlFor={`skill-${skill}`}>{skill}</label>
             </div>
         ))}
      </div>
      <button onClick={handleSave}>Update Node</button>
    </div>
  );
};

export default NodeConfigPanel;