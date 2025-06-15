import { useEffect, useState } from "react";

import logo from "../assets/logo.png";

import { Icon } from "@iconify/react";

export const HomePage = ({ onNewProject }: { onNewProject: () => void }) => {
    const [version, setVersion] = useState("");

    useEffect(() => {
        window.electronApi.getVersion().then((v) => setVersion(v));
    }, []);

    return (
        <div className="grid place-items-center h-full relative">
            <div className="flex items-center flex-col gap-4 text-center">
                <div className="flex gap-4 items-center text-3xl font-bold">
                    <img
                        src={logo}
                        width={40}
                        height={40}
                        className="w-10 h-10"
                    />
                    HtmlForge
                </div>
                <p>Build modular HTML projects with ease</p>
                <button
                    onClick={onNewProject}
                    className="px-3 h-10 text-sm bg-indigo-600 text-white font-bold rounded-md cursor-pointer hover:bg-indigo-500 active:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <Icon
                        icon={"solar:add-square-broken"}
                        className="text-lg leading-none"
                    />{" "}
                    Create new project
                </button>
            </div>
            <p className="absolute bottom-0 left-0 w-full text-center text-sm text-slate-600 flex gap-2 items-center justify-center">
                HtmlForge v{version} · by{" "}
                <button
                    className="text-indigo-600 hover:underline cursor-pointer"
                    onClick={() =>
                        window.electronApi.openExternal("https://jakublipar.cz")
                    }
                >
                    Jakub Lipár
                </button>{" "}
                ·{" "}
                <button
                    className="text-indigo-600 hover:underline cursor-pointer inline-flex items-center gap-2"
                    onClick={() =>
                        window.electronApi.openExternal(
                            "https://github.com/da-jacob/html-forge"
                        )
                    }
                >
                    <Icon icon={"devicon:github"} /> GitHub
                </button>
            </p>
        </div>
    );
};
