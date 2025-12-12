import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getClassHomeworkApi,
  type HomeworkType,
} from "../../api/homeworkApi";



const ClassHomeworkList = () => {
  const { classId } = useParams<{ classId: string }>();

  const [homeworks, setHomeworks] = useState<HomeworkType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) return;
    const load = async () => {
      try {
        const data = await getClassHomeworkApi();
        setHomeworks(data);
        console.log(data)
      } finally {
        setLoading(false);
      }
    };
    load();
  }, );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold mb-4 bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
          Class Homework
        </h1>

        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
          {loading ? (
            <div className="p-6 text-sm text-slate-300">Loading...</div>
          ) : homeworks.length === 0 ? (
            <div className="p-6 text-sm text-slate-300">
              No homework assigned for this class.
            </div>
          ) : (
           <ul className="divide-y divide-white/5">
  {homeworks.map((hw) => {
    const classInfo =
      typeof hw.classId === "string" ? null : hw.classId;
    const teacherInfo =
      typeof hw.teacherId === "string" ? null : hw.teacherId;

    return (
      <li key={hw._id} className="p-4 hover:bg-white/5 transition">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-50">
              {hw.title}
            </h2>

            {/* Class + section */}
            {classInfo && (
              <p className="text-[11px] text-slate-300 mt-1">
                Class:{" "}
                <span className="font-medium">
                  {classInfo.name}{" "}
                  {classInfo.section ? `(${classInfo.section})` : ""}
                </span>
              </p>
            )}

            {/* Teacher */}
            {teacherInfo && (
              <p className="text-[11px] text-slate-300 mt-1">
                Teacher:{" "}
                <span className="font-medium">
                  {teacherInfo.name}{" "}
                  {teacherInfo.subject ? `- ${teacherInfo.subject}` : ""}
                </span>
              </p>
            )}

            <p className="text-xs text-slate-300 mt-1">
              Subject: <span className="font-medium">{hw.subject}</span>
            </p>

            {hw.description && (
              <p className="text-xs text-slate-400 mt-1">
                {hw.description}
              </p>
            )}
          </div>

          <div className="text-right">
            {hw.dueDate && (
              <p className="text-[11px] text-amber-300">
                Due: {new Date(hw.dueDate).toLocaleDateString()}
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Assigned: {new Date(hw.createdAt).toLocaleDateString()}
            </p>
            {hw.attachment && (
              <a
                href={hw.attachment}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-[11px] text-sky-300 hover:text-sky-200 underline"
              >
                View attachment
              </a>
            )}
          </div>
        </div>
      </li>
    );
  })}
</ul>

          )}
        </div>
      </div>
    </div>
  );
};

export default ClassHomeworkList;
