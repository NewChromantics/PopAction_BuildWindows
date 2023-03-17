const core = require("@actions/core");
const exec = require("@actions/exec");

const BUILDPLATFORM = core.getInput("BuildPlatform");
const BUILDCONFIGURATION = core.getInput("BuildConfiguration");
const PROJECT = core.getInput("Project");
const BuildSolution = core.getInput("BuildSolution") || `${PROJECT}.visualstudio\\${PROJECT}.sln`;

//	there doesnt seem to be a way to nicely extract (other than regex) the output dir, so instead, we specify it in the commandline
const OutputDirectory = core.getInput("OutputDirectory") || false;

async function run()
{
	if ( !OutputDirectory )
		throw `OutputDirectory needs to be specified; this sets the Msbuild OutDir`;

	//  execute nuget restore to restore any packages (if packages.config is present) in the solution
	//  nuget isn't automatically installed (and it's NOT in the github runners) so this can fail
	//  Show a prompt if it fails
	try
	{
		console.log(`Restoring nuget packages...`);
		await exec.exec("nuget", ['restore',BuildSolution] );
	}
	catch(e)
	{
		console.warn(`nuget restore ${BuildSolution} failed: ${e}`);
		console.warn(`Perhaps nuget isn't installed. Use this in your workflow to integrate it;`);
		console.log(`- name: Download Nuget`);
		console.log(`  uses: warrenbuckley/Setup-Nuget@v1`);
	}

	// await exec.exec("cmd", ["set"]);
	await exec.exec("MSBuild",
					[
						BuildSolution,
						`/property:Configuration=${BUILDCONFIGURATION}`,
						`/property:Platform=${BUILDPLATFORM}`,
						`/property:OutDir=${OutputDirectory}`
					]
	);

	//	todo: this name should be the final output EXE/DLL
	core.setOutput('UPLOAD_NAME', 'windows');
	core.setOutput('UPLOAD_DIR', OutputDirectory );
}

run().catch( (error) => core.setFailed(error.message) );
