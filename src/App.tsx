import React, { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TitleBar } from "./components/TitleBar";
import { SetupModal } from "./components/SetupModal";
import { ProjectPage } from "./pages/ProjectPage";
import { NewProject } from "./pages/NewProject";

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
            createProject: (data: string) => void;
            serverStatus: (data: string) => Promise<{running: boolean, url: string}>;
            serverStart: (data: string) => void;
            serverStop: (data: string) => void;
            buildProject: (data: string) => Promise<void>;
            openExternal: (url: string) => void,
            getProject: (url: string) => Promise<{path: string, lastBuild: Date|null, git: any}>,
        };
    }
}

const App = () => {
    const [setupOpen, setSetupOpen] = useState(false);
    const [activePage, setActivePage] = useState<React.ReactNode>(null);
    const [projects, setProjects] = useState<Array<string>>([]);
    const [activeProject, setActiveProject] = useState<string>('');

    useEffect(() => {
        window.electronApi.checkSetup();
        window.electronApi.onAppData((data: any) => {
            if (data.type === "setup") {
              if(!data.data) {
                setSetupOpen(true);
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

    const handleClose = () => {
        setSetupOpen(false);
    };

    const openProject = (project: string) => {
        setActivePage(<ProjectPage project={project} />);
        setActiveProject(project);
    };

    const newProject = () => {
        setActivePage(<NewProject projects={projects} onCreate={(project) => openProject(project)} />);
        setActiveProject('');
    };

    return (
        <>
            <TitleBar />
            <div className="flex h-screen">
                <Sidebar
                    onSettings={() => setSetupOpen(true)}
                    onProject={openProject}
                    onNewProject={newProject}
                    projects={projects}
                    activeProject={activeProject}
                />
                <div className="w-full shrink p-4">{activePage}</div>
            </div>
            <SetupModal open={setupOpen} onClose={handleClose} />
        </>
    );
};

export default App;
