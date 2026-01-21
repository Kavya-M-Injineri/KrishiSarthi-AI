import { motion } from 'motion/react';
import { 
  BookOpen, 
  Sprout, 
  Droplets, 
  Cloud, 
  PawPrint, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Leaf,
  MessageSquare
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useState } from 'react';

const advisoryData = {
  cropHealth: {
    status: 'Good',
    condition: 87,
    alert: 'Minor leaf yellowing detected in sector C',
    icon: Sprout,
    color: 'green'
  },
  soilStatus: {
    status: 'Adequate',
    condition: 72,
    alert: 'Nitrogen levels slightly low, recommend fertilization',
    icon: Sprout,
    color: 'amber'
  },
  irrigationNeed: {
    status: 'Moderate',
    condition: 65,
    alert: 'Water within next 24 hours',
    icon: Droplets,
    color: 'blue'
  },
  weatherRisk: {
    status: 'Caution',
    condition: 45,
    alert: 'Heavy rainfall expected in 48 hours',
    icon: Cloud,
    color: 'orange'
  },
  wildlifeThreat: {
    status: 'Low',
    condition: 20,
    alert: 'No significant wildlife activity detected',
    icon: PawPrint,
    color: 'green'
  },
  marketPrediction: {
    status: 'Favorable',
    condition: 92,
    alert: 'Prices trending upward, hold for 5 more days',
    icon: TrendingUp,
    color: 'purple'
  }
};

export default function DailyAdvisory() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; message: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleAskAI = () => {
    if (!aiPrompt.trim()) return;

    setChatMessages([...chatMessages, { role: 'user', message: aiPrompt }]);
    setIsTyping(true);
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'ai',
        message: 'Based on your current crop conditions and weather forecast, I recommend applying a nitrogen-rich fertilizer within the next 2 days. The upcoming rainfall will help nutrient absorption. Also, ensure proper drainage to prevent waterlogging.'
      }]);
      setIsTyping(false);
      setAiPrompt('');
    }, 1500);
  };

  const suggestions = [
    'When should I harvest my wheat?',
    'Best fertilizer for current soil condition?',
    'How to prevent pest attacks?'
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
          <BookOpen className="text-emerald-600 w-10 h-10" />
          <h1 className="text-green-800">Daily Smart Advisory</h1>
          <Sprout className="text-teal-600 w-10 h-10" />
        </div>
        <p className="text-green-700">Personalized farming insights powered by AI</p>
      </motion.div>

      {/* Today's Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-4 border-emerald-300 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-8 relative overflow-hidden">
          {/* Sapling Watermark */}
          <div className="absolute top-0 right-0 opacity-5">
            <Sprout className="text-green-600 w-64 h-64" />
          </div>

          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                <BookOpen className="text-white w-8 h-8" />
              </div>
              <div>
                <h2 className="text-emerald-900">Today's Advisory Summary</h2>
                <p className="text-emerald-700">Thursday, November 20, 2025</p>
              </div>
            </div>

            <div className="bg-white/60 rounded-2xl p-6 border-2 border-emerald-300">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 w-6 h-6 mt-1 flex-shrink-0" />
                  <p className="text-green-800">Overall farm health is good. Your crops are in the vegetative stage with strong growth indicators.</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-orange-600 w-6 h-6 mt-1 flex-shrink-0" />
                  <p className="text-orange-800">Action required: Apply nitrogen fertilizer before the rainfall. Prepare drainage systems for heavy rain expected on Nov 22-23.</p>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="text-purple-600 w-6 h-6 mt-1 flex-shrink-0" />
                  <p className="text-purple-800">Market opportunity: Wheat prices are rising. Hold your produce for 5 more days to maximize profits.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Advisory Cards - Sapling Watermarked */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(advisoryData).map(([key, data], index) => {
          const Icon = data.icon;
          const colorClasses = {
            green: {
              border: 'border-green-300',
              bg: 'from-green-50 to-emerald-50',
              icon: 'text-green-600',
              bar: 'bg-green-500',
              text: 'text-green-700'
            },
            amber: {
              border: 'border-amber-300',
              bg: 'from-amber-50 to-orange-50',
              icon: 'text-amber-600',
              bar: 'bg-amber-500',
              text: 'text-amber-700'
            },
            blue: {
              border: 'border-blue-300',
              bg: 'from-blue-50 to-cyan-50',
              icon: 'text-blue-600',
              bar: 'bg-blue-500',
              text: 'text-blue-700'
            },
            orange: {
              border: 'border-orange-300',
              bg: 'from-orange-50 to-red-50',
              icon: 'text-orange-600',
              bar: 'bg-orange-500',
              text: 'text-orange-700'
            },
            purple: {
              border: 'border-purple-300',
              bg: 'from-purple-50 to-pink-50',
              icon: 'text-purple-600',
              bar: 'bg-purple-500',
              text: 'text-purple-700'
            }
          }[data.color] || colorClasses.green;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-2 ${colorClasses.border} bg-gradient-to-br ${colorClasses.bg} p-6 relative overflow-hidden h-full`}>
                {/* Sapling Watermark */}
                <div className="absolute bottom-0 right-0 opacity-10">
                  <Sprout className={`${colorClasses.icon} w-24 h-24`} />
                </div>

                <div className="relative space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`${colorClasses.icon} w-6 h-6`} />
                    <p className={colorClasses.text}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-900">{data.status}</span>
                      <span className="text-gray-900">{data.condition}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.condition}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full ${colorClasses.bar} rounded-full`}
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Leaf className={`${colorClasses.icon} w-4 h-4 mt-0.5 flex-shrink-0`} />
                    <p className={`${colorClasses.text} text-sm`}>{data.alert}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI Chat Section - Leaf Pod Shaped */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-4 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 p-8 relative overflow-hidden">
          {/* Glowing Border Effect */}
          <div className="absolute inset-0 rounded-3xl animate-pulse opacity-20">
            <div className="absolute inset-0 border-2 border-green-500 rounded-3xl" />
          </div>

          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500"
              >
                <MessageSquare className="text-white w-8 h-8" />
              </motion.div>
              <div>
                <h3 className="text-green-900">Ask KrishiSarthi AI</h3>
                <p className="text-green-700">Get personalized farming advice</p>
              </div>
            </div>

            {/* Chat Messages */}
            {chatMessages.length > 0 && (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-green-600 text-white rounded-br-none'
                          : 'bg-white border-2 border-green-300 text-green-800 rounded-bl-none'
                      }`}
                    >
                      {msg.role === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Sprout className="text-green-600 w-4 h-4" />
                          <span className="text-green-700">KrishiSarthi AI</span>
                        </div>
                      )}
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border-2 border-green-300 p-4 rounded-2xl rounded-bl-none">
                      <div className="flex gap-2">
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 bg-green-600 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-green-600 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-green-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Suggestion Bubbles */}
            {chatMessages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setAiPrompt(suggestion)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white border-2 border-green-300 rounded-full text-green-700 hover:bg-green-50 transition-colors flex items-center gap-2"
                  >
                    <Sprout className="w-4 h-4" />
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask anything about your farm..."
                  className="border-2 border-green-300 focus:border-green-500 rounded-2xl resize-none"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAskAI();
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleAskAI}
                disabled={!aiPrompt.trim() || isTyping}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-auto px-6"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sprout className="w-6 h-6" />
                </motion.div>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
