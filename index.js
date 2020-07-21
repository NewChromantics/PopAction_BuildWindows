const core = require("@actions/core");
const exec = require("@actions/exec");
const artifact = require("@actions/artifact");

const BUILDPLATFORM = core.getInput("BuildPlatform");
const BUILDCONFIGURATION = core.getInput("BuildConfiguration");
const BUILDDIRECTORY = core.getInput("BuildDirectory");
const PROJECT = core.getInput("Project");
const UploadArtifact = core.getInput("UploadArtifact");

const BuildSolution = `${PROJECT}.visualstudio\\${PROJECT}.sln`;

async function run() {
  try {
    // tsdk: causes the action to hang
    // await exec.exec("cmd", ["set"]);
    await exec.exec("MSBuild", [
      BuildSolution,
      `/property:Configuration=${BUILDCONFIGURATION}`,
      `/property:Platform=${BUILDPLATFORM}`,
    ]);

    if (UploadArtifact) {
      const artifactClient = artifact.create();
      const artifactName = "windows";

      await exec.exec(
        "Compress-Archive",
        ["-LiteralPath", `${BUILDDIRECTORY}.zip`, `DestinationPath`, `${BUILDDIRECTORY}`],
        { cwd: "Build" }
      );

      const files = [`Build/${BUILDDIRECTORY}.zip`];
      const rootDirectory = ".";
      const options = {
        continueOnError: true,
      };

      const uploadResult = await artifactClient.uploadArtifact(
        artifactName,
        files,
        rootDirectory,
        options
      );
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
