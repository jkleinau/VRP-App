import React from 'react';
// Optional: Import CSS module if you created one
// import styles from './Components.module.css';

interface ActionButtonsProps {
  onClearNodes: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSolve: () => void;
  onClearRoutes: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onClearNodes,
  onSave,
  onLoad,
  onSolve,
  onClearRoutes,
}) => {
  return (
    <div className="action-buttons">
      <button onClick={onLoad}>Load</button>
      <button onClick={onSave}>Save</button>
      <button onClick={onClearNodes}>Clear Nodes</button>
      <button onClick={onClearRoutes}>Clear Routes</button>
      <button onClick={onSolve} className="solve-button">Solve</button>
    </div>
  );
};

export default ActionButtons;