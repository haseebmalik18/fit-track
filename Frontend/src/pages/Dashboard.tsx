import React from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import QuickStats from "../components/dashboard/Quickstats";
import MacroProgress from "../components/dashboard/MacroProgress";
import QuickActions from "../components/dashboard/QuickActions";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-blue-100 text-sm">
                Ready to crush your fitness goals today?
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Today's Progress</div>
              <div className="text-2xl font-bold">85%</div>
            </div>
          </div>
        </div>

        <QuickStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MacroProgress />
          </div>

          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
