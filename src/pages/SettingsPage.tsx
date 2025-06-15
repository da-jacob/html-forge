import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export const SettingsPage = () => {
    const [rootDir, setRootDir] = useState("");

    const handlePickFolder = async () => {
        const path = await window.electronApi.selectDirectory();
        if (path) {
            setRootDir(path);
        }
    };

    const saveConfig = async () => {
        await window.electronApi.saveConfig(rootDir);
        alert("Saved");
    };

    const getConfig = async () => {
        const config = await window.electronApi.getConfig();
        setRootDir(config);
    }

    useEffect(() => {
        getConfig();
    }, []);

    return (
        <div>
            <h1 className="text-lg font-bold mb-6">Settings</h1>
            <div className="w-full bg-slate-100 rounded-2xl px-4 py-3 border border-slate-300 mb-4">
                <div className="flex flex-col gap-2 mb-6">
                    <label htmlFor="root-dir">Root directory</label>
                    <div className="flex">
                        <input
                            type="text"
                            id="root-dir"
                            value={rootDir}
                            readOnly
                            className="w-full shrink h-10 bg-white rounded-l-md px-2 border border-slate-400"
                            onClick={handlePickFolder}
                        />
                        <button
                            className="h-10 px-4 whitespace-nowrap bg-indigo-600 text-white font-bold rounded-r-md cursor-pointer hover:bg-indigo-500 active:bg-indigo-700 transition-colors"
                            onClick={handlePickFolder}
                        >
                            Select folder
                        </button>
                    </div>
                </div>
                <button
                    className="px-3 h-8 text-sm bg-indigo-600 text-white font-bold rounded-md cursor-pointer hover:bg-indigo-500 active:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={saveConfig}
                >
                    <Icon icon={"solar:diskette-broken"} /> Save
                </button>
            </div>
        </div>
    );
};
