import { Icon } from '@iconify/react';

export const Sidebar = ({projects, onSettings, onProject, onNewProject, activeProject}: {projects: string[], onSettings: () => void, onProject: (project: string) => void, onNewProject: () => void, activeProject: string}) => {
    return (
        <div className="w-80 h-full bg-indigo-900 p-4 flex flex-col justify-between shrink-0">
            <button onClick={onNewProject} className="w-full shrink-0 bg-white text-slate-800 flex items-center text-lg justify-center gap-2 rounded-md pl-4 pr-8 py-2 transition-colors hover:bg-indigo-600 hover:text-white cursor-pointer shadow-lg active:bg-indigo-700 mb-8">
                <Icon icon={"solar:add-square-broken"} className='text-xl' /> New project
            </button>
            <h2 className='text-white/40 mb-4'>Projects</h2>
            <div className='flex flex-col h-full shrink overflow-auto -mx-4 mb-4'>
                <div className='flex flex-col shrink grow h-full'>
                    {projects.map((project, index) => {
                        return (
                            <button key={index} className={`shrink-0 text-white h-10 px-4 text-left hover:bg-white/10 cursor-pointer ${activeProject === project ? 'bg-white/10' : ''}`} onClick={() => onProject(project)}>
                                {project}
                            </button>
                        )
                    })}
                </div>
            </div>
            <button onClick={onSettings} className=" shrink-0w-full text-white flex items-center text-lg justify-center gap-2 rounded-md pl-4 pr-8 py-2 transition-colors hover:bg-indigo-800 hover:text-white cursor-pointer active:bg-indigo-700">
                <Icon icon={"solar:settings-broken"} className='text-xl' /> Settings
            </button>
        </div>
    )
}