package com.avernet.my_workout_api;

import org.springframework.boot.SpringApplication;

public class TestMyWorkoutApiApplication {

	public static void main(String[] args) {
		SpringApplication.from(MyWorkoutApiApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
