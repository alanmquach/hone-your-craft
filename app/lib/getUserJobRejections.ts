"use server";

import getCurrentUser from "./getCurrentUser";
import prisma from "./db/prisma";

const getUserJobRejections = async () => {
  try {
    // Retrieve the current user
    const currentUser = await getCurrentUser();

    // Throw an error if the user is not authenticated or user ID is not found
    if (!currentUser?.id) {
      throw new Error("User not authenticated or user ID not found");
    }

    // Fetch user rejections from the database
    const userRejections = await prisma.rejection.findMany({
      where: {
        userId: currentUser.id,
      },
      // Include related job details along with rejections
      include: {
        job: {
          select: {
            id: true,
            userId: true,
            company: true,
            title: true,
            description: true,
            industry: true,
            location: true,
            workLocation: true,
            updatedAt: true,
            postUrl: true,
          },
        },
      },
    });

    console.log(userRejections);
    // Return user rejections
    return userRejections;
  } catch (error) {
    console.error("Error fetching user rejections:", error);
    throw new Error("Failed to fetch user rejections");
  }
};

export default getUserJobRejections;
