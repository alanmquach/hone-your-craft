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
import { Suspense } from "react";
import { toast } from "react-toastify";

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
  const { data, isLoading: userDataLoading } = useSWR(
    session ? `/api/user/${session?.user?.email}` : null,
    (url) => fetcher(url, { method: "GET" }),
    { refreshInterval: 1000 }
  );
  const { data: userInterviews, isLoading: userInterviewsLoading } = useSWR(
    "/api/interviews",
    (url) => axios.get(url).then((res) => res.data)
  );
  const { data: userOffers, isLoading: userOffersLoading } = useSWR(
    "/api/offers",
    (url) => axios.get(url).then((res) => res.data)
  );
  const { data: userRejections, isLoading: userRejectionsLoading } = useSWR(
    "/api/rejections",
    (url) => axios.get(url).then((res) => res.data)
  );
  // If there are no user offers, default to an empty array
  const jobOffers = userOffers || [];
  // If there are no user rejections, default to an empty array
  const jobRejections = userRejections || [];

  // If there are no user interviews, default to an empty array
  const jobInterviews = userInterviews || [];
  // If there are no user skills, default to an empty array
  const userSkills = data?.user?.skills || [];
  // If there is no user data, default to an empty array
  const userData = data || [];

  const loadingUserData = !userData || userDataLoading;

  const loadingUserSkills = !userSkills || userDataLoading;

  const loadingUserInterviews = !userInterviews || userInterviewsLoading;

  const loadingUserOffers = !userOffers || userOffersLoading;

  const loadingUserRejections = !userRejections || userRejectionsLoading;

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
    const confirmed = window.confirm(
      "Are you sure you want to delete this rejection?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/rejection/${id}`);
      mutate("/api/rejections");
      toast.success("Rejection Deleted");
    } catch (error) {
      console.error("Error deleting rejection:", error);
      toast.error("Failed To Delete Rejection");
      throw error;
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this offer?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/offer/${offerId}`);
      mutate("/api/offers");
      toast.success("Offer Deleted");
    } catch (error) {
      console.error("Error deleting rejection:", error);
      toast.error("Failed To Delete Offer");
      throw error;
    }
  };

  return (
    <section className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24 min-h-screen">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Profile Card */}
        {loadingUserData ? (
          <div className="mt-4">
            <Suspense fallback={<ProfileCard userData={[]} />}>
              <ProfileCard userData={[]} />
            </Suspense>
          </div>
        ) : (
          <Suspense fallback={<ProfileCard userData={[]} />}>
            <ProfileCard userData={userData} />
          </Suspense>
        )}
        {/* Suggested Skills */}
        {loadingUserSkills ? (
          <div className="mt-4">
            <Suspense
              fallback={
                <SuggestedSkillsCard userSkills={[]} suggestedSkills={[]} />
              }
            >
              <SuggestedSkillsCard userSkills={[]} suggestedSkills={[]} />
            </Suspense>
          </div>
        ) : (
          <Suspense
            fallback={
              <SuggestedSkillsCard userSkills={[]} suggestedSkills={[]} />
            }
          >
            <SuggestedSkillsCard
              userSkills={userSkills}
              suggestedSkills={suggestedSkills}
            />
          </Suspense>
        )}
        {/* User Skills */}
        {loadingUserSkills ? (
          <div className="mt-4">
            <Suspense fallback={<UserSkillsCard userSkills={[]} />}>
              <UserSkillsCard userSkills={[]} />
            </Suspense>
          </div>
        ) : (
          <Suspense fallback={<UserSkillsCard userSkills={[]} />}>
            <UserSkillsCard userSkills={userSkills} />
          </Suspense>
        )}
      </div>
      {/* User Interviews */}
      <div className="mt-4">
        {loadingUserInterviews ? (
          <div>
            <Suspense fallback={<UpcomingInterviews jobInterviews={[]} />}>
              <UpcomingInterviews jobInterviews={[]} />
            </Suspense>
          </div>
        ) : (
          <Suspense fallback={<UpcomingInterviews jobInterviews={[]} />}>
            <UpcomingInterviews jobInterviews={jobInterviews} />
          </Suspense>
        )}
      </div>
      {/* User Offers */}
      <div className="mt-4">
        {loadingUserOffers ? (
          <Suspense
            fallback={
              <JobOffers jobOffers={[]} onDeleteOffer={handleDeleteOffer} />
            }
          >
            <JobOffers jobOffers={[]} onDeleteOffer={handleDeleteOffer} />
          </Suspense>
        ) : (
          <Suspense
            fallback={
              <JobOffers jobOffers={[]} onDeleteOffer={handleDeleteOffer} />
            }
          >
            <JobOffers
              jobOffers={jobOffers}
              onDeleteOffer={handleDeleteOffer}
            />
          </Suspense>
        )}
      </div>
      {/* User Rejections */}
      <div className="mt-4">
        {loadingUserRejections ? (
          <Suspense
            fallback={
              <JobRejections
                jobRejections={[]}
                onDeleteRejection={handleDeleteRejection}
              />
            }
          >
            <JobRejections
              jobRejections={[]}
              onDeleteRejection={handleDeleteRejection}
            />
          </Suspense>
        ) : (
          <Suspense
            fallback={
              <JobRejections
                jobRejections={[]}
                onDeleteRejection={handleDeleteRejection}
              />
            }
          >
            <JobRejections
              jobRejections={jobRejections}
              onDeleteRejection={handleDeleteRejection}
            />
          </Suspense>
        )}
      </div>
    </section>
  );
}

export default Profile;
  