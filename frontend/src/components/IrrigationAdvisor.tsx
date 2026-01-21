import { useState } from 'react';
import { motion } from 'motion/react';
import { Droplets, TreeDeciduous, Waves, Sprout, Cloud } from 'lucide-react';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Button } from './ui/button';

export default function IrrigationAdvisor() {
  const [soilMoisture, setSoilMoisture] = useState([45]);
  const [temperature, setTemperature] = useState([28]);
  const [cropStage, setCropStage] = useState('vegetative');
  const [showResults, setShowResults] = useState(false);

  const irrigationNeed = Math.max(0, 100 - soilMoisture[0] + (temperature[0] - 25) * 2);
  const waterLevel = Math.min(100, irrigationNeed);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const stages = [
    { value: 'germination', label: 'Germination' },
    { value: 'vegetative', label: 'Vegetative' },
    { value: 'flowering', label: 'Flowering' },
    { value: 'fruiting', label: 'Fruiting' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-3 mb-2">
          <Droplets className="text-blue-600 w-10 h-10" />
          <h1 className="text-green-800">Water & Irrigation Advisor</h1>
          <Waves className="text-cyan-600 w-10 h-10" />
        </div>
        <p className="text-green-700">Smart water management and irrigation scheduling</p>
      </motion.div>

      {/* Input Parameters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Soil Moisture */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Droplets className="text-blue-600 w-6 h-6" />
              <h3 className="text-blue-900">Current Soil Moisture</h3>
            </div>
            <div className="space-y-4">
              <Slider 
                value={soilMoisture} 
                onValueChange={setSoilMoisture}
                min={0}
                max={100}
                step={1}
                className="mt-4"
              />
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Dry</span>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Droplets className="text-blue-600 w-5 h-5" />
                  </motion.div>
                  <span className="text-blue-900">{soilMoisture[0]}%</span>
                </div>
                <span className="text-blue-700">Wet</span>
              </div>
              {/* Water droplet visualization */}
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      opacity: i < Math.floor(soilMoisture[0] / 20) ? 1 : 0.2,
                      y: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  >
                    <Droplets className="text-blue-500 w-6 h-6" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Temperature */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Cloud className="text-orange-600 w-6 h-6" />
              <h3 className="text-orange-900">Temperature</h3>
            </div>
            <div className="space-y-4">
              <Slider 
                value={temperature} 
                onValueChange={setTemperature}
                min={10}
                max={45}
                step={1}
                className="mt-4"
              />
              <div className="flex justify-between">
                <span className="text-orange-700">Cool</span>
                <span className="text-orange-900">{temperature[0]}°C</span>
                <span className="text-orange-700">Hot</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Crop Stage Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Sprout className="text-green-600 w-6 h-6" />
              <h3 className="text-green-800">Crop Growth Stage</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stages.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => setCropStage(stage.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    cropStage === stage.value 
                      ? 'border-green-500 bg-green-100' 
                      : 'border-green-200 bg-white hover:bg-green-50'
                  }`}
                >
                  <Sprout className={`w-8 h-8 mx-auto mb-2 ${
                    cropStage === stage.value ? 'text-green-600' : 'text-green-400'
                  }`} />
                  <p className={cropStage === stage.value ? 'text-green-900' : 'text-green-700'}>
                    {stage.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Calculate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleCalculate}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6"
        >
          <Droplets className="w-5 h-5 mr-2" />
          Calculate Irrigation Need
        </Button>
      </div>

      {/* Results with Tree Icon Filling */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Tree Filling Visualization */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 p-8">
            <div className="text-center space-y-6">
              <h3 className="text-green-800">Irrigation Requirement</h3>
              
              {/* Tree with Water Fill */}
              <div className="relative inline-block">
                <div className="relative w-48 h-48 mx-auto">
                  {/* Tree outline */}
                  <TreeDeciduous className="absolute inset-0 w-full h-full text-green-700" strokeWidth={1.5} />
                  
                  {/* Water fill animation */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${waterLevel}%` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="absolute bottom-0 left-0 right-0"
                    >
                      <div 
                        className="w-full h-full bg-gradient-to-t from-blue-500 to-cyan-400 opacity-60"
                        style={{ 
                          clipPath: 'polygon(25% 0, 75% 0, 85% 15%, 90% 30%, 92% 50%, 90% 70%, 85% 85%, 75% 95%, 50% 100%, 25% 95%, 15% 85%, 10% 70%, 8% 50%, 10% 30%, 15% 15%)'
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Leaf water droplets */}
                  <motion.div
                    className="absolute top-8 left-12"
                    animate={{ y: [0, 10, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Droplets className="text-blue-500 w-6 h-6" />
                  </motion.div>
                  <motion.div
                    className="absolute top-8 right-12"
                    animate={{ y: [0, 10, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <Droplets className="text-cyan-500 w-6 h-6" />
                  </motion.div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-blue-900">{waterLevel.toFixed(0)}% Water Need</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
                    <Droplets className="text-blue-600 w-5 h-5" />
                    <span className="text-blue-800">
                      {waterLevel > 70 ? 'High Priority' : waterLevel > 40 ? 'Moderate Need' : 'Low Priority'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Irrigation Schedule - Clean Gradient Cards */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Waves className="text-green-600 w-8 h-8" />
                <h3 className="text-green-800">Recommended Irrigation Schedule</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-6 space-y-3">
                  <Droplets className="text-blue-600 w-8 h-8" />
                  <p className="text-blue-800">Amount</p>
                  <p className="text-blue-900">{(waterLevel * 0.5).toFixed(0)} mm</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl p-6 space-y-3">
                  <Cloud className="text-emerald-600 w-8 h-8" />
                  <p className="text-emerald-800">Frequency</p>
                  <p className="text-emerald-900">
                    {waterLevel > 70 ? 'Daily' : waterLevel > 40 ? 'Every 2 days' : 'Every 3 days'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-lime-100 rounded-xl p-6 space-y-3">
                  <Sprout className="text-green-600 w-8 h-8" />
                  <p className="text-green-800">Best Time</p>
                  <p className="text-green-900">Early Morning</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tips with Water Droplet Accents */}
          <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Droplets className="text-cyan-600 w-8 h-8" />
                <h3 className="text-cyan-800">Water Conservation Tips</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Use drip irrigation for water efficiency',
                  'Mulch around plants to retain moisture',
                  'Water during cooler parts of the day',
                  'Monitor soil moisture regularly'
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      <Droplets className="text-cyan-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                    </motion.div>
                    <span className="text-cyan-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
