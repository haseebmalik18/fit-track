package com.fit_track.dto.request;

import com.fit_track.entity.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class OnboardingRequest {

    @NotNull
    private User.Goal goal;

    @NotNull
    private User.ActivityLevel activityLevel;

    @NotNull
    @Positive
    private Double currentWeight;

    private Double targetWeight;

    @NotNull
    @Min(100)
    @Max(250)
    private Integer height;

    @NotNull
    @Min(13)
    @Max(120)
    private Integer age;

    @NotNull
    private User.Gender gender;

    public OnboardingRequest() {}

    public User.Goal getGoal() {
        return goal;
    }

    public void setGoal(User.Goal goal) {
        this.goal = goal;
    }

    public User.ActivityLevel getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(User.ActivityLevel activityLevel) {
        this.activityLevel = activityLevel;
    }

    public Double getCurrentWeight() {
        return currentWeight;
    }

    public void setCurrentWeight(Double currentWeight) {
        this.currentWeight = currentWeight;
    }

    public Double getTargetWeight() {
        return targetWeight;
    }

    public void setTargetWeight(Double targetWeight) {
        this.targetWeight = targetWeight;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public User.Gender getGender() {
        return gender;
    }

    public void setGender(User.Gender gender) {
        this.gender = gender;
    }
}
