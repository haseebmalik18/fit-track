import React from "react";

const CalorieChart: React.FC = () => {
  // Temporary data
  const weekData = [
    { day: "Mon", calories: 2050, target: 2100 },
    { day: "Tue", calories: 1980, target: 2100 },
    { day: "Wed", calories: 2150, target: 2100 },
    { day: "Thu", calories: 1920, target: 2100 },
    { day: "Fri", calories: 2080, target: 2100 },
    { day: "Sat", calories: 2200, target: 2100 },
    { day: "Sun", calories: 1847, target: 2100 },
  ];

  const maxCalories =
    Math.max(...weekData.map((d) => Math.max(d.calories, d.target))) + 200;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Weekly Calories</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Consumed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-gray-600">Target</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end space-x-4">
        {weekData.map((day, index) => {
          const consumedHeight = (day.calories / maxCalories) * 100;
          const targetHeight = (day.target / maxCalories) * 100;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center space-y-2"
            >
              <div className="w-full h-48 relative flex items-end justify-center space-x-1">
                <div
                  className="w-6 bg-gray-200 rounded-t-md relative"
                  style={{ height: `${targetHeight}%` }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                    {day.target}
                  </div>
                </div>

                <div
                  className={`w-6 rounded-t-md relative ${
                    day.calories >= day.target ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ height: `${consumedHeight}%` }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-900 whitespace-nowrap">
                    {day.calories}
                  </div>
                </div>
              </div>

              <div className="text-sm font-medium text-gray-600">{day.day}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">14,227</div>
            <div className="text-xs text-gray-500">Total Calories</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">2,032</div>
            <div className="text-xs text-gray-500">Daily Average</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">96.8%</div>
            <div className="text-xs text-gray-500">Goal Achievement</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieChart;
