import { Icon } from "@iconify/react";

import logo from "../assets/logo.png";

export const TitleBar = () => {
    return (
        <div className="title-bar top-0 fixed left-0 z-10 w-screen h-10 bg-slate-200 flex justify-between items-center pl-2">
            <span className="font-mono items-center flex gap-3"><img src={logo} width={24} height={24} /> HtmlForge</span>
            <div className="btns flex items-center gap-1">
                <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-300 cursor-pointer" onClick={() => window.electronApi.minimize()}><Icon icon={"material-symbols:minimize-rounded"} /></button>
                <button className="w-10 h-10 flex items-center justify-center hover:bg-rose-500 cursor-pointer" onClick={() => window.electronApi.close()}><Icon icon={"material-symbols:close-rounded"} /></button>
            </div>
        </div>
    )
}