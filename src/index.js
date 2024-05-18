const path = require("path");
const fg = require("fast-glob");
const util = require("./util");
const { execSync } = require("child_process");

// SDP expressions:
// I = Fan-out / (Fan-in + Fan-out)
function sdpComputed(_out, _in) {
  return _out / (_out + _in);
}

// The scoring text is determined based on the I(instable) value
function getInstableLabel(s) {
  if (s < 0.2) {
    return "Stable";
  } else if (s < 0.6) {
    return "Normal";
  } else if (s < 0.8) {
    return "Flexible";
  } else {
    return "Instable";
  }
}

// To analyze the local pacakge, such as ./package-a
function analyzeLocalPackages(packagePath) {
  const packageJson = require(require.resolve("./package.json", {
    paths: [packagePath],
  }));

  const dependencyMap = fg
    .sync(
      packageJson.workspaces.map((v) => v + "/*.json"),
      { cwd: packagePath }
    )
    .map((subpackage) => {
      const subPackageJson = path.resolve(packagePath, subpackage);
      const json = require(subPackageJson);
      const name = json.name;
      return {
        name,
        dependencies: json.dependencies,
      };
    });

  if (dependencyMap.length === 0) {
    throw new Error(
      "It seems that the 'subpackages' directory has not been found, please check the configuration of yarn workspaces.."
    );
  }

  const deps = dependencyMap.map((v) => {
    return {
      name: v.name,
      in: 1,
      out: v.dependencies ? Object.keys(v.dependencies).length : 0,
    };
  });

  deps.forEach((dep) => {
    dep.instable = sdpComputed(dep.out, dep.in);
    dep.label = getInstableLabel(dep.instable);
  });
}

// To analyze the remote npm package, such as react, vue, express, etc.
async function analyzeNpmPackage(packageName) {
  try {
    const output = execSync(
      `npm view ${packageName} dependencies --json`
    ).toString();

    const dependenciesObject = JSON.parse(output);
    const dependencies = Object.entries(dependenciesObject).map(
      ([name, version]) => ({
        name,
        version,
      })
    );
    const dep = {
      name: packageName,
      in: await util.dependants(packageName),
      out: dependencies.length,
    };

    dep.instable = sdpComputed(dep.out, dep.in);
    dep.label = getInstableLabel(dep.instable);

    return dep;
  } catch (error) {
    throw error;
  }
}

// Here is a entry point.
module.exports.analyze = async function startAnalyze(targetPackage) {
  if (util.isLocalPath(targetPackage)) {
    const localPath = path.join(process.cwd(), program.args[0]);
    analyzeLocalPackages(localPath);
  } else {
    // default to npm package
    const normalizedPackages = targetPackage.split(",");
    const deps = [];
    for (const packageName of normalizedPackages) {
      console.info(`Analyzing ${packageName}...`);
      try {
        const dep = await analyzeNpmPackage(packageName);
        deps.push(dep);
      } catch (error) {
        // to ignore failed package
        console.error(
          `😭 Analyze unsuccessfully, ${packageName} was ignored. The error reason is ${error.message}.`
        );
      }
    }
    console.info(`🎉 Analyze successfully.`);
    return deps;
  }
};
