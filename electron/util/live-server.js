import express from "express";
import path from "path";
import fs from "fs";
import livereload from "livereload";
import connectLiveReload from "connect-livereload";
import processIncludes from "./html-builder.js";

let liveReloadPort = 35729;

const createServer = (project, rootDirectory, window) => {
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

        window.webContents.send("app-data", {
            type: "server-start",
            data: {
                project: project,
                url: `http://localhost:${address.port}/index.html`
            },
        });

        console.log(
            `Server running on: http://localhost:${address.port}/index.html`
        );
    });

    return{
        project,
        server,
        url: `http://localhost:${server.address().port}/index.html`
    }
};

export default createServer;