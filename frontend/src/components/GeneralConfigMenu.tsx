import React, { useState } from 'react';
import { ScenarioData } from '../types'; // [cite: uploaded:src/types.ts]
// Optional: Import CSS module if you created one
// import styles from './Components.module.css';

interface GeneralConfigMenuProps {
    scenario: ScenarioData;
    updateConfig: (updates: Partial<ScenarioData>) => void;
}

const GeneralConfigMenu: React.FC<GeneralConfigMenuProps> = ({ scenario, updateConfig }) => {
  const [isOpen, setIsOpen] = useState(true); // Default to open
  const [newSkill, setNewSkill] = useState('');

  const handleNumVehiclesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(event.target.value, 10);
    if (!isNaN(num) && num >= 0) {
      updateConfig({ num_vehicles: num });
      // Add logic here to potentially adjust vehicle_skills if num_vehicles decreases
    }
  };

  const handleAddSkill = () => {
    if (newSkill && !scenario.available_skills.includes(newSkill)) {
      updateConfig({ available_skills: [...scenario.available_skills, newSkill] });
      setNewSkill('');
    }
  };

  // Basic vehicle skill assignment - could be more complex UI
    const handleVehicleSkillChange = (vehicleIndex: number, skill: string, assigned: boolean) => {
        const currentSkills = scenario.vehicle_skills[vehicleIndex.toString()] || [];
        let newSkills: string[];

        if (assigned) {
            newSkills = [...currentSkills, skill];
        } else {
            newSkills = currentSkills.filter(s => s !== skill);
        }

        updateConfig({
            vehicle_skills: {
                ...scenario.vehicle_skills,
                [vehicleIndex.toString()]: newSkills,
            },
        });
    };

  return (
    <div className={`general-config-menu ${isOpen ? 'open' : 'closed'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="toggle-button">
        {isOpen ? '<' : '>'} Config
      </button>
      {isOpen && (
        <div className="menu-content">
          <h3>General Config</h3>
          <div>
            <label>Number of Vehicles:</label>
            <input
              type="number"
              min="0"
              value={scenario.num_vehicles}
              onChange={handleNumVehiclesChange}
            />
          </div>
          <div>
            <h4>Available Skills</h4>
            <ul>
                {scenario.available_skills.map(skill => <li key={skill}>{skill}</li>)}
            </ul>
             <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="New skill name"
            />
            <button onClick={handleAddSkill}>Add Skill</button>
          </div>
          <div>
            <h4>Vehicle Skills</h4>
            {/* Create entries for each vehicle based on num_vehicles */}
             {Array.from({ length: scenario.num_vehicles }).map((_, index) => (
                <div key={index}>
                    <h5>Vehicle {index}</h5>
                    {scenario.available_skills.map(skill => (
                       <div key={skill}>
                           <input
                               type="checkbox"
                               id={`v${index}-skill-${skill}`}
                               checked={scenario.vehicle_skills[index.toString()]?.includes(skill) || false}
                               onChange={(e) => handleVehicleSkillChange(index, skill, e.target.checked)}
                           />
                           <label htmlFor={`v${index}-skill-${skill}`}>{skill}</label>
                       </div>
                    ))}
                </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralConfigMenu;