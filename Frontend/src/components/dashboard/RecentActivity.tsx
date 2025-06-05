import React from "react";
import { Clock, Utensils, Dumbbell, Award, TrendingUp } from "lucide-react";

const RecentActivity: React.FC = () => {
  // Temporary data
  const activities = [
    {
      type: "food",
      icon: Utensils,
      title: "Logged breakfast",
      description: "Oatmeal with berries",
      time: "2 hours ago",
      calories: "+420 cal",
    },
    {
      type: "workout",
      icon: Dumbbell,
      title: "Completed workout",
      description: "Upper body strength training",
      time: "1 day ago",
      calories: "-280 cal",
    },
    {
      type: "achievement",
      icon: Award,
      title: "New personal record!",
      description: "Bench press: 80kg",
      time: "1 day ago",
      calories: null,
    },
    {
      type: "progress",
      icon: TrendingUp,
      title: "Weight update",
      description: "Lost 0.3kg this week",
      time: "2 days ago",
      calories: null,
    },
    {
      type: "food",
      icon: Utensils,
      title: "Logged dinner",
      description: "Grilled chicken salad",
      time: "2 days ago",
      calories: "+380 cal",
    },
  ];

  const getActivityColor = (type: string) => {
    const colors = {
      food: "bg-orange-100 text-orange-600",
      workout: "bg-green-100 text-green-600",
      achievement: "bg-yellow-100 text-yellow-600",
      progress: "bg-blue-100 text-blue-600",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}
            >
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                {activity.calories && (
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      activity.calories.startsWith("+")
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {activity.calories}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {activity.description}
              </p>
              <div className="flex items-center mt-1 text-xs text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">8</div>
            <div className="text-xs text-gray-500">Actions Today</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">47</div>
            <div className="text-xs text-gray-500">This Week</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">94%</div>
            <div className="text-xs text-gray-500">Goal Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
