# VRP-App: Vehicle Routing Problem Solver

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

An interactive web application for visualizing and solving Vehicle Routing Problems (VRP) with multiple constraints. This project consists of a React frontend for intuitive problem setup and visualization, and a Python backend for solving complex routing scenarios using Google OR-Tools.

![VRP-App Screenshot](https://via.placeholder.com/800x450.png?text=VRP-App+Screenshot)

## Features

### Visualization
- Interactive canvas for adding, selecting, and configuring customer nodes
- Visual representation of routes with distinct colors
- Zoomable and pannable map interface
- Clear visual indicators for node types and constraints

### Problem Configuration
- Dynamic vehicle count adjustment
- Skill definition and assignment to vehicles
- Node-specific requirements:
  - Time windows for delivery/service
  - Required skill specifications
- Support for depot configuration

### Solver Capabilities
- Distance minimization
- Time window constraints
- Skill matching between vehicles and customer requirements
- Fast solution using industry-standard algorithms

## Project Structure

- `/frontend`: React TypeScript application with MUI Joy UI components
- `/backend`: Flask Python server with OR-Tools integration

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn (for frontend)
- Python 3.8+ and pip (for backend)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/VRP-App.git
cd VRP-App
```

2. Set up the frontend:
```bash
cd frontend
npm install  # or yarn install
```

3. Set up the backend:
```bash
cd ../backend
python -m venv venv
# Activate virtual environment
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server:
```bash
# From the backend directory with virtual environment activated
python app.py
```
The backend will start on http://localhost:5002

2. Start the frontend development server:
```bash
# From the frontend directory
npm run dev  # or yarn dev
```
The frontend will start on http://localhost:5173

3. Open your browser and navigate to http://localhost:5173

## Usage

1. **Configure Vehicles**: Set the number of vehicles and assign skills if needed
2. **Add Nodes**: Click on the canvas to add customer nodes
3. **Configure Nodes**: Select nodes to add time windows or required skills
4. **Solve**: Click "Solve VRP" to find optimal routes
5. **Analyze**: View the calculated routes and solution metrics

## Technical Details

### Frontend
- Built with React 19, TypeScript, and Vite
- UI components from MUI Joy UI
- State management with React Hooks
- API integration with Axios and TanStack Query

### Backend
- Flask REST API
- Google OR-Tools for solving VRP instances
- Support for multiple constraints and optimization objectives

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google OR-Tools team for the powerful optimization library
- React and MUI teams for the frontend frameworks