import { useState } from "react"

export const SetupModal = ({open, onClose}: {open: boolean, onClose: () => void}) => {

    const [rootDir, setRootDir] = useState("");

    const handlePickFolder = async () => {
        const path = await window.electronApi.selectDirectory();
        if (path) {
            setRootDir(path);
        }
    };

    const saveConfig = async () => {
        await window.electronApi.saveConfig(rootDir);
        onClose();
    }

    return (
        <div className={`fixed top-0 left-0 right-0 bottom-0 bg-slate-100/10 backdrop-blur-lg pt-10 justify-center px-4 items-start ${open ? 'flex' : 'hidden'}`}>
            <div className="bg-slate-50 w-xl rounded-lg shadow-md">
                <div className="px-4 py-2 font-semibold">
                    Configure HtmlForge
                </div>
                <div className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="root-dir">Root directory</label>
                        <div className="flex">
                            <input type="text" id="root-dir" value={rootDir} disabled className="w-full shrink h-10 bg-white rounded-l-md px-2 border border-slate-400" />
                            <button className="h-10 px-4 whitespace-nowrap bg-indigo-600 text-white font-bold rounded-r-md cursor-pointer hover:bg-indigo-500 active:bg-indigo-700 transition-colors" onClick={handlePickFolder}>Select folder</button>
                        </div>
                    </div>
                    <button className="px-4 h-10 bg-indigo-600 text-white font-bold rounded-md cursor-pointer hover:bg-indigo-500 active:bg-indigo-700 transition-colors" onClick={saveConfig}>Save</button>
                </div>
            </div>
        </div>
    )
}