'use strict';

const path = require(`path`);
const { spawn } = require(`child_process`);
const extender = require(`object-extender`);
const taskDefinitionOriginal = require(`./task.config.json`);

const WORKING_DIR = path.join(__dirname, `../../`);
const AWS_PROFILE = `tech-sessions-ci`;
const AWS_REGION = `us-east-2`;
const AWS_REPO_URL = `160107473855.dkr.ecr.us-east-2.amazonaws.com`;
const IMAGE_NAME = `ts-app`;
const cache = {};

/*
 * Executes the given command and returns a promise.
 */
function execute (command) {

	return new Promise((resolve, reject) => {

		const [ commandToRun, ...commandArgs ] = command.split(/\s+/g);

		const child = spawn(commandToRun, commandArgs, {
			cwd: WORKING_DIR,
			env: process.env,
			shell: true,
		});

		let stdout = ``;
		let stderr = ``;

		child.stdout.on(`data`, data => {
			stdout += data;
			process.stdout.write(data);
		});
		child.stderr.on(`data`, data => {
			stderr += data;
			process.stderr.write(data);
		});

		child.on(`error`, err => reject(err));

		child.on(`close`, (code) => {
			if (code) {
				const err = new Error(`Command exited unexpectedly with error code "${code}"!`);
				err.stderr = stderr;
				return reject(err);
			}

			return resolve(stdout);
		});

	});

}

// Grab the version argument.
const versionType = (process.argv[2] || ``);
if (versionType !== `major` && versionType !== `minor` && versionType !== `patch`) {
	throw new Error(`--version flag is required and must be one of "major", "minor" or "patch".`);
}

// Grab the environment argument.
const environment = (process.argv[3] || ``);
if (environment !== `production` && environment !== `staging`) {
	throw new Error(`--environment flag is required and must be one of "production" or "staging".`);
}

// Figure out the correct resources to use for the given environment.
const branch = (environment === `production` ? `master` : `develop`);
const clusterName = `tech-sessions`;
const taskFamily = `tech-sessions-app-${environment}`;
const serviceName = `tech-sessions-app-${environment}`;

// Begin!
Promise.resolve()

	// Switch to the correct branch.
	.then(() => process.stdout.write(`\n\n[Switching to ${branch} branch]\n`))
	.then(() => execute(`git checkout ${branch}`))

	// Bump the version.
	.then(() => process.stdout.write(`\n\n[Bumping version number]\n`))
	.then(() => execute(`npm version ${versionType}`))
	.then(stdout => cache.version = stdout.match(/v(\d+\.\d+\.\d+)/)[1])

	// Get Docker login token.
	.then(() => process.stdout.write(`\n\n[Retrieving Docker login token from AWS]\n`))
	.then(() => execute(`aws ecr get-login --no-include-email --profile "${AWS_PROFILE}" --region "${AWS_REGION}"`))
	.then(dockerLoginCommand => cache.dockerLoginCommand = dockerLoginCommand)

	// Login to Docker.
	.then(() => process.stdout.write(`\n\n[Logging into AWS Docker repository]\n`))
	.then(() => execute(cache.dockerLoginCommand))

	// Build and tag new Docker image.
	.then(() => process.stdout.write(`\n\n[Building and tagging Docker image]\n`))
	.then(() => execute(`docker build -t ${IMAGE_NAME} -t ${AWS_REPO_URL}/${IMAGE_NAME}:latest -t ${AWS_REPO_URL}/${IMAGE_NAME}:${cache.version} .`))

	// Push to AWS container repo.
	.then(() => process.stdout.write(`\n\n[Pushing Docker image to AWS repository]\n`))
	.then(() => execute(`docker push ${AWS_REPO_URL}/${IMAGE_NAME}:latest`))
	.then(() => execute(`docker push ${AWS_REPO_URL}/${IMAGE_NAME}:${cache.version}`))

	// Update AWS ECS task definition with new image tag.
	.then(() => process.stdout.write(`\n\n[Updating AWS ECS task definition]\n`))
	.then(() => {

		// Prepare the task definition.
		const taskDefinition = extender.clone(taskDefinitionOriginal);
		const websiteContainer = taskDefinition.containerDefinitions[0];

		// Apply logs configuration.
		websiteContainer.logConfiguration.options[`awslogs-region`] = AWS_REGION;

		const containerDefinitionsJson = JSON.stringify(taskDefinition.containerDefinitions);
		const escapedContainerDefinitionsJson = containerDefinitionsJson.replace(/"/g, `\\"`);
		const args = [
			`--profile "${AWS_PROFILE}"`,
			`--region "${AWS_REGION}"`,
			`--output "json"`,
			`--family "${taskFamily}"`,
			`--container-definitions "${escapedContainerDefinitionsJson}"`,
		].join(` `);

		return execute(`aws ecs register-task-definition ${args}`);

	})
	.then(newTaskDefinition => cache.newTaskDefinition = JSON.parse(newTaskDefinition).taskDefinition)

	// Update AWS ECS service with new task definition.
	.then(() => process.stdout.write(`\n\n[Updating AWS ECS service]\n`))
	.then(() => {

		const args = [
			`--profile "${AWS_PROFILE}"`,
			`--region "${AWS_REGION}"`,
			`--output "json"`,
			`--cluster "${clusterName}"`,
			`--service "${serviceName}"`,
			`--task-definition "${cache.newTaskDefinition.family}:${cache.newTaskDefinition.revision}"`,
		].join(` `);

		return execute(`aws ecs update-service ${args}`);

	})

	// Push the changes and tag to the remote repo.
	.then(() => process.stdout.write(`\n\n[Pushing version change to Git repository]\n`))
	.then(() => execute(`git push && git push origin v${cache.version}`))

	// Tidy up.
	.then(() => {
		process.stdout.write(`\n\n[Done!]\n`);
	})
	.catch(err => {
		process.stderr.write(`\n\n[Error!]\n`);

		if ((err.stderr || ``).match(/Git working directory not clean/i)) {
			process.stderr.write(`Git working directory not clean! You must commit all your changes.\n`);
		}
		else {
			process.stderr.write(`${err.stack}\n`);
		}

		process.stderr.write(`\n`);
	});
