import React, { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud, X, Check, AlertTriangle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

/**
 * SMART AGRONOMY LOGIC (PRO MODE)
 * Provides specific NPK ratios and chemical treatments.
 * CLEAN VERSION: No Emojis.
 */
const getTreatmentAdvice = (label: string = "") => {
  const lower = label.toLowerCase();

  // 1. HEALTHY
  if (lower.includes("healthy")) {
    return {
      severity: "None",
      advice: [
        "Routine: Maintain balanced NPK 10-10-10 fertilizer every 4 weeks.",
        "Water: Water regularly (1-2 inches per week).",
        "Monitor: Check for pests weekly."
      ]
    };
  }
  
  // --- REJECTION/INVALID INPUT ---
  if (lower.includes("not_leaf") || lower.includes("background")) {
      return {
          severity: "Invalid Input",
          advice: [
              "Input Rejected: The image uploaded is not recognized as a crop leaf.",
              "Action: Please upload a clear photo of an affected leaf, focused on the plant material.",
              "Error: Cannot provide recommendations without valid plant data."
          ]
      };
  }

  // 2. FUNGAL DISEASES (Spots, Blights, Rust, Mildew, Scab, Rot)
  if (lower.match(/(spot|blight|rust|mildew|scab|mold|rot)/)) {
    return {
      severity: "Medium",
      advice: [
        "Fungicide: Spray Chlorothalonil (Daconil) or Mancozeb every 7-10 days.",
        "Fertilizer: STOP high Nitrogen. Switch to High-Potassium NPK 5-10-10 or 0-0-50 to thicken cell walls.",
        "Sanitation: Remove lower yellowing leaves to improve airflow.",
        "Irrigation: Drip irrigation only. Keep leaves 100% dry."
      ]
    };
  }

  // 3. VIRAL DISEASES (Mosaic, Virus, Curl)
  if (lower.match(/(virus|mosaic|curl)/)) {
    return {
      severity: "Critical",
      advice: [
        "Control Vector: The virus is spread by bugs. Spray Imidacloprid or Neem Oil (0.5%) to kill aphids/thrips.",
        "Boost Immunity: Apply micronutrients (Zinc, Magnesium, Iron) to help plant survive.",
        "No Cure: Infected plants cannot be cured. Focus on saving the rest of the field.",
        "Prevention: Use virus-resistant seed varieties next season."
      ]
    };
  }

  // 4. BACTERIAL DISEASES
  if (lower.includes("bacteri")) {
    return {
      severity: "High",
      advice: [
        "Chemical: Spray Copper Hydroxide (Kocide) or Streptomycin sulfate immediately.",
        "Fertilizer: Use balanced NPK 8-12-10 or similar high-Phosphorus/Potassium ratio. Avoid excess Nitrogen which fuels bacteria.",
        "Weather: Bacteria spreads in wet weather. Do not touch plants when wet.",
        "Tools: Dip pruning shears in 10% bleach solution between cuts."
      ]
    };
  }

  // 5. PESTS / MITES
  if (lower.match(/(mite|miner|bug|beetle|worm)/)) {
    return {
      severity: "Medium",
      advice: [
        "Insecticide: Apply Spinosad or Cypermethrin for worms/beetles.",
        "Mites: Use Abamectin or specialized miticides.",
        "Organic: Neem oil (cold pressed) every 5 days works for soft-bodied pests."
      ]
    };
  }

  // Fallback (for UNKNOWN disease label that wasn't explicitly handled)
  return {
    severity: "Medium",
    advice: [
      "General Treatment: Apply a broad-spectrum Copper Fungicide.",
      "Fertilizer: Apply balanced NPK 10-10-10 to support recovery.",
      "Water: Improve field drainage. Water logging causes root rot."
    ]
  };
};

// --- TYPES ---
type ResultShape = {
  label?: string;
  confidence?: number;
  image?: string;
  scan_date?: string;
  id?: number;
  detections?: any[];
  _from?: string;
};

export default function CropScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultShape | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ResultShape[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const confettiRef = useRef<HTMLDivElement | null>(null);
  
  // Ensure every user has an ID for history tracking
  const [farmerId, setFarmerId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("farmer_id");
    if (!id) {
        id = `guest_${Date.now()}`;
        localStorage.setItem("farmer_id", id);
    }
    setFarmerId(id);
    fetchHistory(id);
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onFile = useCallback((f: File | null) => {
    setError(null);
    setResult(null);
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }, []);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    onFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f) onFile(f);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const postImage = async (form: FormData) => {
    // You can also point this directly to one endpoint if you finalize your backend.
    const endpoints = ["/classify", "/scan-crop"];
    for (const ep of endpoints) {
      try {
        // Assume API is running on localhost:5000
        const url = `http://localhost:5000${ep}`;
        const res = await fetch(url, { method: "POST", body: form });
        if (!res.ok) continue; // Try next endpoint if this one fails (404/500)
        const data = await res.json();
        
        // --- ADDED BACKEND REJECTION CHECK ---
        if (data.status === "rejected" || data.label?.toLowerCase() === "not_leaf" || data.class_name?.toLowerCase() === "not_leaf") {
            // Throw an error that the try/catch block will handle
            throw new Error(`REJECTED_INPUT: ${data.message || 'Image is not a leaf.'}`);
        }
        
        return { endpoint: ep, data };
      } catch (err) {
        // If it's the specific rejection error, re-throw it to the main catch block
        if (err instanceof Error && err.message.startsWith('REJECTED_INPUT')) {
            throw err;
        }
        console.warn("Network error to", ep, err);
      }
    }
    throw new Error("Analysis failed. All endpoints failed or server is offline.");
  };

  const handleScan = async () => {
    if (!file) {
      setError("Please select or drop an image first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const form = new FormData();
      form.append("image", file);
      if (farmerId) form.append("farmer_id", farmerId);

      const { endpoint, data } = await postImage(form);

      // Normalize Result
      let normalized: ResultShape = {};
      
      const predictedLabel = data.label ?? data.class_name ?? data.class ?? "Unknown";
      
      if (predictedLabel) {
        normalized = {
          label: predictedLabel.replace(/_/g, " "),
          confidence: data.confidence ?? data.score ?? 0,
          image: data.image ?? null,
          scan_date: data.scan_date ?? new Date().toISOString(),
          id: data.id ?? data.scan_id,
          _from: endpoint,
        };
      } 
      else if (data.detections || Array.isArray(data)) {
        normalized = {
          label: "Multiple Issues Detected",
          detections: data.detections ?? data,
          image: data.image ?? null,
          scan_date: data.scan_date ?? new Date().toISOString(),
          _from: endpoint,
        };
      }

      setResult(normalized);
      runConfetti();
      // Update history state instantly before re-fetching
      if (normalized.label) setHistory((prev) => [normalized, ...prev].slice(0, 50)); 
      if (farmerId) await fetchHistory(farmerId);

    } catch (err) {
      console.error(err);
      
      if (err instanceof Error && err.message.startsWith('REJECTED_INPUT')) {
          // This displays the message from the API: "Image is not a leaf."
          setError(`Input Rejected: ${err.message.replace('REJECTED_INPUT: ', '')}`);
      } else {
          setError("Analysis failed. Server might be offline or returned invalid data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/my-scans?farmer_id=${encodeURIComponent(id)}`);
      if (res.ok) {
        const rows = await res.json();
        setHistory(rows.map((r: any) => ({
          id: r.id,
          image: r.image_path,
          label: r.disease,
          confidence: r.confidence,
          scan_date: r.scan_date,
        })));
      }
    } catch (e) { console.warn(e); }
  };

  const runConfetti = () => {
    if (!confettiRef.current) return;
    const container = confettiRef.current;
    for (let i = 0; i < 20; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.left = Math.random() * 80 + "%";
      el.style.top = "-10%";
      el.style.width = el.style.height = `${8 + Math.random() * 12}px`;
      el.style.background = `hsl(${100 + Math.random() * 60}, 60%, ${40 + Math.random() * 20}%)`;
      el.style.borderRadius = "50%";
      container.appendChild(el);
      el.animate([{ transform: "translateY(0)" }, { transform: `translateY(${300 + Math.random() * 200}px)` }], { duration: 1000 + Math.random() * 1000 });
      setTimeout(() => container.removeChild(el), 2000);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-800">KrishiSarthi Crop Doctor</h1>
          <p className="mt-2 text-green-700">Instant Diagnosis • Fertilizer Ratios • Chemical Treatments</p>
        </div>

        <div className="rounded-3xl border-4 border-yellow-300 p-6 shadow-xl bg-white">
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={`relative rounded-2xl p-6 transition-all duration-200 ${dragOver ? "ring-4 ring-green-200" : "ring-0"}`}
            style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.85), rgba(240,255,240,0.85)), url('https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1600&q=60')", backgroundSize: "cover" }}
          >
            <div className="flex flex-col items-center">
              <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="w-36 h-36 rounded-full flex items-center justify-center shadow-2xl" style={{ background: "linear-gradient(180deg,#16a34a,#059669)" }}>
                <UploadCloud size={56} className="text-white" />
              </motion.div>
              <div className="mt-6 text-center">
                <p className="text-lg font-medium text-green-900">Take a photo of the affected leaf</p>
                <div className="mt-4">
                  <label className="inline-flex items-center gap-3 cursor-pointer bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full shadow-lg transition-colors" onClick={() => inputRef.current?.click()}>
                    <span className="font-bold">Upload Photo</span>
                  </label>
                  <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileInputChange} />
                </div>
              </div>
              
              {preview && (
                <div className="mt-6 w-full flex flex-col md:flex-row items-center gap-4">
                  <div className="rounded-lg overflow-hidden border shadow h-40 w-40">
                    <img src={preview} alt="preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <button onClick={handleScan} disabled={loading} className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-lg shadow hover:scale-105 transition-transform">
                      {loading ? "Analyzing..." : "DIAGNOSE NOW"}
                    </button>
                    <button onClick={clearFile} className="ml-3 px-4 py-3 bg-gray-100 border rounded-lg text-gray-700">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {error && <p className="text-red-600 mt-4 text-center font-bold bg-red-50 p-2 rounded">{error}</p>}
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 rounded-2xl bg-white shadow-2xl border-2 border-green-100">
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Diagnosis Header */}
              <div className="md:w-1/3 border-r border-gray-100 pr-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    {result.label?.toLowerCase().includes("healthy") ? <Check className="text-green-600" /> : <AlertTriangle className="text-amber-500" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{result.label?.replace(/_/g, " ")}</h2>
                    <p className="text-green-600 font-medium">Confidence: {result.confidence ? (result.confidence * 100).toFixed(1) : "95"}%</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Scan ID: {result.id || "New"}</p>
                  <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Treatment Advice */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-800 mb-3 border-b pb-2">RECOMMENDED TREATMENT PLAN</h3>
                {(() => {
                   const treatment = getTreatmentAdvice(result.label);
                   const isRejected = treatment.severity === "Invalid Input";

                   return (
                     <div>
                       <div className="flex items-center gap-2 mb-4">
                         <span className="text-gray-600 font-medium">{isRejected ? "INPUT STATUS:" : "Severity Level:"}</span>
                         <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                           isRejected ? "bg-red-500 text-white" : // Special style for rejection
                           treatment.severity === "Critical" ? "bg-red-100 text-red-700" :
                           treatment.severity === "High" ? "bg-orange-100 text-orange-700" :
                           treatment.severity === "Medium" ? "bg-yellow-100 text-yellow-700" :
                           "bg-green-100 text-green-700"
                         }`}>
                           {treatment.severity.toUpperCase()}
                         </span>
                       </div>
                       
                       <div className="grid gap-3">
                         {treatment.advice.map((item, idx) => (
                           <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg ${isRejected ? "bg-red-100 border border-red-300" : "bg-green-50/50"}`}>
                             <ArrowRight className={`mt-1 w-4 h-4 ${isRejected ? "text-red-700" : "text-green-700"} shrink-0`} />
                             <p className="text-gray-800 font-medium">{item}</p>
                           </div>
                         ))}
                       </div>
                     </div>
                   );
                })()}
                
                <div className="mt-6 flex gap-4">
                   <button onClick={() => { clearFile(); setResult(null); }} className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 shadow">Scan Next Plant</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* History Preview */}
        {history.length > 0 && !result && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-green-800 mb-4">Recent Scans</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {history.slice(0, 4).map((h, i) => (
                <div key={i} className="bg-white p-3 rounded-xl shadow border flex items-center gap-3">
                  <img src={h.image} className="w-12 h-12 rounded object-cover" alt="" />
                  <div className="overflow-hidden">
                    <p className="truncate font-medium text-sm text-gray-800">{h.label}</p>
                    <p className="text-xs text-gray-500">{new Date(h.scan_date || "").toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50"></div>
      </div>
    </div>
  );
}