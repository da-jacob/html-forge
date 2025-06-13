import { Icon } from "@iconify/react";

export const TitleBar = () => {
    return (
        <div className="title-bar top-0 fixed left-0 z-10 w-screen h-10 bg-slate-200 flex justify-between items-center pl-4">
            <span className="font-mono"><span className="text-lg font-black font-sans text-indigo-700">&lt;/&gt;</span> HtmlForge</span>
            <div className="btns flex items-center gap-1">
                <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-300 cursor-pointer" onClick={() => window.electronApi.minimize()}><Icon icon={"material-symbols:minimize-rounded"} /></button>
                <button className="w-10 h-10 flex items-center justify-center hover:bg-rose-500 cursor-pointer" onClick={() => window.electronApi.close()}><Icon icon={"material-symbols:close-rounded"} /></button>
            </div>
        </div>
    )
}