import React from "react";
import { Calendar, TrendingUp, Clock, Target } from "lucide-react";

const WorkoutProgress: React.FC = () => {
  // Temporary data
  const recentWorkouts = [
    {
      date: "2024-01-15",
      type: "Upper Body",
      duration: 45,
      exercises: 6,
      pr: true,
    },
    {
      date: "2024-01-13",
      type: "Lower Body",
      duration: 50,
      exercises: 5,
      pr: false,
    },
    {
      date: "2024-01-11",
      type: "Cardio",
      duration: 30,
      exercises: 3,
      pr: false,
    },
    {
      date: "2024-01-09",
      type: "Full Body",
      duration: 60,
      exercises: 8,
      pr: true,
    },
  ];

  const stats = [
    { label: "This Week", value: "4 workouts", icon: Calendar },
    { label: "Total Time", value: "3h 45m", icon: Clock },
    { label: "Personal Records", value: "2 PRs", icon: Target },
    { label: "Consistency", value: "87%", icon: TrendingUp },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Workout Progress
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Start Workout
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <stat.icon className="h-5 w-5 text-gray-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">
              {stat.value}
            </div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-600 mb-3">
          Recent Workouts
        </h3>
        {recentWorkouts.map((workout, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 flex items-center space-x-2">
                  <span>{workout.type}</span>
                  {workout.pr && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      PR!
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(workout.date).toLocaleDateString()} •{" "}
                  {workout.exercises} exercises
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {workout.duration}m
              </div>
              <div className="text-xs text-gray-500">duration</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutProgress;
