# Medical Social Network Web Application
This repository contains only the frontend application of the full stack medical social network application. Part of the backend source code belongs to another project as well, therefore I am not licensed to make it public.

### A few words about the project
This application is a medical social network intended to be used by patients and doctors. Users can upload different kinds of posts and like/comment them (in a Facebook-like manner), make connections with others users, book appointments, submit their daily health score and analyze the aggregated results (patients only). For establishing the integrity of the confidential data being exchanged, blockchain technology is used in to verify each transaction. 

Also, there are 3 kinds of connections/relationships:
* Friend Relationship (between patients, two-way) - give access to your timeline
* Circle of Trust (between patients, one-way) - give all rights of your account
* Care Team (between a doctor and a patient, two-way) - patient gives doctor the right to post to his timeline
 
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/relationships.png" width="500" height="300">

### Tech Stack

This technology stack of the project consists of:

* [React] - JavaScript framework for building the UI
* [Redux] - State management library for the frontend application
* [Django] - Python web backend framework
* [PostgreSQL] - Database
* [Iroha Hyperledger] - Blockchain network library 


<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/IMPILO.png" width="600" height="200">



### Getting started
To get the frontend running locally, install dependencies and run:
```sh
$ npm install 
$ npm run start
```
`Note: The application will not function properly without the backend services`

### Screens
##### Login Page
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/Login.png" width="600" height="300">

##### Register Page
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/RegisterPage.png" width="600" height="300">

##### Home Page
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/HomePage.png" width="600" height="300">

##### Notifications
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/Notifications.png" width="600" height="300">

##### Create Post
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/createPost.png" width="600" height="300">

##### Profile Page
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/ProfilePage.png" width="600" height="300">

##### Health Score
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/healthscore.png" width="600" height="300">

##### Health Score Graph
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/graphs.png" width="600" height="300">

##### Health Score Pies
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/pies.png" width="600" height="300">

##### Calendar
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/calendar.png" width="600" height="300">

##### Requests
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/requests.png" width="600" height="300">

##### Friends
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/friends.png" width="600" height="300">

##### Blockchain History
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/blockchainhistory.png" width="600" height="300">

##### Protected Member's View
<img src="https://github.com/achroni/medical-social-network-frontend/blob/master/screens/home_protected.png" width="600" height="300">


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [React]: <https://reactjs.org/>
   [Redux]: <https://redux.js.org/>
   [Django]: <https://www.djangoproject.com/>
   [PostgreSQL]: <https://www.postgresql.org/>
   [Iroha Hyperledger]: <https://www.hyperledger.org/projects/iroha>
