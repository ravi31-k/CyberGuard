import React, { useEffect, useState } from "react";
import api from "../lib/api.ts";
import { BookOpen, Clock, BarChart, Play, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="font-mono uppercase">Accessing Training Database...</div>;

  return (
    <div className="space-y-8">
      <div className="border-b border-[#141414] pb-6">
        <h1 className="text-4xl font-bold tracking-tighter uppercase italic serif">Training Modules</h1>
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-2">
          Enhance your security awareness through structured learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length > 0 ? courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ) ) : (
          <div className="col-span-full border-2 border-[#141414] border-dashed p-12 text-center">
            <p className="font-mono text-sm uppercase opacity-40">No training modules available at this time.</p>
          </div>
        )}
        
        {/* Sample Courses for Demo */}
        <CourseCard course={{
          title: "Phishing Awareness 101",
          description: "Learn to identify common phishing techniques and social engineering tactics used by attackers.",
          difficulty: "BEGINNER",
          estimatedTime: 45,
          category: "SOCIAL ENGINEERING"
        }} />
        <CourseCard course={{
          title: "Advanced Network Security",
          description: "Deep dive into network protocols, encryption, and securing enterprise infrastructure.",
          difficulty: "ADVANCED",
          estimatedTime: 120,
          category: "INFRASTRUCTURE"
        }} />
        <CourseCard course={{
          title: "Password Hygiene & MFA",
          description: "Best practices for credential management and implementing multi-factor authentication.",
          difficulty: "BEGINNER",
          estimatedTime: 30,
          category: "IDENTITY"
        }} />
      </div>
    </div>
  );
};

const CourseCard = ({ course }: { course: any, key?: any }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="border-2 border-[#141414] bg-[#E4E3E0] shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] flex flex-col"
  >
    <div className="p-6 flex-1">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-[#141414] text-[#E4E3E0] px-2 py-1 font-mono text-[8px] uppercase tracking-widest">
          {course.category}
        </span>
        <div className="flex items-center gap-1 font-mono text-[10px] opacity-60">
          <Clock className="w-3 h-3" /> {course.estimatedTime}M
        </div>
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2 uppercase">{course.title}</h3>
      <p className="text-sm opacity-70 mb-6 line-clamp-2">{course.description}</p>
      
      <div className="flex items-center gap-4 border-t border-[#141414] pt-4 border-dashed">
        <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest">
          <BarChart className="w-3 h-3" /> {course.difficulty}
        </div>
      </div>
    </div>
    <button className="w-full bg-[#141414] text-[#E4E3E0] p-4 font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all">
      <Play className="w-4 h-4 fill-current" /> Start Module
    </button>
  </motion.div>
);

export default Courses;
