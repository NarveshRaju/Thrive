import React from "react";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import { Footer } from "../components/layout/Footer";
import CareerPersonaLab from "../features/persona/CareerPersonaLab";

const CareerPersona = () => {
  return (
    <div className="bg-[#030303] text-white min-h-screen font-sans antialiased">
      <DashboardNavbar />
      <main className="pt-16 pb-10 px-4 md:px-8 max-w-6xl mx-auto">
        <CareerPersonaLab />
      </main>
    </div>
  );
};

export default CareerPersona;
