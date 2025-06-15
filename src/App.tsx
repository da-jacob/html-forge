import React, { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TitleBar } from "./components/TitleBar";
import { ProjectPage } from "./pages/ProjectPage";
import { NewProject } from "./pages/NewProject";
import { SettingsPage } from "./pages/SettingsPage";
import { HomePage } from "./pages/HomePage";

declare global {
    interface Window {
        electronApi: {
            getProjects: () => void;
            minimize: () => void;
            close: () => void;
            onAppData: (data: any) => void;
            checkSetup: () => void;
            selectDirectory: () => Promise<string>;
            saveConfig: (data: string) => Promise<boolean>;
            createProject: (data: {name: string; git: boolean}) => void;
            serverStatus: (data: string) => Promise<{running: boolean, url: string}>;
            serverStart: (data: string) => void;
            serverStop: (data: string) => void;
            buildProject: (data: string) => Promise<void>;
            openExternal: (url: string) => void,
            getProject: (url: string) => Promise<{path: string, lastBuild: Date|null, git: any}>,
            checkGit: () => Promise<boolean>,
            initRepo: (data: string) => Promise<void>,
            getConfig: () => Promise<string>,
            getVersion: () => Promise<string>
        };
    }
}

const App = () => {
    const [projects, setProjects] = useState<Array<string>>([]);
    const [activeProject, setActiveProject] = useState<string>('');

    const newProject = () => {
        setActivePage(<NewProject projects={projects} onCreate={(project) => openProject(project)} />);
        setActiveProject('');
        window.electronApi.checkSetup();
    };

    const [activePage, setActivePage] = useState<React.ReactNode>(<HomePage onNewProject={newProject} />);

    useEffect(() => {
        window.electronApi.checkSetup();
        window.electronApi.onAppData((data: any) => {
            if (data.type === "setup") {
              if(!data.data) {
                setActivePage(<SettingsPage />)
              } else {
                window.electronApi.getProjects();
                window.electronApi.onAppData((data: any) => {
                    if (data.type === "get-projects") {
                        setProjects(data.data);
                    }
                });
              }
            }
        });

        setInterval(() => {
            window.electronApi.getProjects();
        }, 1000);
    }, []);

    const openProject = (project: string) => {
        setActivePage(<ProjectPage project={project} />);
        setActiveProject(project);
        window.electronApi.checkSetup();
    };

    return (
        <>
            <TitleBar />
            <div className="flex h-screen">
                <Sidebar
                    onSettings={() => {
                        setActivePage(<SettingsPage />)
                        setActiveProject('');
                    }}
                    onProject={openProject}
                    onNewProject={newProject}
                    projects={projects}
                    activeProject={activeProject}
                />
                <div className="w-full shrink p-4">{activePage}</div>
            </div>
        </>
    );
};

export default App;
