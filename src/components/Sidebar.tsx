import { Icon } from '@iconify/react';

import logo from "../assets/logo.png";

export const Sidebar = ({projects, onSettings, onProject, onNewProject, activeProject}: {projects: string[], onSettings: () => void, onProject: (project: string) => void, onNewProject: () => void, activeProject: string}) => {
    return (
        <div className="w-80 h-full bg-gradient-to-t from-indigo-900 to-indigo-700 p-4 flex flex-col justify-between shrink-0 select-none">
            <div className='flex items-center gap-4 p-2 font-semibold text-white mb-4'>
                <img src={logo} width={24} height={24} />
                HtmlForge
            </div>
            <button onClick={onNewProject} className="w-full shrink-0 flex items-center text-white px-2.5 py-2 transition-colors gap-3 rounded-lg hover:bg-indigo-500/50 cursor-pointer">
                <Icon icon={"solar:add-square-broken"} className='text-lg leading-none' /> Create new project
            </button>
            <h2 className='text-indigo-300 my-4 px-2.5'>Projects</h2>
            <div className='flex flex-col h-full shrink overflow-auto -mx-4 mb-4'>
                <div className='flex flex-col shrink grow h-full px-4 gap-1'>
                    {projects.map((project, index) => {
                        return (
                            <button key={index} className={`w-full shrink-0 flex items-center text-white px-2.5 py-2 transition-colors gap-3 rounded-lg hover:bg-indigo-500/50 cursor-pointer ${activeProject === project ? 'bg-indigo-500/50' : ''}`} onClick={() => onProject(project)}>
                                {project}
                            </button>
                        )
                    })}
                </div>
            </div>
            <button onClick={onSettings} className="w-full shrink-0 flex items-center text-white px-2.5 py-2 transition-colors gap-3 rounded-lg hover:bg-indigo-500/50 cursor-pointer">
                <Icon icon={"solar:settings-broken"} className='text-xl' /> Settings
            </button>
        </div>
    )
}