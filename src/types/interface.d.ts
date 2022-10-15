

export interface JWTInterface{

}

export interface LoginInterface {
    email: string;
    password: string
}

export interface RegisterInterface {
    email: string;
    username: string;
    password: string;
}

export interface CareerInterface{
    orgName: string;
    email: string;
    title: string;
    logo: string;
    tags: string;
    jobRole: string;
    duration: string;
    overview: string;
    requirements: string;
    benefits: string;
    careerId?: string
}

export interface CandidateInterface{
    careerId: string;
    jobRole: string;
    fullName: string;
    email: string;
    document: string;
    duration: string;
    link: string;
    profileImage: string;
}


export interface CandidateStatus {
    careerId: string;
    candidateId: string;
    status: string;
}

export interface MeetingInterface{
    title: string | undefined;
    description: string | undefined;
    candidateId: string | undefined;
    careerId: string | undefined;
    startDate: string | undefined;
    startTime: string | undefined;
    endTime: string | undefined;
    userId?: string;
    meetingId?: string;
}