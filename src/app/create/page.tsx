"use client";

import { createCourse } from "@/actions/course.action";

export default function CreateCourse() {
    const handleSubmit = async (formData: FormData) => {
        const prompt = formData.get("prompt") as string;
        await createCourse({ prompt, title: "", level: "beginner" });
    };

    return (
        <div className="max-w-2xl mx-auto p-10">
            <h1 className="text-2xl font-bold mb-4">
                Create Course with AI
            </h1>

            <form action={handleSubmit} className="space-y-4">
                <textarea
                    name="prompt"
                    placeholder="Describe what you want to learn..."
                    className="w-full h-40 p-3 border rounded"
                    required
                />

                <button className="px-4 py-2 bg-black text-white rounded">
                    Generate Course
                </button>
            </form>
        </div>
    );
}
