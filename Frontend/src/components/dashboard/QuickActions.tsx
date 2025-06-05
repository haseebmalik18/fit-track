import React from "react";
import { Plus, Utensils, Dumbbell, Camera, Target } from "lucide-react";

const QuickActions: React.FC = () => {
  const actions = [
    {
      name: "Log Food",
      icon: Utensils,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => console.log("Log food"),
    },
    {
      name: "Start Workout",
      icon: Dumbbell,
      color: "bg-green-500 hover:bg-green-600",
      action: () => console.log("Start workout"),
    },
    {
      name: "Take Photo",
      icon: Camera,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => console.log("Take photo"),
    },
    {
      name: "Set Goal",
      icon: Target,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => console.log("Set goal"),
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <Plus className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`${action.color} text-white p-4 rounded-xl transition-colors group hover:scale-105 transform transition-transform`}
          >
            <action.icon className="h-6 w-6 mx-auto mb-2" />
            <div className="text-sm font-medium">{action.name}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              Today's Focus
            </div>
            <div className="text-xs text-gray-600">
              Hit your protein goal: 33g remaining
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
