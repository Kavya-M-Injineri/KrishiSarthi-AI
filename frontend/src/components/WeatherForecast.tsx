import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle, TreeDeciduous, Waves } from "lucide-react";
import { Card } from './ui/card';

/**
 * WeatherForecast.tsx
 * Automatically loads weather using the *farmer's saved location*
 * from backend: GET /farmer/<id>
 */

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'sunny': return Sun;
    case 'rainy': return CloudRain;
    case 'cloudy': return Cloud;
    case 'partly-cloudy': return Cloud;
    default: return Cloud;
  }
};

const alertTypeToIcon = (type: string) => {
  switch ((type || "").toLowerCase()) {
    case "flood": return Waves;
    case "heat": return Sun;
    case "drought": return TreeDeciduous;
    default: return AlertTriangle;
  }
};

const alertSeverityToColor = (s: string) => {
  s = (s || "").toLowerCase();
  if (s === "high") return "red";
  if (s === "medium") return "orange";
  return "amber";
};

const encodeLoc = (loc: string) => encodeURIComponent(loc.trim());

export default function WeatherForecast() {

  // ------------------------------ STATE ------------------------------
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [climateAlerts, setClimateAlerts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [farmerLocation, setFarmerLocation] = useState("Bengaluru");

  // ------------------------------ FALLBACKS ------------------------------
  const FALLBACK_FORECAST = [
    { day: 'Mon', temp: 32, condition: 'sunny', rain: 0, humidity: 45 },
    { day: 'Tue', temp: 30, condition: 'partly-cloudy', rain: 10, humidity: 55 },
    { day: 'Wed', temp: 28, condition: 'rainy', rain: 80, humidity: 85 },
    { day: 'Thu', temp: 27, condition: 'rainy', rain: 70, humidity: 80 },
    { day: 'Fri', temp: 29, condition: 'cloudy', rain: 30, humidity: 65 },
    { day: 'Sat', temp: 31, condition: 'partly-cloudy', rain: 20, humidity: 50 },
    { day: 'Sun', temp: 33, condition: 'sunny', rain: 5, humidity: 40 }
  ];

  const FALLBACK_ALERTS = [
    { type: 'flood', severity: 'high', title: 'Heavy Rainfall Alert', description: 'Expected rainfall of 150mm', icon: Waves },
    { type: 'heat', severity: 'medium', title: 'Heatwave Warning', description: 'Temperatures may exceed 40°C', icon: Sun },
    { type: 'drought', severity: 'low', title: 'Dry Spell Notice', description: 'No significant rain expected', icon: TreeDeciduous }
  ];

  // ------------------------------ FETCH WEATHER ------------------------------
  const fetchWeather = async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      const loc = encodeLoc(location);
      const res = await fetch(`http://localhost:5000/weather?location=${loc}`);
      if (!res.ok) throw new Error("Weather API failed");

      const data = await res.json();

      // ------------------ map forecast ------------------
      const mappedForecast = (data.forecast || []).map((d: any) => {
        const dt = new Date(d.date + "T00:00:00");
        const day = dt.toLocaleDateString(undefined, { weekday: "short" });

        const rain = d.rain_prob ?? 0;

        let condition = "cloudy";
        if (rain >= 60) condition = "rainy";
        else if (rain >= 20) condition = "partly-cloudy";
        else condition = "sunny";

        return {
          day,
          temp: Math.round(d.max_temp ?? 0),
          condition,
          rain,
          humidity: 60 // open-meteo doesn't provide humidity → placeholder
        };
      });

      setWeatherData(mappedForecast.length ? mappedForecast : FALLBACK_FORECAST);

      // ------------------ alerts ------------------
      const mappedAlerts = (data.alerts || []).map((a: any) => ({
        ...a,
        icon: alertTypeToIcon(a.type),
        color: alertSeverityToColor(a.severity)
      }));

      setClimateAlerts(mappedAlerts.length ? mappedAlerts : FALLBACK_ALERTS);

      // ------------------ recommendations ------------------
      setRecommendations(
        Array.isArray(data.recommendations) && data.recommendations.length > 0
          ? data.recommendations
          : ["Weather stable — good time for routine farming work."]
      );

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch live weather — showing fallback data.");
      setWeatherData(FALLBACK_FORECAST);
      setClimateAlerts(FALLBACK_ALERTS);
      setRecommendations(["Fallback sample recommendations."]);
      setLoading(false);
    }
  };

  // ------------------------------ FETCH FARMER LOCATION FIRST ------------------------------
  useEffect(() => {
    const id = localStorage.getItem("farmer_id");

    if (!id) {
      fetchWeather("Bengaluru");
      return;
    }

    fetch(`http://localhost:5000/farmer/${id}`)
      .then(r => r.json())
      .then(profile => {
        if (profile.location) {
          setFarmerLocation(profile.location);
          fetchWeather(profile.location);
        } else {
          fetchWeather("Bengaluru");
        }
      })
      .catch(() => fetchWeather("Bengaluru"));
  }, []);

  // --------------------------------------------- UI UNCHANGED ---------------------------------------------
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div className="text-center relative" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-3 mb-2">
          <Cloud className="text-blue-600 w-10 h-10" />
          <h1 className="text-green-800">Weather & Climate Alerts</h1>
          <Sun className="text-yellow-600 w-10 h-10" />
        </div>
        <p className="text-green-700">Location: {farmerLocation}</p>
      </motion.div>

      {loading && <p className="text-center text-green-700">Fetching live weather...</p>}
      {error && <p className="text-center text-red-700">{error}</p>}

      {/* 7-day forecast */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {weatherData.map((day: any, index: number) => {
          const WeatherIcon = getWeatherIcon(day.condition);
          return (
            <motion.div key={day.day + index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="relative border-2 border-green-300 bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="absolute top-0 left-0 right-0 h-1">
                  <svg viewBox="0 0 100 2" className="w-full h-full">
                    <path d="M0,1 Q25,0 50,1 T100,1" stroke="rgb(34 197 94)" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                <div className="p-4 space-y-3 relative">
                  <p className="text-center text-green-800">{day.day}</p>

                  <motion.div animate={{ rotate: day.condition === 'sunny' ? [0, 360] : 0 }} transition={{ duration: 20, repeat: Infinity }} className="flex justify-center">
                    <WeatherIcon className="w-12 h-12" />
                  </motion.div>

                  <p className="text-center text-blue-900">{day.temp}°C</p>

                  <div className="flex justify-between">
                    <Droplets className="w-4 h-4 text-blue-500" /> <span>{day.rain}%</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Alerts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h2 className="text-center text-green-800">Climate Alerts</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {climateAlerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
                <Card className="border-2 p-6">
                  <div className="flex gap-3">
                    <div className="p-3 rounded-xl bg-red-200">
                      <Icon className="text-red-600 w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-red-800">{alert.title}</h3>
                      <p className="text-red-700 text-sm">{alert.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recommendations */}
      <Card className="border-2 p-6 bg-green-50">
        <h3 className="text-green-800 mb-3">Weather-Based Recommendations</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((r, i) => (
            <div key={i} className="bg-white/60 rounded-xl p-4">{r}</div>
          ))}
        </div>
      </Card>
    </div>
  );
}