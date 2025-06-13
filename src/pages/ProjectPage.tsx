import { useEffect, useState } from "react"
import { Icon } from '@iconify/react';

export const ProjectPage = ({project}: {project: string}) => {

    const [serverRunning, setServerRunning] = useState(false);
    const [serverUrl, setServerUrl] = useState('');

    const stopServer = () => {
        window.electronApi.serverStop(project);
    }

    const startServer = () => {
        window.electronApi.serverStart(project);
    }

    const buildProject = () => {
        window.electronApi.buildProject(project).then(() => {
            alert("Project built");
        })
    }

    useEffect(() => {
        window.electronApi.serverStatus(project).then((data) => {
            setServerRunning(data.running);
            setServerUrl(data.url);
        })

        window.electronApi.onAppData((data: any) => {
            if (data.type === "server-start") {
                setServerUrl(data.data.url);
                setServerRunning(true);
            }
            if (data.type === "server-stop") {
                setServerUrl('');
                setServerRunning(false);
            }
        });
    });

    return (
        <div>
            <h1 className="text-lg font-bold mb-6">{project}</h1>
            <div className="flex gap-2">
                <div className="flex gap-2 items-center mb-6 px-2 py-1 bg-slate-200 text-sm rounded-md w-max">
                    {serverRunning ? (
                        <>
                            <span className="block w-2 h-2 rounded-full bg-emerald-400"></span> Server running
                        </>
                    ) : (
                        <>
                            <span className="block w-2 h-2 rounded-full bg-rose-400"></span> Server stopped
                        </>
                    )}
                </div>
                {serverUrl && (
                    <button className="flex gap-2 items-center mb-6 px-2 py-1 bg-slate-200 text-sm rounded-md w-max cursor-pointer" onClick={() => window.electronApi.openExternal(serverUrl)}>
                        {serverUrl} <Icon icon="solar:square-share-line-broken" />
                    </button>
                )}
            </div>
            <div className="flex items-center gap-3">
                {serverRunning ? (
                    <button className="px-3 h-8 text-sm bg-rose-600 text-white font-bold rounded-md cursor-pointer hover:bg-rose-500 active:bg-rose-700 transition-colors flex items-center gap-2" onClick={stopServer}><Icon icon={"solar:stop-bold"} /> Stop server</button>
                ) : (
                    <button className="px-3 h-8 text-sm bg-emerald-600 text-white font-bold rounded-md cursor-pointer hover:bg-emerald-500 active:bg-emerald-700 transition-colors flex items-center gap-2" onClick={startServer}><Icon icon={"solar:play-bold"} /> Start server</button>
                )}

                <button className="px-3 h-8 text-sm bg-indigo-600 text-white font-bold rounded-md cursor-pointer hover:bg-indigo-500 active:bg-indigo-700 transition-colors flex items-center gap-2" onClick={buildProject}><Icon icon={"solar:sledgehammer-bold"} /> Build project</button>
            </div>
        </div>
    )
}