import React, { useEffect, useState, lazy, Suspense } from "react";
import { Truck, Sparkles } from "lucide-react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";

const FleetOverview = lazy(() => import("./pages/FleetOverview"));
const FleetPage = lazy(() => import("./pages/FleetPage"));
const ServiceEntry = lazy(() => import("./pages/ServiceEntry"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const PartsPage = lazy(() => import("./pages/PartsPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[500px]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 dark:text-slate-300 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [targetVehicleId, setTargetVehicleId] = useState(null);
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(
    localStorage.getItem("company") || "FleetOps"
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogin = (company) => {
    setIsLoggedIn(true);

    localStorage.setItem("isLoggedIn", "true");

    if (company) {
      setSelectedCompany(company);
      localStorage.setItem("company", company);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div
      className={`min-h-screen flex flex-col overflow-hidden antialiased ${
        theme === "dark"
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      <Navbar
        companyName={selectedCompany}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
        setTheme={setTheme}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setIsLoggedIn={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <Suspense fallback={<PageLoader />}>
              {currentPage === "Dashboard" && (
                <FleetOverview
                  companyName={selectedCompany}
                  navigateToService={() => setCurrentPage("Service Entry")}
                  navigateToReports={() => setCurrentPage("Reports")}
                />
              )}

              {currentPage === "Parts" && (
                <PartsPage
                  onVehicleClick={(vehicleName) => {
                    setTargetVehicleId(vehicleName);
                    setCurrentPage("Fleet");
                  }}
                />
              )}

              {currentPage === "Service Entry" && <ServiceEntry />}

              {currentPage === "Reports" && <ReportsPage />}

              {currentPage === "Fleet" && (
                <FleetPage
                  initialVehicleId={targetVehicleId}
                  onClearSelection={() => setTargetVehicleId(null)}
                />
              )}
            </Suspense>
          </div>

          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-1 rounded">
                <Truck className="h-4 w-4" />
              </div>

              <span className="font-bold">
                {selectedCompany}
                <span className="text-blue-600 ml-1">Pro</span>
              </span>

              <span className="hidden md:block text-xs text-slate-400">
                © {new Date().getFullYear()} All Rights Reserved
              </span>
            </div>

            <nav className="hidden lg:flex gap-5 text-xs uppercase">
              {["Dashboard", "Fleet", "Reports"].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="hover:text-blue-600 transition"
                >
                  {page}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Powered by
              </span>

              <div className="flex items-center gap-1 bg-blue-50 dark:bg-slate-800 px-3 py-1 rounded-lg">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-600">
                  Careergize
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}