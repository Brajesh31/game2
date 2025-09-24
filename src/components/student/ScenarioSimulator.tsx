import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Zap, Droplets, Leaf, Factory, TrendingUp, RotateCcw } from 'lucide-react';

export const ScenarioSimulator: React.FC = () => {
  const [selectedSimulation, setSelectedSimulation] = useState('farm');
  const [simulationData, setSimulationData] = useState({
    farm: {
      rainfall: 50,
      fertilizer: 30,
      pesticide: 20,
      crop_yield: 75,
      soil_health: 80,
      water_usage: 60
    },
    watershed: {
      forest_cover: 40,
      industrial_waste: 30,
      population: 50,
      water_quality: 70,
      biodiversity: 65,
      pollution_level: 35
    }
  });

  const simulations = [
    {
      id: 'farm',
      title: 'Smart Farm Simulator',
      description: 'Optimize crop yield while maintaining environmental sustainability',
      icon: '🚜',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'watershed',
      title: 'Watershed Management',
      description: 'Balance industrial development with environmental conservation',
      icon: '🏞️',
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  const updateParameter = (simulation: string, parameter: string, value: number) => {
    setSimulationData(prev => ({
      ...prev,
      [simulation]: {
        ...prev[simulation as keyof typeof prev],
        [parameter]: value
      }
    }));
  };

  const resetSimulation = () => {
    setSimulationData({
      farm: {
        rainfall: 50,
        fertilizer: 30,
        pesticide: 20,
        crop_yield: 75,
        soil_health: 80,
        water_usage: 60
      },
      watershed: {
        forest_cover: 40,
        industrial_waste: 30,
        population: 50,
        water_quality: 70,
        biodiversity: 65,
        pollution_level: 35
      }
    });
  };

  const currentData = simulationData[selectedSimulation as keyof typeof simulationData];

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🔮 "What If?" Scenario Simulator</h1>
        <p className="text-xl text-student-text-secondary">Explore cause and effect in complex systems</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="student-card p-8 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-2 border-purple-500/30 animate-student-slide-up">
        <div className="text-center">
          <div className="text-6xl mb-4">🧪</div>
          <h2 className="text-3xl font-bold text-student-text mb-4">AI-Powered System Modeling</h2>
          <p className="text-xl text-student-text-secondary mb-6">
            Advanced simulations with real-world data and machine learning predictions
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-full font-semibold shadow-student-card">
            <Zap className="w-5 h-5 mr-2" />
            Full AI Integration Q4 2024
          </div>
        </div>
      </div>

      {/* Simulation Selector */}
      <div className="flex justify-center space-x-4">
        {simulations.map((sim) => (
          <Button
            key={sim.id}
            onClick={() => setSelectedSimulation(sim.id)}
            className={selectedSimulation === sim.id ? 'btn-student-primary' : 'border-student-primary text-student-primary hover:bg-student-primary hover:text-student-on-primary'}
            size="lg"
          >
            <span className="text-2xl mr-2">{sim.icon}</span>
            {sim.title}
          </Button>
        ))}
      </div>

      {/* Simulation Interface */}
      <div className="student-card p-8 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-student-text">
            {simulations.find(s => s.id === selectedSimulation)?.title}
          </h2>
          <Button 
            variant="outline" 
            icon={RotateCcw}
            onClick={resetSimulation}
            className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
          >
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-student-text">🎛️ Control Parameters</h3>
            
            {Object.entries(currentData).map(([key, value]) => {
              if (key.includes('_')) return null; // Skip calculated values
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-student-text capitalize">{key.replace('_', ' ')}</label>
                    <span className="font-bold text-student-primary">{value}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => updateParameter(selectedSimulation, key, parseInt(e.target.value))}
                    className="w-full h-2 bg-student-background-secondary rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                </div>
              );
            })}
          </div>

          {/* Results */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-student-text">📊 Simulation Results</h3>
            
            {Object.entries(currentData).map(([key, value]) => {
              if (!key.includes('_')) return null; // Only show calculated values
              
              const getResultColor = (val: number) => {
                if (val >= 80) return 'text-green-600 bg-green-100';
                if (val >= 60) return 'text-yellow-600 bg-yellow-100';
                return 'text-red-600 bg-red-100';
              };
              
              return (
                <div key={key} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-student-text capitalize">{key.replace('_', ' ')}</span>
                    <span className={`px-3 py-1 rounded-full font-bold ${getResultColor(value)}`}>
                      {value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        value >= 80 ? 'bg-green-500' :
                        value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {/* Insights */}
            <div className="bg-student-primary/10 p-4 rounded-lg border border-student-primary/20">
              <h4 className="font-semibold text-student-primary mb-2">🤖 AI Insights</h4>
              <p className="text-student-primary text-sm">
                {selectedSimulation === 'farm' 
                  ? 'Increasing fertilizer beyond 40% may harm soil health. Consider organic alternatives.'
                  : 'High industrial waste is affecting water quality. Implement stricter regulations.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="student-card p-6 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-student-text mb-4">🎯 Learning Objectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="font-bold text-student-text mb-2">Systems Thinking</h3>
              <p className="text-student-text-secondary text-sm">Understand how different factors interact in complex systems</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">⚖️</div>
              <h3 className="font-bold text-student-text mb-2">Trade-offs</h3>
              <p className="text-student-text-secondary text-sm">Learn about balancing competing priorities and constraints</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-student-text mb-2">Decision Making</h3>
              <p className="text-student-text-secondary text-sm">Practice making informed decisions based on data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};