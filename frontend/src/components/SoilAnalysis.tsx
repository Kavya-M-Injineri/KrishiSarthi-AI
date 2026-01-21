import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Sprout, BarChart3, Leaf } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Slider } from './ui/slider';

export default function SoilAnalysis() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [pH, setPH] = useState([7]);
  const [soilColor, setSoilColor] = useState('brown');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const soilColors = [
    { name: 'Dark Brown', value: 'brown', color: '#5D4037' },
    { name: 'Light Brown', value: 'light-brown', color: '#8D6E63' },
    { name: 'Red', value: 'red', color: '#BF360C' },
    { name: 'Yellow', value: 'yellow', color: '#F9A825' },
    { name: 'Black', value: 'black', color: '#212121' },
    { name: 'Gray', value: 'gray', color: '#616161' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
  if (!uploadedImage) return;
  setAnalyzing(true);

  try {
    // Convert base64 → File
    const response = await fetch(uploadedImage);
    const blob = await response.blob();
    const file = new File([blob], "soil.jpg", { type: blob.type });

    // Prepare form-data
    const formData = new FormData();
    formData.append("image", file);
    formData.append("ph", pH[0].toString());
    formData.append("color", soilColor);

    // Call backend
    const res = await fetch("http://localhost:5000/soil/analyze", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to analyze");
    }

    // Map backend → frontend format
    setResult({
      soilType: data.soil_type,
      moisture: data.moisture,
      organicMatter: data.organic_matter,
      npk: {
        nitrogen: data.npk.N,
        phosphorus: data.npk.P,
        potassium: data.npk.K
      },
      fertilizers: data.fertilizers,
      recommendedCrops: data.recommended_crops
    });
  } catch (err) {
    console.error("Analysis failed", err);
    alert("Soil analysis failed. Check backend.");
  }

  setAnalyzing(false);
};


  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-3 mb-2">
          <Sprout className="text-amber-600 w-10 h-10" />
          <h1 className="text-green-800">Soil Health Analysis</h1>
          <Sprout className="text-amber-700 w-10 h-10" />
        </div>
        <p className="text-green-700">Comprehensive soil fertility and nutrient assessment</p>
      </motion.div>

      {/* Upload Area with Soil Texture */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="relative border-4 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
          {/* Soil Texture Background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1724434675268-12d925ffc366?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2lsJTIwdGV4dHVyZSUyMGVhcnRoJTIwZ3JvdW5kfGVufDF8fHx8MTc2MzY1NzcyMnww&ixlib=rb-4.1.0&q=80&w=1080)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          <div className="relative p-8 space-y-6">
            {!uploadedImage ? (
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mx-auto w-32 h-32 bg-amber-200 rounded-full flex items-center justify-center"
                >
                  <Upload className="text-amber-700 w-16 h-16" />
                </motion.div>
                <div>
                  <p className="text-amber-900 mb-2">Upload soil sample image for analysis</p>
                  <p className="text-amber-700">Supported: JPG, PNG</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="soil-upload"
                />
                <label htmlFor="soil-upload">
                  <Button 
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                    asChild
                  >
                    <span className="cursor-pointer inline-flex items-center gap-2">
                      <Sprout className="w-5 h-5" />
                      Select Image
                    </span>
                  </Button>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border-2 border-amber-300">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded soil" 
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* pH Selector Shaped Like Sapling */}
      {uploadedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sprout className="text-green-600 w-6 h-6" />
                <h3 className="text-green-800">Select Soil pH</h3>
              </div>
              <div className="space-y-4">
                <div className="relative pt-8">
                  {/* Sapling growing indicator */}
                  <motion.div 
                    className="absolute top-0 left-1/2 -translate-x-1/2"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      y: [0, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sprout 
                      className="text-green-600" 
                      style={{ width: 24 + pH[0] * 3, height: 24 + pH[0] * 3 }}
                    />
                  </motion.div>
                  <Slider 
                    value={pH} 
                    onValueChange={setPH}
                    min={4}
                    max={10}
                    step={0.1}
                    className="mt-4"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Acidic</span>
                  <span className="text-green-900">pH: {pH[0].toFixed(1)}</span>
                  <span className="text-green-700">Alkaline</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Soil Color Swatches Like Soil Mounds */}
      {uploadedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sprout className="text-amber-600 w-6 h-6" />
                <h3 className="text-amber-900">Select Soil Color</h3>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {soilColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSoilColor(color.value)}
                    className={`relative group ${soilColor === color.value ? 'ring-4 ring-green-500' : ''}`}
                  >
                    <div 
                      className="w-full h-20 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                      style={{ 
                        backgroundColor: color.color,
                        boxShadow: `0 10px 20px ${color.color}40`
                      }}
                    />
                    <p className="text-center mt-2 text-amber-800">{color.name}</p>
                    {soilColor === color.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Sprout className="text-green-600 w-6 h-6" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Analyze Button */}
      {uploadedImage && (
        <div className="flex gap-3 justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-6"
          >
            {analyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                <Sprout className="w-5 h-5 mr-2" />
                Analyze Soil
              </>
            )}
          </Button>
          <Button
            onClick={() => {
              setUploadedImage(null);
              setResult(null);
            }}
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            Upload New
          </Button>
        </div>
      )}

      {/* Results with NPK Bars Rising Like Plant Stems */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Soil Type Card */}
          <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <div className="space-y-4">
              <h3 className="text-amber-900">Soil Analysis Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/60 rounded-lg p-4 text-center">
                  <p className="text-amber-700">Soil Type</p>
                  <p className="text-amber-900">{result.soilType}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-4 text-center">
                  <p className="text-amber-700">pH Level</p>
                  <p className="text-amber-900">{pH[0].toFixed(1)}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-4 text-center">
                  <p className="text-amber-700">Moisture</p>
                  <p className="text-amber-900">{result.moisture}%</p>
                </div>
                <div className="bg-white/60 rounded-lg p-4 text-center">
                  <p className="text-amber-700">Organic Matter</p>
                  <p className="text-amber-900">{result.organicMatter}%</p>
                </div>
              </div>
            </div>
          </Card>

          {/* NPK Bars Rising Like Plant Stems */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Sprout className="text-green-600 w-8 h-8" />
                <h3 className="text-green-800">NPK Nutrient Levels</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Nitrogen */}
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-green-800">Nitrogen (N)</p>
                    <p className="text-green-900">{result.npk.nitrogen}%</p>
                  </div>
                  <div className="relative h-48 bg-amber-100 rounded-t-full rounded-b-lg overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${result.npk.nitrogen}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-600 to-green-400 rounded-t-full"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      <Sprout className="text-white w-8 h-8" />
                    </div>
                  </div>
                </div>

                {/* Phosphorus */}
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-green-800">Phosphorus (P)</p>
                    <p className="text-green-900">{result.npk.phosphorus}%</p>
                  </div>
                  <div className="relative h-48 bg-amber-100 rounded-t-full rounded-b-lg overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${result.npk.phosphorus}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-full"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      <Sprout className="text-white w-8 h-8" />
                    </div>
                  </div>
                </div>

                {/* Potassium */}
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-green-800">Potassium (K)</p>
                    <p className="text-green-900">{result.npk.potassium}%</p>
                  </div>
                  <div className="relative h-48 bg-amber-100 rounded-t-full rounded-b-lg overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${result.npk.potassium}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-lime-600 to-lime-400 rounded-t-full"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      <Sprout className="text-white w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Fertilizer Recommendations - Soil Brown Panels */}
          <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-100 to-orange-100 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Leaf className="text-amber-700 w-8 h-8" />
                <h3 className="text-amber-900">Fertilizer Recommendations</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.fertilizers.map((fertilizer: any, index: number) => (
                  <div 
                    key={index}
                    className="bg-amber-900/20 rounded-xl p-4 space-y-2 border-2 border-amber-700/30"
                  >
                    <p className="text-amber-900">{fertilizer.name}</p>
                    <p className="text-amber-800">Amount: {fertilizer.amount}</p>
                    <p className="text-amber-700">Timing: {fertilizer.timing}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Crop Suggestions - Soil Brown Panels */}
          <Card className="border-2 border-green-300 bg-gradient-to-br from-green-100 to-emerald-100 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sprout className="text-green-700 w-8 h-8" />
                <h3 className="text-green-900">Recommended Crops (Current Season)</h3>
              </div>
              
              {/* Seasonal Tabs */}
              <div className="flex gap-4 mb-4">
                <div className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  <p>Rabi (Oct-Mar)</p>
                </div>
                <div className="px-4 py-2 bg-white/60 text-green-700 rounded-lg border-2 border-green-300">
                  <p>Kharif (Jun-Oct)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {result.recommendedCrops.map((crop: any, index: number) => (
                  <div 
                    key={index}
                    className="bg-green-900/20 rounded-xl p-4 text-center space-y-2 border-2 border-green-700/30"
                  >
                    <Sprout className="text-green-700 w-8 h-8 mx-auto" />
                    <p className="text-green-900">{crop.name}</p>
                    <div className="bg-white/60 rounded-full py-1 px-3">
                      <p className="text-green-800">{crop.suitability}%</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Rabi Crops Suggestion */}
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <p className="text-blue-800 mb-2">Also suitable for your soil:</p>
                <div className="flex flex-wrap gap-2">
                  {['Barley', 'Gram', 'Mustard', 'Peas'].map((crop, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}