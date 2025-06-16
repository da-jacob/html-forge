import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import { dirname, join } from "path";
import { existsSync, readFile, readdirSync, statSync, writeFile, cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "fs";

import { format } from 'prettier';

import processIncludes from "./util/html-builder.js";
import createServer from "./util/live-server.js";
import { fileURLToPath } from "url";
import gitStatus, { initRepository, isGitInstalled } from "./util/git.js";

let rootDirectory = "";

const servers = [];

let win = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 500,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
        },
        titleBarStyle: "hiddenInset",
        title: "HtmlForge",
        frame: false,
    });

    const configPath = join(app.getPath('userData'), 'config.json');

       const indexPath = join(__dirname, '../dist/index.html');
        win.loadFile(indexPath);

    // win.webContents.openDevTools();

    ipcMain.on("window-minimize", () => {
        win.minimize();
    });

    ipcMain.on("window-close", () => {
        win.close();
    });

    ipcMain.on("window-close", () => {
        win.close();
    });

    ipcMain.on("check-setup", () => {
        if (!existsSync(configPath)) {
            win.webContents.send("app-data", { type: "setup", data: false });
        } else {
            win.webContents.send("app-data", { type: "setup", data: true });
        }

        readFile(
            configPath,
            "utf8",
            (err, data) => {
                if(data) rootDirectory = JSON.parse(data).rootDirectory;
            }
        );
    });

    ipcMain.on("get-projects", () => {
        if (rootDirectory) {
            const projects = readdirSync(rootDirectory).filter((file) => {
                return statSync(join(rootDirectory, file))
                    .isDirectory();
            });
            win.webContents.send("app-data", {
                type: "get-projects",
                data: projects,
            });
        }
    });

    ipcMain.handle("get-project", async (_, data) => {
        const buildExists = existsSync(join(rootDirectory, data, ".out"));
        
        return {
            path: join(rootDirectory, data),
            lastBuild: buildExists ? statSync(join(rootDirectory, data, ".out")).mtime : null,
            git: await gitStatus(join(rootDirectory, data))
        }
    });

    ipcMain.handle("check-git", async (_, data) => {
        return await isGitInstalled();
    });

    ipcMain.handle("get-platform", () => {
        return process.platform;
    });

    ipcMain.on('open-external', (_event, url) => {
        if (url.startsWith('https://') || url.startsWith('http://')) {
            shell.openExternal(url);
        }
    });

    ipcMain.handle("select-directory", async () => {
        const result = await dialog.showOpenDialog({
            properties: ["openDirectory"],
        });

        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }

        return result.filePaths[0];
    });

    ipcMain.handle("get-version", async () => {
        return app.getVersion();
    });

    ipcMain.handle("save-config", async (_, data) => {
        writeFile(
            configPath,
            JSON.stringify({ rootDirectory: data }),
            () => {}
        );
        rootDirectory = data;
    });

    ipcMain.handle("get-config", () => {
        return rootDirectory;
    });

    ipcMain.handle("create-project", async (_, data) => {

        const {name, git} = data;

        let structurePath = "";
        if (app.isPackaged) {
            structurePath = join(process.resourcesPath, 'app.asar.unpacked', 'project-structure');
        } else {
            structurePath = join(__dirname, "../project-structure");
        }
        if (rootDirectory) {
            cpSync(
                structurePath,
                join(rootDirectory, name),
                { recursive: true }
            );

            if(git) await initRepository(join(rootDirectory, name));

            const projects = readdirSync(rootDirectory).filter((file) => {
                return statSync(join(rootDirectory, file))
                    .isDirectory();
            });
            win.webContents.send("app-data", {
                type: "get-projects",
                name: projects,
            });
        }
    });

    ipcMain.handle("init-git", async (_, data) => {
        await initRepository(join(rootDirectory, data));
    });

    ipcMain.handle("server-start", async (_, data) => {
        servers.push(createServer(data, rootDirectory, win));
    });

    ipcMain.handle("server-status", async (_, data) => {
        const s = servers.filter((server) => server.project === data);

        return {
            running: s.length > 0,
            url: s.length > 0 ? s[0].url : ''
        }
    });

    ipcMain.handle("server-stop", async (_, data) => {
        servers.filter((server) => server.project === data).forEach(server => {
            server.server.close(() => {
                win.webContents.send("app-data", {
                    type: "server-stop",
                    data: server.project,
                });
            });
            servers.splice(servers.indexOf(server), 1);
        })
    });

    ipcMain.handle("project-build", async (_, data) => {
        rmSync(join(rootDirectory, data, ".out"), {recursive: true, force: true});

        const files = readdirSync(
            join(rootDirectory, data),
            { recursive: true }
        );

        mkdirSync(join(rootDirectory, data, ".out"));

        files.forEach(file => {
            if(file !== ".out") {
                if(statSync(join(rootDirectory, data, file)).isDirectory()) {
                    if(file !== "components"){
                        mkdirSync(join(rootDirectory, data, ".out", file));
                    }
                } else {
                    if(file.endsWith('.html') && !file.startsWith("components/") && !file.startsWith("components\\")) {
                        const f = readFileSync(join(rootDirectory, data, file), "utf8");

                        let modifiedData = processIncludes(f, rootDirectory, data);

                        format(modifiedData, {parser: 'html'}).then((formatted) => {
                            writeFileSync(join(rootDirectory, data, ".out", file), formatted);
                        })
                    } else {
                        if(!file.startsWith("components/") && !file.startsWith("components\\")) {
                            copyFileSync(join(rootDirectory, data, file), join(rootDirectory, data, ".out", file))
                        }
                    }
                }
            }
        })
    });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    app.quit();
});
