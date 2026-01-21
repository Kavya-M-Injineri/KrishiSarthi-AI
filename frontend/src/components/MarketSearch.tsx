import React, { useEffect, useState } from 'react';

type MetaShape = {
  states: string[];
  districts: Record<string, string[]>;
  markets: Record<string, string[]>;
  commodities: string[];
};

type Props = {
  onSearch: (commodity: string, state: string, district: string) => void;
  initial?: { commodity?: string; state?: string; district?: string };
};

export default function MarketSearch({ onSearch, initial }: Props) {
  const [meta, setMeta] = useState<MetaShape | null>(null);
  const [commodity, setCommodity] = useState(initial?.commodity ?? '');
  const [state, setState] = useState(initial?.state ?? '');
  const [district, setDistrict] = useState(initial?.district ?? '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch('http://localhost:5000/market/meta');
        if (!res.ok) throw new Error('meta fetch failed');
        const j = await res.json();

        // 🛠 FIX: Ensure objects exist
        j.states = j.states || [];
        j.districts = j.districts || {};
        j.commodities = j.commodities || [];

        // 🛠 FIX: Normalize keys (capitalize, match UI)
        const normalized: Record<string, string[]> = {};
        Object.keys(j.districts).forEach((k) => {
          normalized[k.trim().toLowerCase()] = j.districts[k];
        });
        j.districts = normalized;

        setMeta(j);
        setLoading(false);

        if (initial?.state && initial?.district) {
          const key = initial.state.toLowerCase();
          if (j.districts[key]) {
            setDistrict(initial.district);
          }
        }
      } catch (e: any) {
        console.warn(e);
        setError('Unable to load market lists');
        setLoading(false);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    // clear district when state changes
    setDistrict('');
  }, [state]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch(commodity.trim(), state.trim(), district.trim());
  };

  // 🛠 FIX: Safe lookup for districts
  const districtList =
    meta && state
      ? meta.districts[state.toLowerCase()] || []
      : [];

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col md:flex-row gap-3 items-center"
    >
      <div className="flex-1">
        <label className="text-sm text-green-700">Commodity</label>
        {loading ? (
          <input
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            placeholder="Type or choose commodity"
            className="w-full rounded-lg p-2 border"
          />
        ) : (
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full rounded-lg p-2 border bg-white"
          >
            <option value="">— Choose commodity —</option>
            {meta?.commodities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="w-64">
        <label className="text-sm text-green-700">State</label>
        {loading ? (
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Type state"
            className="w-full rounded-lg p-2 border"
          />
        ) : (
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-lg p-2 border bg-white"
          >
            <option value="">— Choose state —</option>
            {meta?.states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="w-64">
        <label className="text-sm text-green-700">District / Mandi</label>
        {loading ? (
          <input
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="Type district"
            className="w-full rounded-lg p-2 border"
          />
        ) : (
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full rounded-lg p-2 border bg-white"
          >
            <option value="">— (optional) —</option>

            {/* 🛠 FIX: Never crashes even if undefined */}
            {districtList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex-none mt-2 md:mt-6">
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg"
        >
          Search
        </button>
      </div>

      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}