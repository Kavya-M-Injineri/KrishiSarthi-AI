import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Calendar, MapPin, Leaf, Sprout } from "lucide-react";
import { Button } from "./ui/button";
import MarketSearch from "./MarketSearch";

export default function MarketPrice() {
  const [commodity, setCommodity] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const [markets, setMarkets] = useState<any[]>([]);
  const [trend, setTrend] = useState<string>("stable");
  const [changePercent, setChangePercent] = useState<number>(0);

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (c: string, s: string, d: string) => {
    setCommodity(c);
    setState(s);
    setDistrict(d);
    fetchMarket(c, s, d);
    fetchHistory(c, s);
  };

  const fetchMarket = async (commodity: string, state: string, district: string) => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/market?commodity=${commodity}&state=${state}&district=${district}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.markets) {
        setMarkets(data.markets);
        setTrend(data.trend);
        setChangePercent(data.change_percent);
      }
    } catch (err) {
      console.log("Market fetch error", err);
    }
    setLoading(false);
  };

  const fetchHistory = async (commodity: string, state: string) => {
    try {
      const url = `http://localhost:5000/market/history?commodity=${commodity}&state=${state}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.history) {
        setHistory(data.history);
      }
    } catch (err) {
      console.log("History fetch error", err);
    }
  };

  const dynamicGraphPoints = history.map((h) => ({
    month: h.date,
    price: h.price,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-orange-600" />
          <h1 className="text-green-800">Market Price Prediction</h1>
        </div>
        <p className="text-green-600 max-w-2xl mx-auto">
          AI-driven price trends and selling suggestions to maximize your profits from crop sales.
        </p>
      </div>

      {/* Search Panel */}
      <MarketSearch onSearch={handleSearch} />

      {loading ? (
        <p className="text-green-600 text-center">Loading market data…</p>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* ======================= PRICE TREND GRAPH ======================= */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-green-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-green-800">
                  {commodity ? `${commodity} Price Trend` : "Price Trend"} (₹/quintal)
                </h3>

                <div className="flex items-center gap-2 text-green-700">
                  {trend === "up" && <TrendingUp className="w-5 h-5 text-green-600" />}
                  {trend === "down" && <TrendingDown className="w-5 h-5 text-red-600" />}
                  {trend === "stable" && <Leaf className="w-5 h-5 text-gray-500" />}
                  <span>
                    {changePercent > 0 && "+"}
                    {changePercent}%
                  </span>
                </div>
              </div>

              {/* GRAPH (UI unchanged) */}
              <div className="relative h-64 bg-gradient-to-b from-green-50 to-emerald-50 rounded-2xl p-6">
                {/* Draw dynamic points */}
                <svg width="100%" height="100%" viewBox="0 0 600 200">
                  <defs>
                    <linearGradient id="vineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="50%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>

                  {/* Grid */}
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#d1d5db" opacity="0.3" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#d1d5db" opacity="0.3" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="#d1d5db" opacity="0.3" />

                  {/* Dynamic line path */}
                  <path
                    d={
                      dynamicGraphPoints.length
                        ? dynamicGraphPoints
                            .map((p, i) => `L ${i * 100} ${180 - (p.price / 100) * 80}`)
                            .join(" ")
                            .replace("L", "M")
                        : "M0 180 L600 180"
                    }
                    stroke="url(#vineGradient)"
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Dots */}
                  {dynamicGraphPoints.map((p, i) => {
                    const x = i * 100;
                    const y = 180 - (p.price / 100) * 80;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="6" fill="#10b981" />
                        <circle
                          cx={x}
                          cy={y}
                          r="10"
                          fill="#10b981"
                          opacity="0.3"
                          className="animate-ping"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Label */}
                <div className="flex justify-between mt-2">
                  {dynamicGraphPoints.map((p, i) => (
                    <div key={i} className="text-green-600 text-center">
                      <div className="flex flex-col items-center">
                        <span>{p.month}</span>
                        <span className="text-green-800">₹{p.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ========================== PREDICTED PRICE =========================== */}
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 border-2 border-green-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600">Predicted Price</p>
                    <p className="text-green-800">
                      ₹{history.length ? history[history.length - 1].price + 150 : 0}/quintal
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* ====================== BEST SELL DATE PANEL ====================== */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-6 shadow-lg border-2 border-orange-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-orange-600" />
                    <h3 className="text-green-800">Best Selling Date</h3>
                  </div>

                  <div className="bg-white/80 rounded-2xl p-6 space-y-4">
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full shadow-lg">
                        <Calendar className="w-5 h-5" />
                        <span>
                          {history.length ? "Next 5–7 days" : "—"}
                        </span>
                      </div>
                      <p className="text-green-700">
                        Based on rising modal price trend
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <p className="text-green-600">Expected Price</p>
                        <p className="text-green-800">
                          ₹{history.length ? history[history.length - 1].price : 0}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <p className="text-green-600">Trend</p>
                        <p className="text-green-800">{trend}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                  Set Price Alert
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-green-200">
                  <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-green-600">Current MSP</p>
                  <p className="text-green-800">₹2,125</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-green-200">
                  <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-green-600">Market High</p>
                  <p className="text-green-800">
                    ₹{history.length ? Math.max(...history.map((x) => x.price)) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* LIVE MANDI PRICES */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-green-200">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-6 h-6 text-green-600" />
              <h3 className="text-green-800">Live Mandi Prices</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {markets.map((m, index) => (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200 hover:shadow-lg transition-shadow"
                >
                  <div className="absolute top-2 right-2 opacity-20">
                    <Sprout className="w-8 h-8 text-green-600" />
                  </div>

                  <div className="relative space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-green-800">{m.market}</p>
                        <p className="text-green-600">{m.district}</p>
                      </div>
                    </div>

                    <div className="bg-white/60 rounded-xl p-3">
                      <p className="text-green-600">Modal Price</p>
                      <p className="text-green-800">₹{m.modal_price}/qtl</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-3xl p-6 shadow-lg border-2 border-amber-300">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
              <h3 className="text-green-800">Market Insights</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/60 rounded-xl p-4 space-y-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-green-800">Rising Demand</p>
                <p className="text-green-600">Export orders increasing for {commodity}</p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 space-y-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-green-800">Seasonal Trend</p>
                <p className="text-green-600">Prices often peak during harvest season</p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 space-y-2">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-green-800">Regional Demand</p>
                <p className="text-green-600">{state} shows strong buyer interest</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}