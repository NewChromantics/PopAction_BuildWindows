Build visual studio project action
=================

Requried Inputs
----------
- `OutputDirectory` Directory to build artifacts to, passed into `msbuild` with `/property:OutDir=${OutputDirectory}`
- `BuildSolution` Path to `.sln` 
- `BuildConfiguration` Solution configuration.
- `BuildPlatform` Solution Platform.

The action will run
`MSBuild ${BuildSolution} /property:OutDir=${OutputDirectory} /property:Configuration=${BuildConfiguration} /property:Platform=${BuildPlatform}`

Outputs
--------
- From `v1.2.0` this action sets outputs to `GITHUB_OUTPUT` (via `core.setOutput`) instead of `GITHUB_ENV`
	- `UPLOAD_NAME` This is currently just `windows` but should change to be the correct exe name
	- `UPLOAD_DIR` The output build directory, which is actually the same as the input `OutputDirectory` but here for completeness
