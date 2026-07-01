import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import AppShell from "./pages/AppShell.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { ProgramsList, ProgramDetail } from "./pages/Programs.tsx";
import Workout from "./pages/Workout.tsx";
import Nutrition from "./pages/Nutrition.tsx";
import Progress from "./pages/Progress.tsx";
import Tools from "./pages/Tools.tsx";
import Coach from "./pages/Coach.tsx";
import { store } from "./data/store.ts";

function AppGuard() {
  const profile = store.getProfile();
  if (!profile.onboarded) return <Navigate to="/onboarding" replace />;
  return <AppShell />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/app" element={<AppGuard />}>
          <Route index element={<Dashboard />} />
          <Route path="programs" element={<ProgramsList />} />
          <Route path="programs/:id" element={<ProgramDetail />} />
          <Route path="workout" element={<Workout />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="progress" element={<Progress />} />
          <Route path="tools" element={<Tools />} />
          <Route path="coach" element={<Coach />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
