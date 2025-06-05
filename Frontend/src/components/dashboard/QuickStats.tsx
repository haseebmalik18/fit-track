import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Flame,
  Dumbbell,
  Clock,
  Activity,
} from "lucide-react";

const QuickStats: React.FC = () => {
  // Temporary data
  const stats = [
    {
      title: "Calories Today",
      value: "1,847",
      target: "2,100",
      progress: 88,
      trend: "+45",
      trendUp: true,
      icon: Flame,
      color: "orange",
    },
    {
      title: "Weight",
      value: "68.2 kg",
      target: "65.0 kg",
      progress: 76,
      trend: "-0.3",
      trendUp: false,
      icon: Target,
      color: "blue",
    },
    {
      title: "Workouts This Week",
      value: "4",
      target: "5",
      progress: 80,
      trend: "+1",
      trendUp: true,
      icon: Dumbbell,
      color: "green",
    },
    {
      title: "Recent Activity",
      value: "Breakfast",
      target: "2h ago",
      progress: 75,
      trend: "+3",
      trendUp: true,
      icon: Activity,
      color: "purple",
      isActivity: true,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      orange: "bg-orange-50 text-orange-600 border-orange-200",
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
    };
    return colors[color as keyof typeof colors];
  };

  const getProgressColor = (color: string) => {
    const colors = {
      orange: "bg-orange-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer ${
            stat.isActivity ? "hover:scale-105" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-xl border ${getColorClasses(stat.color)}`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div
              className={`flex items-center text-sm font-medium ${
                stat.trendUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.trendUp ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {stat.trend}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {stat.value}
              </span>
              <span className="text-sm text-gray-500">
                {stat.isActivity ? stat.target : `/ ${stat.target}`}
              </span>
            </div>

            {stat.isActivity ? (
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>3 actions today</span>
              </div>
            ) : (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(
                      stat.color
                    )} transition-all duration-300`}
                    style={{ width: `${Math.min(stat.progress, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {stat.progress}% of goal
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
