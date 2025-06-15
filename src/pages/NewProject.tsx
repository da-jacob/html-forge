import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export const NewProject = ({
    projects,
    onCreate,
}: {
    projects: string[];
    onCreate: (project: string) => void;
}) => {
    const [projectName, setProjectName] = useState("");

    const [enabled, setEnabled] = useState(false);

    const [gitInstalled, setGitInstalled] = useState(false);

    const [initGit, setInitGit] = useState(false);

    const saveProject = () => {
        window.electronApi.createProject({
            name: projectName,
            git: initGit
        });
        onCreate(projectName);
    };

    useEffect(() => {
        setEnabled(
            projectName.trim() !== "" && !projects.includes(projectName.trim())
        );
    }, [projectName]);

    useEffect(() => {
        window.electronApi.checkGit().then((result) => {
            setGitInstalled(result);
        })
    }, [])

    return (
        <div>
            <h1 className="text-lg font-bold mb-6">New project</h1>
            <div className="w-full bg-slate-100 rounded-2xl px-4 py-3 border border-slate-300 mb-4">
                <h2 className="font-bold text-sm mb-4">Project information</h2>
                <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="project-name">Project Name</label>
                    <input
                        type="text"
                        id="project-name"
                        className="w-full shrink h-10 bg-white rounded-l-md px-2 border border-slate-400"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                    />
                </div>
                <div className={`mb-6 ${gitInstalled ? '' : 'pointer-events-none opacity-50'}`}>
                    <input type="checkbox" id="init-git" className="hidden peer" disabled={!gitInstalled} checked={initGit} onChange={(e) => setInitGit(e.target.checked)} />
                    <label
                        htmlFor="init-git"
                        className="select-none relative cursor-pointer flex items-center w-max before:w-4 before:h-4 before:block before:border before:border-slate-400 before:bg-white before:rounded gap-2 peer-checked:before:bg-indigo-500"
                    >
                        <Icon icon={"material-symbols:check"} className="absolute top-1/2 -translate-y-1/2 left-0 text-base text-white" />
                        Initialize git repository {gitInstalled ? '' : '| Git is not installed'}
                    </label>
                </div>
                <button
                    className="px-3 h-8 text-sm bg-indigo-600 text-white font-bold rounded-md cursor-pointer hover:bg-indigo-500 active:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={saveProject}
                    disabled={!enabled}
                >
                    <Icon icon={"solar:diskette-broken"} /> Create Project
                </button>
            </div>
        </div>
    );
};
