import { updater } from "file-updater";
import {
    updateEslintrc,
    updateGitignore,
    updatePrettierignore,
    updatePrettierrc,
    updateVscodeSettings,
    updateLicense,
} from "ts-archetype";

const config = {
    author: "Andreas Arvidsson",
    authorRepository: "https://github.com/AndreasArvidsson",
    funding: "https://github.com/sponsors/AndreasArvidsson",
    projectName: "talon-rpc",
    displayName: "Talon rpc",
    projectType: "nodeLib",
};

export default async (workspaceDir) => {
    await updater({
        ".eslintrc.json": updateEslintrc(config),
        ".gitignore": updateGitignore(config),
        ".prettierignore": updatePrettierignore(config),
        ".prettierrc.json": updatePrettierrc(config),
        ".vscode/settings.json": updateVscodeSettings(config),
        LICENSE: updateLicense(config),
    });
};
