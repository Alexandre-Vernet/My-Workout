# My-Workout

<a href="http://my-workout.alexandre-vernet.fr/" target="_blank" rel="noreferrer">
<img alt="my-workout logo" src="https://raw.githubusercontent.com/Alexandre-Vernet/My-Workout/refs/heads/main/apps/app/public/favicon.ico" width="45">
</a>


## 🌍 Language / Langue

[🇺🇸 English](README.md) | [🇫🇷 Français](README.fr.md)


## Introduction

My-Workout is a tracking app for weightlifters. It allows you to record and track progress across a series of exercises. You can log the number of repetitions, sets, and the weight used. These sessions can be viewed from a calendar or from the history page.

You can define a workout program by choosing your exercises from a library and arranging your session by selecting the order of your exercises.

## Features

- Exercise library with description and movement animation  
- Exercise selection for each muscle group from those available in the library  
- Workout tracking calendar  
- Session logging with number of sets, reps, and weight used for each exercise  
- Built-in timer for rest periods  
- Workout suggestions  
- Workout history  
- App customization with theme selection + dark mode  
- Authentication  

### Library

The app includes around 100 exercises in the library. Each of these exercises can be added to a workout and will be displayed during your training sessions so you can log your progress.

![library preview](https://github.com/user-attachments/assets/b1443344-93dd-48a4-b05e-7baafbf730bc)

Choose a muscle group to add/remove exercises.  

![biceps muscle group](https://github.com/user-attachments/assets/130a583b-52ed-4da1-b0f7-4868253ef3ed)

Filters are available for each muscle group to target a specific portion of a muscle.  

Clicking the favorite button adds the exercise to your session. You can also change the order of the exercises to start with one before another.  

Clicking on the name of a muscle redirects the user to the selected muscle page to display details about its anatomy.  

![muscle-structure](https://github.com/user-attachments/assets/76d2103a-db7d-4165-b3b3-cbc6ee3b383e)

### Exercise Detail

You can click on an exercise to display its description as well as an animation of the movement.  

At the bottom of the page, you will again have the option to add/remove this exercise to/from your session.  

![exercise detail](https://github.com/user-attachments/assets/a4bc38a8-e577-4638-8db9-b23d05be31fd)

### Calendar

The calendar lists all completed sessions. You can filter by muscle group to display only that group. By clicking on a session, you can view its details.  

Swipe left/right to change months.  

![calendar](https://github.com/user-attachments/assets/c0341896-a0ec-4d24-b58a-2cc528455d22)

Click on a day to add a cardio session.  

![add cardio session](https://github.com/user-attachments/assets/bd988a3b-8cd7-4647-a76a-0c44578b4313)

## Log a Session

This part of the app concerns session logging. It is the key feature of the application.  

#### 1. Select a Workout
Here you can choose a muscle group to train and start a session.  

The app recommends the oldest session performed.  

![choose workout](https://github.com/user-attachments/assets/5f4f42f9-c34e-4a45-a86a-e4a6840eb777)

#### 2. Overview

At the top of the screen, you will see the exercises to be performed during the chosen session (sorted according to your preference set in the library). In our example, we have 4 exercises. You can click on one of the numbers to switch exercises or swipe left/right.  

Increase/decrease the weight used via the + or - buttons or by entering a number in the field. Same principle for repetitions.  

For the weight to use, the field is pre-filled with the highest weight used during the last session (here bicep curls).  

![workout overview](https://github.com/user-attachments/assets/b9da1985-b1d9-49fd-a48c-ff03e4dbf550)

#### 3. Timer
Once your set is complete, click on the timer icon to start it. Once started, a table will appear showing:

- Set number  
- Weight used  
- Number of repetitions  
- Rest time (empty until the timer is stopped)  
- A trash icon to delete the log  

You can edit an entry by clicking on the weight or number of repetitions.  

Pressing the timer again stops it, adds the rest time to the table, and lets you start a new set. Repeat this process until you want to switch to another exercise.  

If the app is closed or the page is changed, the data is saved (except rest time) and will be displayed again.  

![timer](https://github.com/user-attachments/assets/34a9711b-3ec0-4e9a-8398-48d16a17ae7f)

#### 4. End of Session
Once the session is complete, you can view it from the calendar or the history page.  

### History

The history section details each completed session with the number of sets, reps, and weight lifted.  

You can delete a session by clicking on the trash icon.  

![history](https://github.com/user-attachments/assets/08cb0d38-c02b-49b5-a07c-c861eef50166)

### My Account

The My Account section allows you to update user information: email / password.  

You can also change the theme from the 17 available and enable/disable dark mode.  

![my account](https://github.com/user-attachments/assets/f1993160-2e83-4f19-9730-e50cd608ca74)

### Statistics

The statistics section displays a list of exercises the user has performed. By clicking on one of these exercises, you can view your progression with the weight used in past workouts and when you increased that weight.  

![statistics](https://github.com/user-attachments/assets/ff03a702-6839-4b46-a19f-fc9df56be431)

### Authentication

The app provides authentication to save your data. You can log in with an existing account or create a new one.  
Your data will be saved in a database and you can access it from any device.  

#### 1. Login Page

Log in with your email and password. If you don’t have an account, you can create one by clicking the "Not registered yet?" link.  

![login page](https://github.com/user-attachments/assets/8bb3f0ca-6eb8-444b-bc4a-38a5f8afefe5)

#### 2. Registration Page
Create an account by filling in the form with your email and password.  

![registration page](https://github.com/user-attachments/assets/349e1fde-11e8-496b-8781-ec3709a3dc97)

#### 3. Forgot Password

Click the "Forgot password?" button to reset your password. An email will be sent to you with a link to reset it.  

![forgot password](https://github.com/user-attachments/assets/8141f960-72b6-4048-b1bc-def09e7bdd7d)

### Accessibility
The app is only available on mobile devices. When accessed from a computer, you will be prompted to download the app on a smartphone.  

![desktop-version](https://github.com/user-attachments/assets/7760b9af-e2a4-46fe-b137-87f6579b6321)
