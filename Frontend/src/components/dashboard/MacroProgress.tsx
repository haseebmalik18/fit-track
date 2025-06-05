import React from "react";

const MacroProgress: React.FC = () => {
  // Temporary data
  const macros = [
    {
      name: "Protein",
      current: 87,
      target: 120,
      unit: "g",
      color: "bg-red-500",
      bgColor: "bg-red-50",
    },
    {
      name: "Carbs",
      current: 185,
      target: 220,
      unit: "g",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      name: "Fat",
      current: 52,
      target: 70,
      unit: "g",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
    },
  ];

  const calories = {
    current: 1847,
    target: 2100,
    remaining: 253,
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Today's Nutrition
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Log Food
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Calories</span>
          <span className="text-sm text-gray-500">
            {calories.current} / {calories.target}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                (calories.current / calories.target) * 100,
                100
              )}%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{calories.remaining} remaining</span>
          <span>{Math.round((calories.current / calories.target) * 100)}%</span>
        </div>
      </div>

      <div className="space-y-6">
        {macros.map((macro, index) => {
          const percentage = Math.min(
            (macro.current / macro.target) * 100,
            100
          );

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {macro.name}
                </span>
                <span className="text-sm text-gray-500">
                  {macro.current}
                  {macro.unit} / {macro.target}
                  {macro.unit}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${macro.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {macro.target - macro.current}
                  {macro.unit} remaining
                </span>
                <span>{Math.round(percentage)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">72%</div>
            <div className="text-xs text-gray-500">Protein Goal</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">84%</div>
            <div className="text-xs text-gray-500">Carb Goal</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">74%</div>
            <div className="text-xs text-gray-500">Fat Goal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacroProgress;
