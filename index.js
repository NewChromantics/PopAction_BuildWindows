const core = require("@actions/core");
const exec = require("@actions/exec");

const BUILDPLATFORM = core.getInput("BuildPlatform");
const BUILDCONFIGURATION = core.getInput("BuildConfiguration");
const BUILDDIRECTORY = core.getInput("BuildDirectory");
const PROJECT = core.getInput("Project");

const BuildSolution = `${PROJECT}.visualstudio\\${PROJECT}.sln`;

async function run() {
  try {
    // await exec.exec("cmd", ["set"]);
    await exec.exec("MSBuild", [
      BuildSolution,
      `/property:Configuration=${BUILDCONFIGURATION}`,
      `/property:Platform=${BUILDPLATFORM}`,
    ]);

    core.exportVariable('UPLOAD_NAME', 'windows');
    core.exportVariable('UPLOAD_DIR', 'Build');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
