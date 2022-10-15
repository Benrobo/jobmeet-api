### MeetVast Plan

## FEATURE

1. Authentication & Authorization
    - User Schema ( UserSchema )
        - id
        - username
        - email
        - hash
        - token
        - role
        - createdAt

2. Creating of job board:
    - JobBoard Schema ( CareerSchema )
        - id
        - orgName
        - title
        - logo
        - tags
        - jobRole
        - duration
        - overview
        - Requirements
        - benefits

3. Application Process
    - jobApplication Schema ( CanditateSchema )
        - id
        - careerId
        - jobRole
        - status
        - fullName
        - email
        - phonenumber
        - document
        - website
        - createdAt

4. Meeting Planner
    - meetingPlanner ( MeetingSchema )
        - id : string
        - candidateId : string
        - orgId : string
        - startDate : number
        - startTime : number
        - endTime : number
        - isTimeExpired :  boolean


