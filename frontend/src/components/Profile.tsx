import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, MapPin, Phone, Mail, Sprout, TreeDeciduous, Leaf } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function Profile() {
  // -------------------------------
  // STATE (must be inside component)
  // -------------------------------
  const [farmer, setFarmer] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "" });

  // -------------------------------
  // LOAD PROFILE USING farmer_id
  // -------------------------------
  useEffect(() => {
    const id = localStorage.getItem("farmer_id");
    if (!id) return;

    fetch(`http://localhost:5000/farmer/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFarmer(data);
        setForm({
          name: data.name,
          email: data.email,
          phone: data.phone,
          location: data.location,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Bright Artistic Header */}
      <motion.div
        className="relative rounded-3xl overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Light Background */}
        <div className="relative h-64">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/60 via-blue-100/60 to-emerald-100/60" />

          <ImageWithFallback
            src="https://images.unsplash.com/photo-1693587281791-2146786dc066?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
            alt="Wheat Field"
            className="w-full h-full object-cover opacity-70"
            style={{ filter: "brightness(1.15) saturate(1.1)" }}
          />

          <div className="absolute inset-0 bg-gradient-to-br from-green-300/30 via-blue-200/20 to-emerald-300/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />

          {/* Header Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
            <div className="inline-flex items-center gap-3 mb-2 bg-white/70 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
              <User className="text-green-600 w-10 h-10" />
              <h1 className="text-green-800">Farmer Profile</h1>
              <Sprout className="text-emerald-500 w-10 h-10" />
            </div>
            <p className="text-green-800 bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full mt-3">
              Manage your farming profile and preferences
            </p>
          </div>

          {/* Floating Leaves */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0 }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 180, 360],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
              style={{
                left: `${15 + i * 17}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
            >
              <Leaf className="text-green-400 w-6 h-6" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-4 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-8 relative overflow-hidden">
          <div className="relative space-y-8">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center ring-4 ring-green-200">
                <User className="text-white w-16 h-16" />
              </div>
              <div className="text-center">
                <h2 className="text-green-900">{farmer?.name || "Loading..."}</h2>
                <p className="text-green-700">Farmer ID: {localStorage.getItem("farmer_id")}</p>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-green-800">
                  <User className="w-5 h-5" />
                  Full Name
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border-green-300 focus:border-green-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-green-800">
                  <Mail className="w-5 h-5" />
                  Email
                </label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="border-green-300 focus:border-green-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-green-800">
                  <Phone className="w-5 h-5" />
                  Phone
                </label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="border-green-300 focus:border-green-500"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-green-800">
                  <MapPin className="w-5 h-5" />
                  Location
                </label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="border-green-300 focus:border-green-500"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={async () => {
                  const id = localStorage.getItem("farmer_id");
                  await fetch(`http://localhost:5000/farmer/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                  });

                  alert("Profile updated successfully!");
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-6"
              >
                <Sprout className="w-5 h-5 mr-2" />
                Save Profile
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}