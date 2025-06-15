import simpleGit from "simple-git";
import { exec } from 'child_process';

const isGitInstalled = () => {
    return new Promise((resolve) => {
        exec('git --version', (error) => {
            resolve(!error);
        });
    });
}

const gitStatus = async (path) => {
    let result = "Not inizialized";

    if(await isGitInstalled()) {
        const git = simpleGit(path);
        const isRepo = await git.checkIsRepo('root');
        if(isRepo){
            const [status, branch] = await Promise.all([
                git.status(),
                git.branchLocal()
            ]);

            result = `${branch.current} (${status.files.length} changes)`
        }
    } else {
        result = "Git is not installed";
    }

    return result;
}

export default gitStatus;