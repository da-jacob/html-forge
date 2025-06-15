import path from "path";
import fs from "fs";

const includeRegex = /<!--\s*include\s+"([^"]+)"(?:\s+([^>]+))?\s*-->/g;

const parseIncludeParams = (paramString) => {
    const params = {};
    const paramRegex = /(\w+)\s*=\s*"([^"]*)"/g;
    let match;
    while ((match = paramRegex.exec(paramString)) !== null) {
        const [_, key, value] = match;
        params[key] = value;
    }
    return params;
}

const processIncludes = (html, rootDirectory, project, depth = 0) => {
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

export default processIncludes;