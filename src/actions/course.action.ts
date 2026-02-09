"use server";

import { db } from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { courses, users } from "@/db/schema";

type CourseData = {
    title: string;
    prompt: string;
    level: "beginner" | "intermediate" | "advanced";
};

async function getUser() {
    const { userId } = await auth();

    if (!userId) return null;

    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, userId),
    });

    if (!user) return null;

    return user;
}

export async function createCourse(data: CourseData) {
    const user = await getUser();

    if (!user) throw new Error("Could not fetch user");

    const [course] = await db
        .insert(courses)
        .values({
            userId: user.id,
            title: data.title,
            prompt: data.prompt,
            level: data.level,
            status: "generating",
            content: {},
        })
        .returning();

    return course;
}

export async function getMyCourses() {
    const user = await getUser();

    if (!user) return [];

    return db.query.courses.findMany({
        where: eq(courses.userId, user.id),
        orderBy: (courses, { desc }) => desc(courses.createdAt),
    });
}
