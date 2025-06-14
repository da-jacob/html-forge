import { Icon } from "@iconify/react";

export const TitleBar = () => {
    return (
        <div className="title-bar top-0 fixed left-0 z-10 w-screen h-10 flex justify-end items-center pl-2">
            <div className="btns flex items-center gap-1">
                <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-300 cursor-pointer rounded-b-md" onClick={() => window.electronApi.minimize()}><Icon icon={"material-symbols:minimize-rounded"} /></button>
                <button className="w-10 h-10 flex items-center justify-center hover:bg-rose-500 cursor-pointer rounded-bl-md" onClick={() => window.electronApi.close()}><Icon icon={"material-symbols:close-rounded"} /></button>
            </div>
        </div>
    )
}