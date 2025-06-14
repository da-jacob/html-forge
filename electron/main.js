const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");

var prettier = require('prettier');

const express = require("express");
const simpleGit = require('simple-git');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const { exec } = require('child_process');

let rootDirectory = "";

const servers = [];

let liveReloadPort = 35729;

let win = null;

const includeRegex = /<!--\s*include\s+"([^"]+)"(?:\s+([^>]+))?\s*-->/g;


function isGitInstalled() {
    return new Promise((resolve) => {
        exec('git --version', (error) => {
            resolve(!error);
        });
    });
}

function parseIncludeParams(paramString) {
    const params = {};
    const paramRegex = /(\w+)\s*=\s*"([^"]*)"/g;
    let match;
    while ((match = paramRegex.exec(paramString)) !== null) {
        const [_, key, value] = match;
        params[key] = value;
    }
    return params;
}

function processIncludes(html, rootDirectory, project, depth = 0) {
    if (depth > 10) {
        return "<!-- Error: Max include depth exceeded -->";
    }

    return html.replace(includeRegex, (fullMatch, filePath, paramString = "") => {
        const includePath = path.join(rootDirectory, project, filePath);
        if (!fs.existsSync(includePath)) {
            return `<!-- Error: File not found: ${filePath} -->`;
        }

        let includeContent = fs.readFileSync(includePath, "utf8");

        const params = parseIncludeParams(paramString);
        Object.entries(params).forEach(([key, value]) => {
            const placeholderRegex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
            includeContent = includeContent.replace(placeholderRegex, value);
        });

        includeContent = processIncludes(includeContent, rootDirectory, project, depth + 1);

        return includeContent;
    });
}

const createServer = (project) => {
    const app = express();

    const staticDir = path.join(rootDirectory, project);

    const liveReloadServer = livereload.createServer({ port: liveReloadPort });
    liveReloadServer.watch(staticDir);

    app.use(connectLiveReload({ port: liveReloadPort }));

    liveReloadPort++;

    app.use((req, res, next) => {
        const filePath = path.join(staticDir, req.path);
        if (req.path.endsWith(".html")) {
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    return next();
                }
                
                let modifiedData = processIncludes(data, rootDirectory, project);

                res.setHeader("Content-Type", "text/html");
                res.send(modifiedData);
            });
        } else {
            next();
        }
    });

    app.use(express.static(staticDir));

    const server = app.listen(0, () => {
        const address = server.address();

        win.webContents.send("app-data", {
            type: "server-start",
            data: {
                project: project,
                url: `http://localhost:${address.port}/index.html`
            },
        });

        console.log(
            `Server running on: http://localhost:${address.port}/index.html`
        );

        servers.push({
            project,
            server,
            url: `http://localhost:${address.port}/index.html`
        })
    });
};

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 500,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        title: "HtmlForge",
        frame: false,
    });

    const configPath = path.join(app.getPath('userData'), 'config.json');

    if (app.isPackaged) {
       const indexPath = path.join(__dirname, '../dist/index.html');
        win.loadFile(indexPath);
    } else {
        win.loadURL('http://localhost:5173');
    }

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
        if (!fs.existsSync(configPath)) {
            win.webContents.send("app-data", { type: "setup", data: false });
        } else {
            win.webContents.send("app-data", { type: "setup", data: true });
        }

        fs.readFile(
            configPath,
            "utf8",
            (err, data) => {
                if(data) rootDirectory = JSON.parse(data).rootDirectory;
            }
        );
    });

    ipcMain.on("get-projects", () => {
        if (rootDirectory) {
            const projects = fs.readdirSync(rootDirectory).filter((file) => {
                return fs
                    .statSync(path.join(rootDirectory, file))
                    .isDirectory();
            });
            win.webContents.send("app-data", {
                type: "get-projects",
                data: projects,
            });
        }
    });

    ipcMain.handle("get-project", async (_, data) => {
        const buildExists = fs.existsSync(path.join(rootDirectory, data, ".out"));

        let gitStatus = "Not inizialized";
        if(await isGitInstalled()) {
            const git = simpleGit(path.join(rootDirectory, data));
            const isRepo = await git.checkIsRepo('root');
            if(isRepo){
                const [status, branch] = await Promise.all([
                    git.status(),
                    git.branchLocal()
                ]);
    
                gitStatus = `${branch.current} (${status.files.length} changes)`
            }
        } else {
            gitStatus = "Git is not installed";
        }

        
        return {
            path: path.join(rootDirectory, data),
            lastBuild: buildExists ? fs.statSync(path.join(rootDirectory, data, ".out")).mtime : null,
            git: gitStatus
        }
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

    ipcMain.handle("save-config", async (_, data) => {
        fs.writeFile(
            configPath,
            JSON.stringify({ rootDirectory: data }),
            () => {}
        );
        rootDirectory = data;
    });

    ipcMain.handle("create-project", async (_, data) => {
        let structurePath = "";
        if (app.isPackaged) {
            structurePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'project-structure');
        } else {
            structurePath = path.join(__dirname, "../project-structure");
        }
        if (rootDirectory) {
            fs.cpSync(
                structurePath,
                path.join(rootDirectory, data),
                { recursive: true }
            );
            const projects = fs.readdirSync(rootDirectory).filter((file) => {
                return fs
                    .statSync(path.join(rootDirectory, file))
                    .isDirectory();
            });
            win.webContents.send("app-data", {
                type: "get-projects",
                data: projects,
            });
        }
    });

    ipcMain.handle("server-start", async (_, data) => {
        createServer(data);
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
        fs.rmSync(path.join(rootDirectory, data, ".out"), {recursive: true, force: true});

        const files = fs.readdirSync(
            path.join(rootDirectory, data),
            { recursive: true }
        );

        fs.mkdirSync(path.join(rootDirectory, data, ".out"));

        files.forEach(file => {
            if(file !== ".out") {
                if(fs.statSync(path.join(rootDirectory, data, file)).isDirectory()) {
                    if(file !== "components"){
                        fs.mkdirSync(path.join(rootDirectory, data, ".out", file));
                    }
                } else {
                    if(file.endsWith('.html') && !file.startsWith("components/") && !file.startsWith("components\\")) {
                        const f = fs.readFileSync(path.join(rootDirectory, data, file), "utf8");

                        let modifiedData = processIncludes(f, rootDirectory, data);

                        prettier.format(modifiedData, {parser: 'html'}).then((formatted) => {
                            fs.writeFileSync(path.join(rootDirectory, data, ".out", file), formatted);
                        })
                    } else {
                        if(!file.startsWith("components/") && !file.startsWith("components\\")) {
                            fs.copyFileSync(path.join(rootDirectory, data, file), path.join(rootDirectory, data, ".out", file))
                        }
                    }
                }
            }
        })
    });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
