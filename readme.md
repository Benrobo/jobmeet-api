# JobMeet API 

Ease Job Application Process for both `Hiring Manager` & `Candidates`

> WebApp [App](https://github.com/Benrobo/jobmeet)

> API [API](https://github.com/Benrobo/jobmeet-api)



</br>

![img](https://raw.githubusercontent.com/Benrobo/jobmeet/main/githubImg/JobMeet.png)

We know how tedious it is for both `Hiring Manager` to seek for talent and `Talent` to apply for jobs online. Often, `Hiring Manager` goes a long way in creating a LinkedIn job posts from a third party website about a job opening, collect users signup from a different web application.

In the process of receiving this `Candidate / Talent` provided documents, `Hiring Manager` need to decide if a particular candidate would be `approve` or `rejected` based on the details provided. Then if a particular `Candidate` meet the company or hiring manager requirements, he needs to schedule a meeting from a third party site like `Zoom / Google Meet`. This process is really tiring.

But, what if we could have all this features listed above in a single application, making the process of hiring intuitive, easier and flexible. Well, this is where `JobMeet` comes into play.

## What is JobMeet ? 
JobMeet is just a web application that chooses to fufill the above requirements from:

- [x] Creating of job / career page for candidates.
- [x] Receiving of candidates applications.
- [x] Search for both candidates and organizaton.
- [x] Decide to `approve` or `reject` a candidate application, in the process of sending an email to that candidate based on the status of the application.
- [x] Schedule a onetime secure video conferencing meeting for that candidate.
- [x] Conduct the meeting from the same application without making use of any other third party app.

Those are the above feature `JobMeet` aims to solve.

## Challenges we ran Into.
Some of the challenges I ran into while developing this application from ground up were : 
`(1)` Setting up `Agora SDK`. Having trying different approach to solve the issue of users webcam not showing, I then figured out that the problem wasn't from Agora SDK but rather, my PC webcam. This made me postponed implementation of video conferencing within the app. Also made me use some other third party video / audio calling tool called `JitSi SDK`

## Archivement we are Proud Of?
Despite facing different problems during development of this application, am really glad that we get to work with some technologies we haven't worked with before. This provide room for learning while building. technologies like `JitSi SDK`, `MongoDB (NoSQLL database)`, `Typescript`.

## Plans for JobMeet
JobMeet is at his early `MVP` stage. with adequate time and resources, we plan to improve this application by ading other complex feature within the app which could drive users engagement from both the `hiring manager` & `candidates` seeking for jobs in order to make the hiring process much more easier.

## Technologies Used.
Below are the techologies used in developing this application.

- [x] Typescript ( `Backend` & `Frontend` ).
- [x] React + Typescript  + Vite.
- [x] MongoDB ( `NoSQL` ) database.
- [x] JitSi SDK (A `video / audio / chat` conferencing platform)

## Images of JobMeet

![img](https://raw.githubusercontent.com/Benrobo/jobmeet/main/githubImg/JobMeet.png)
![img](https://raw.githubusercontent.com/Benrobo/jobmeet/main/githubImg/jobmeet%202.png)
![img](https://raw.githubusercontent.com/Benrobo/jobmeet/main/githubImg/jobmeet%204.png)
![img](https://raw.githubusercontent.com/Benrobo/jobmeet/main/githubImg/jobmeet%205.png)
![img](https://raw.githubusercontent.com/Benrobo/jobmeet/main/githubImg/jobmeet%206.png)
![img](https://raw.githubusercontent.com/Benrobo/jobmeet/main/githubImg/jobmeet%207.png)
![img](https://raw.githubusercontent.com/Benrobo/jobmeet/main/githubImg/jobmeet%208.png)
![img](https://raw.githubusercontent.com/Benrobo/jobmeet/main/githubImg/jobmeet%209.png)
![img](https://raw.githubusercontent.com/Benrobo/jobmeet/main/githubImg/jobmeet%2010.png)

## Setting up JobMeet
JobMeet can be run locally along with the [Backend API](https://github.com/Benrobo/jobmeet-api).

## Update Database config in .env file.
Replace the below data with your own harperdb instance.

```js
    // jobmeet uses mongodb as it prefered database
    DB_URL="mongo_url...."
```

> Make sure you have the latest version of Nodejs and NPM

1. Clone the repo
```
git clone https://github.com/Benrobo/jobmeet-api.git
```
2. Install all dependencies
```
npm install
```
3. Start `dev` server
```
npm run dev
```
