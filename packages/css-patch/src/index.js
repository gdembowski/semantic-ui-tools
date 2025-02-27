const chalk = require("chalk");
const fs = require("fs");
const logSymbols = require("log-symbols");
const path = require("path");

const nodeModulesPath = path.resolve(process.cwd(), "node_modules");

const hasPackages = packageNames => {
  for (const packageName of packageNames) {
    if (fs.existsSync(path.resolve(nodeModulesPath, packageName))) {
      return packageName;
    }
  }

  return undefined;
};

const replaceDoubleSemiColon = input =>
  input.replace("utf-8;;base64", "utf-8;base64");

const fixFiles = (filesToPatch, packageName) => {
  filesToPatch.forEach(fileToPatchPath => {
    if (!fs.existsSync(fileToPatchPath)) {
      console.log(
        logSymbols.error,
        chalk.bgRed.bold(
          `Failed to find "${path.resolve(
            process.cwd(),
            fileToPatchPath
          )}", please check your installation of "${packageName}"`
        )
      );

      return;
    }

    fs.writeFileSync(
      fileToPatchPath,
      replaceDoubleSemiColon(
        fs.readFileSync(fileToPatchPath, { encoding: "utf8" })
      )
    );
  });

  console.log(logSymbols.info, `Patch was successfully applied`);
}

const run = async () => {
  const lessPackage = hasPackages(["semantic-ui-less", "fomantic-ui-less"]);
  if (lessPackage !== undefined) {
    console.log(logSymbols.info, `Detected "${lessPackage}" package...`);

    const filesToPatchPath = [
      path.resolve(
        nodeModulesPath,
        lessPackage,
        "themes",
        "default",
        "elements",
        "step.overrides"
      ),
    ];

    fixFiles(filesToPatchPath, lessPackage);

    return;
  }

  const cssPackage = hasPackages(["semantic-ui-css", "fomantic-ui-css"]);
  if (cssPackage !== undefined) {
    console.log(logSymbols.info, `Detected "${cssPackage}" package...`);

    const filesToPatchPath = [
      path.resolve(nodeModulesPath, "semantic-ui-css", "semantic.css"),
      path.resolve(nodeModulesPath, "semantic-ui-css", "semantic.min.css"),
      path.resolve(
        nodeModulesPath,
        "semantic-ui-css",
        "components",
        "step.css"
      ),
      path.resolve(
        nodeModulesPath,
        "semantic-ui-css",
        "components",
        "step.min.css"
      )
    ];

    fixFiles(filesToPatchPath, cssPackage);

    return;
  }

  console.log(logSymbols.info, `No supported packages found`);
};

module.exports = {
  run
};
