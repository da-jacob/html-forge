import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export const NewProject = ({ projects, onCreate }: { projects: string[], onCreate: (project: string) => void}) => {
    const [projectName, setProjectName] = useState("");

    const [enabled, setEnabled] = useState(false);

    const saveProject = () => {
        window.electronApi.createProject(projectName);
        onCreate(projectName);
    };

    useEffect(() => {
        setEnabled(
            projectName.trim() !== "" && !projects.includes(projectName.trim())
        );
    }, [projectName]);

    return (
        <div>
            <h1 className="text-lg font-bold mb-6">New project</h1>
            <div className="flex flex-col gap-2 mb-6">
                <label htmlFor="project-name">Project Name</label>
                <input
                    type="text"
                    id="project-name"
                    className="w-full shrink h-10 bg-white rounded-l-md px-2 border border-slate-400"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
            </div>
            <button
                onClick={saveProject}
                disabled={!enabled}
                className="w-max text-white bg-indigo-900 flex items-center text-lg justify-center gap-2 rounded-md px-4 py-2 transition-colors hover:bg-indigo-800 hover:text-white cursor-pointer active:bg-indigo-700 disabled:opacity-30 disabled:pointer-events-none"
            >
                <Icon icon={"solar:diskette-broken"} className="text-xl" /> Save
            </button>
        </div>
    );
};
