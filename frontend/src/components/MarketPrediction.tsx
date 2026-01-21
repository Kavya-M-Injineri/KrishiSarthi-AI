import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  MapPin,
  Leaf,
  Sprout,
} from "lucide-react";
import { Card } from "./ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// -----------------------------
// CUSTOM DOT FOR GRAPH
// -----------------------------
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;

  if (payload.marker) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill="#22c55e" opacity={0.2} />
        <circle cx={cx} cy={cy} r={4} fill="#16a34a" />
        <g transform={`translate(${cx - 6}, ${cy - 18})`}>
          <path d="M6,0 Q10,5 6,10 Q2,5 6,0" fill="#16a34a" />
        </g>
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={3} fill="#10b981" />;
};

// -----------------------------
// MAIN COMPONENT
// -----------------------------
export default function MarketPrediction() {
  // 🔥 STATES
  const [meta, setMeta] = useState<any>(null);
  const [commodity, setCommodity] = useState("");
  const [stateSel, setStateSel] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [trend, setTrend] = useState("stable");
  const [changePercent, setChangePercent] = useState(0);
  const [bestMandi, setBestMandi] = useState("");
  const [predictedPeak, setPredictedPeak] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // FETCH META ON LOAD
  // -----------------------------
  useEffect(() => {
    fetch("http://localhost:5000/market/meta")
      .then((r) => r.json())
      .then((j) => {
        setMeta(j);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // -----------------------------
  // LOAD DATA AFTER SEARCH
  // -----------------------------
  const runSearch = async () => {
    if (!commodity || !stateSel) return;

    setLoading(true);

    try {
      // 1. Fetch history
      const hRes = await fetch(
        `http://localhost:5000/market/history?commodity=${commodity}&state=${stateSel}`
      );
      const hJson = await hRes.json();
      setHistory(hJson.history || []);

      // 2. Fetch mandi list + trend
      const mRes = await fetch(
        `http://localhost:5000/market?commodity=${commodity}&state=${stateSel}`
      );
      const mJson = await mRes.json();

      setMarkets(mJson.markets || []);
      setTrend(mJson.trend);
      setChangePercent(mJson.change_percent);

      if (mJson.markets && mJson.markets.length > 0) {
        // modal price of last entry
        setCurrentPrice(mJson.markets[mJson.markets.length - 1].modal_price);

        // pick mandi with highest price
        const best = [...mJson.markets].sort(
          (a, b) => b.modal_price - a.modal_price
        )[0];
        setBestMandi(best.market);

        // predicted peak (very simple estimation)
        if (mJson.change_percent > 2) setPredictedPeak("Rising — peak soon");
        else if (mJson.change_percent < -2)
          setPredictedPeak("Dropping — wait");
        else setPredictedPeak("Stable this week");
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // -----------------------------
  // UI — SEARCH BAR
  // -----------------------------
  const SearchBar = () => (
    <div className="flex flex-col md:flex-row gap-4 bg-white/70 p-4 rounded-xl border border-green-300 shadow">
      {/* Commodity */}
      <div className="flex-1">
        <label className="text-sm text-green-700">Commodity</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
        >
          <option value="">— choose —</option>
          {meta?.commodities?.map((c: string) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* State */}
      <div className="w-64">
        <label className="text-sm text-green-700">State</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={stateSel}
          onChange={(e) => setStateSel(e.target.value)}
        >
          <option value="">— select —</option>
          {meta?.states?.map((s: string) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Button */}
      <div className="flex items-end">
        <button
          onClick={runSearch}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg"
        >
          Search
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-3">
          <TrendingUp className="w-10 h-10 text-purple-600" />
          <h1 className="text-green-800">Market Price Prediction</h1>
          <DollarSign className="w-10 h-10 text-pink-600" />
        </div>
        <p className="text-green-700">AI-enhanced mandi analytics</p>
      </motion.div>

      {meta && <SearchBar />}

      {/* LOADING */}
      {loading && <p className="text-center text-green-700">Loading…</p>}

      {/* PRICE OVERVIEW */}
      {!loading && currentPrice && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* CURRENT PRICE */}
          <Card className="border-2 border-green-300 bg-green-50 p-6">
            <p className="text-green-700">Current Price</p>
            <div className="flex items-center gap-2">
              <DollarSign className="text-green-600" />
              <p className="text-green-900">₹{currentPrice}/quintal</p>
            </div>
          </Card>

          {/* 7 DAY CHANGE */}
          <Card className="border-2 border-blue-300 bg-blue-50 p-6">
            <p className="text-blue-700">7-Day Change</p>
            <div className="flex items-center gap-2">
              {trend === "up" && <TrendingUp className="text-green-600" />}
              {trend === "down" && <TrendingDown className="text-red-600" />}
              <p className="text-green-900">{changePercent}%</p>
            </div>
          </Card>

          {/* PEAK PREDICTION */}
          <Card className="border-2 border-purple-300 bg-purple-50 p-6">
            <p className="text-purple-700">Predicted Peak</p>
            <p className="text-purple-900">{predictedPeak}</p>
          </Card>

          {/* BEST MANDI */}
          <Card className="border-2 border-amber-300 bg-amber-50 p-6">
            <p className="text-amber-700">Best Mandi</p>
            <p className="text-amber-900">{bestMandi}</p>
          </Card>
        </div>
      )}

      {/* PRICE TREND GRAPH */}
      {history.length > 0 && (
        <Card className="border-4 border-green-300 bg-green-50 p-6 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <Sprout className="text-green-600 w-8 h-8" />
            <h3 className="text-green-800">Price Trend (History)</h3>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="date" stroke="#16a34a" />
                <YAxis stroke="#16a34a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f0fdf4",
                    border: "2px solid #22c55e",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="natural"
                  dataKey="price"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={<CustomDot />}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* LIVE MANDI PRICES */}
      {markets.length > 0 && (
        <Card className="border-2 border-green-200 bg-green-50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="text-green-600 w-8 h-8" />
            <h3 className="text-green-800">Live Mandi Prices</h3>
          </div>

          <div className="space-y-3">
            {markets.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-4 border-2 border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sprout className="text-green-600" />
                    <div>
                      <p className="text-green-900">{m.market}</p>
                      <p className="text-green-700">{m.district}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-green-900">₹{m.modal_price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}