"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import axios from "axios";
import ProfileCard from "../components/profile/ProfileCard";
import SuggestedSkillsCard from "../components/profile/SuggestedSkillsCard";
import UserSkillsCard from "../components/profile/UserSkillsCard";
import getUserJobPostings from "../lib/getUserJobPostings";
import UpcomingInterviews from "../components/profile/UpcomingInterviews";
import JobOffers from "../components/profile/JobOffers";
import JobRejections from "../components/profile/JobRejections";

interface JobPosting {
  title: string;
  company: string;
  postUrl: string;
  skills: string[];
}

const fetcher = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  return response.json();
};

function Profile() {
  const { data: session } = useSession();
  const { data: userData, isLoading: userDataLoading } = useSWR(
    session ? `/api/user/${session?.user?.email}` : null,
    (url) => fetcher(url, { method: "GET" })
  );
  const { data: userOffers, isLoading: userOffersLoading } = useSWR(
    "/api/offers",
    (url) => axios.get(url).then((res) => res.data)
  );
  const { data: userRejections } = useSWR("/api/rejections", (url) =>
    axios.get(url).then((res) => res.data)
  );
  const { data: userInterviews, isLoading: userInterviewsLoading } = useSWR(
    "/api/interviews",
    (url) => axios.get(url).then((res) => res.data)
  );
  // If there are no user offers, default to an empty array
  const jobOffers = userOffers || [];
  // If there are no user rejections, default to an empty array
  const jobRejections = userRejections || [];

  // If there are no user interviews, default to an empty array
  const jobInterviews = userInterviews || [];
  // If there are no user skills, default to an empty array
  const userSkills = userData?.user?.skills || [];

  const loadingUserSkills = !userSkills || userDataLoading;

  const loadingUserInterviews = !userInterviews || userInterviewsLoading;

  const loadingUserOffers = !userOffers || userOffersLoading;

  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);

  useEffect(() => {
    async function fetchJobPostings() {
      try {
        const userJobPostings = await getUserJobPostings();
        setJobPostings(userJobPostings);
      } catch (error) {
        console.error("Error fetching user job postings:", error);
      }
    }
    fetchJobPostings();
  }, []);

  // Calculate all suggested skills and remove duplicates
  const suggestedSkills = Array.from(
    new Set(
      jobPostings
        ? jobPostings
            .flatMap((job) => job.skills)
            .filter((skill) => !userSkills?.user?.skills.includes(skill))
        : []
    )
  );

  const handleDeleteRejection = async (id: string) => {
    try {
      await axios.delete(`/api/rejection/${id}`);
      mutate("/api/rejections");
    } catch (error) {
      console.error("Error deleting rejection:", error);
      throw error;
    }
  };

  const handleDeleteOffer = async (id: string) => {
    try {
      await axios.delete(`/api/offer/${id}`);
      mutate("/api/offers");
    } catch (error) {
      console.error("Error deleting offer:", error);
      throw error;
    }
  };

  return (
    <section className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24 min-h-screen">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <ProfileCard />
        {loadingUserSkills ? (
          <div>
            <SuggestedSkillsCard userSkills={[]} suggestedSkills={[]} />
          </div>
        ) : (
          <SuggestedSkillsCard
            userSkills={userSkills}
            suggestedSkills={suggestedSkills}
          />
        )}
        {loadingUserSkills ? (
          <div>
            <UserSkillsCard userSkills={[]} />
          </div>
        ) : (
          <UserSkillsCard userSkills={userSkills} />
        )}
      </div>
      <div className="mt-5">
        {loadingUserInterviews ? (
          <div>
            <UpcomingInterviews jobInterviews={[]} />
          </div>
        ) : (
          <UpcomingInterviews jobInterviews={jobInterviews} />
        )}
      </div>
      <div className="mt-5">
        {loadingUserOffers ? (
          <div>
            <JobOffers jobOffers={[]} onDelete={handleDeleteOffer} />
          </div>
        ) : (
          <JobOffers jobOffers={jobOffers} onDelete={handleDeleteOffer} />
        )}
      </div>

      <div className="mt-5">
        <JobRejections
          jobRejections={jobRejections}
          onDelete={handleDeleteRejection}
        />
      </div>
    </section>
  );
}

export default Profile;
  