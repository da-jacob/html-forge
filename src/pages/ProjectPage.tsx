import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import TimeAgo from "javascript-time-ago";

export const ProjectPage = ({ project }: { project: string }) => {
    const [serverRunning, setServerRunning] = useState(false);
    const [serverUrl, setServerUrl] = useState("");

    const [projectPath, setProjectPath] = useState("");
    const [lastBuild, setLastBuild] = useState("");
    const [git, setGit] = useState("");

    const stopServer = () => {
        window.electronApi.serverStop(project);
        getProject();
    };

    const startServer = () => {
        window.electronApi.serverStart(project);
        getProject();
    };

    const buildProject = () => {
        window.electronApi.buildProject(project).then(() => {
            alert("Project built");
            getProject();
        });
    };

    const getProject = () => {
        const timeAgo = new TimeAgo("en-US");
        window.electronApi.getProject(project).then((data) => {
            setProjectPath(data.path);
            if (data.lastBuild) {
                setLastBuild(timeAgo.format(data.lastBuild));
            } else {
                setLastBuild("Never");
            }
            setGit(data.git);
        });
    };

    useEffect(() => {
        window.electronApi.onAppData((data: any) => {
            if (data.type === "server-start") {
                setServerUrl(data.data.url);
                setServerRunning(true);
                getProject();
            }
            if (data.type === "server-stop") {
                setServerUrl("");
                setServerRunning(false);
                getProject();
            }
        });
    }, []);

    const initRepo = () => {
        window.electronApi.initRepo(project);
        getProject();
    }

    useEffect(() => {
        getProject();
        window.electronApi.serverStatus(project).then((data) => {
            setServerRunning(data.running);
            setServerUrl(data.url);
        });
    })

    return (
        <div>
            <h1 className="text-lg font-bold mb-6">Project: {project}</h1>
            <div className="w-full bg-slate-100 rounded-2xl px-4 py-3 border border-slate-300 mb-4">
                <h2 className="font-bold text-sm mb-4">Project overview</h2>
                <table className="mb-4">
                    <tbody>
                        <tr>
                            <td className="py-1">
                                <div className="flex items-center gap-2 pr-6 font-semibold">
                                    <Icon
                                        icon={"solar:folder-bold"}
                                        className="text-amber-500"
                                    />
                                    Project Path
                                </div>
                            </td>
                            <td className="py-1">{projectPath}</td>
                        </tr>
                        <tr>
                            <td className="py-1">
                                <div className="flex items-center gap-2 pr-6 font-semibold">
                                    <Icon
                                        icon={"devicon-plain:git"}
                                        className="text-orange-600"
                                    />
                                    Git repository
                                </div>
                            </td>
                            <td className="py-1">{git} {git === "Not initialized" ? (<>| <button className="text-indigo-500 cursor-pointer hover:text-indigo-600" onClick={initRepo}>Initialize repository</button></>) : ''}</td>
                        </tr>
                        <tr>
                            <td className="py-1">
                                <div className="flex items-center gap-2 pr-6 font-semibold">
                                    <Icon
                                        icon={"solar:clock-circle-bold"}
                                        className="text-indigo-600"
                                    />
                                    Last build
                                </div>
                            </td>
                            <td className="py-1">{lastBuild}</td>
                        </tr>
                    </tbody>
                </table>
                <button
                    className="px-3 h-8 text-sm bg-indigo-600 text-white font-bold rounded-md cursor-pointer hover:bg-indigo-500 active:bg-indigo-700 transition-colors flex items-center gap-2"
                    onClick={buildProject}
                >
                    <Icon icon={"solar:sledgehammer-bold"} /> Build project
                </button>
            </div>
            <div className="w-full bg-slate-100 rounded-2xl px-4 py-3 border border-slate-300 mb-4">
                <h2 className="font-bold text-sm mb-4">Live server</h2>
                <table className="mb-4">
                    <tbody>
                        <tr>
                            <td className="py-1">
                                <div className="flex items-center gap-2 pr-6 font-semibold">
                                    <Icon
                                        icon={"solar:server-2-bold"}
                                        className={
                                            serverRunning
                                                ? "text-emerald-500"
                                                : "text-rose-500"
                                        }
                                    />
                                    Status
                                </div>
                            </td>
                            <td className="py-1">
                                {serverRunning ? "Running" : "Stopped"}
                            </td>
                        </tr>
                        <tr>
                            <td className="py-1">
                                <div className="flex items-center gap-2 pr-6 font-semibold">
                                    <Icon
                                        icon={"solar:link-bold"}
                                        className="text-orange-600"
                                    />
                                    URL
                                </div>
                            </td>
                            <td className="py-1">
                                {serverUrl ? (
                                    <button
                                        className="flex gap-2 items-center cursor-pointer"
                                        onClick={() =>
                                            window.electronApi.openExternal(
                                                serverUrl
                                            )
                                        }
                                    >
                                        {serverUrl}{" "}
                                        <Icon icon="solar:square-share-line-broken" />
                                    </button>
                                ) : (
                                    "---"
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
                {serverRunning ? (
                    <button
                        className="px-3 h-8 text-sm bg-rose-500 text-white font-bold rounded-md cursor-pointer hover:bg-rose-400 active:bg-rose-600 transition-colors flex items-center gap-2"
                        onClick={stopServer}
                    >
                        <Icon icon={"solar:stop-bold"} /> Stop server
                    </button>
                ) : (
                    <button
                        className="px-3 h-8 text-sm bg-emerald-500 text-white font-bold rounded-md cursor-pointer hover:bg-emerald-400 active:bg-emerald-600 transition-colors flex items-center gap-2"
                        onClick={startServer}
                    >
                        <Icon icon={"solar:play-bold"} /> Start server
                    </button>
                )}
            </div>
        </div>
    );
};
