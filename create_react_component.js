#!/usr/bin/node

var fs = require('fs');

const PACKAGE_JSON_FILEPATH = './package.json'



function generateBuildCommand(component_name) {

    return "npx tsc react_components/"
        + component_name
        + "/src/index.tsx --jsx react; browserify react_components/"
        + component_name
        + "/src/index.js > react_components/"
        + component_name
        + "/build/index.js"
}

function createBuildScript(COMPONENT_NAME) {


    var file_data = fs.readFileSync(PACKAGE_JSON_FILEPATH)

    var pkg = JSON.parse(file_data.toString('utf8'));

    if (typeof pkg["scripts"]["react:build:" + COMPONENT_NAME] === 'undefined') {

        pkg["scripts"]["react:build:" + COMPONENT_NAME] = generateBuildCommand(COMPONENT_NAME);
        console.log("Generated build command!")
        console.log("You may build your component with:")
        console.log("\t npm run react:build:" + COMPONENT_NAME);

        fs.writeFileSync(PACKAGE_JSON_FILEPATH, JSON.stringify(pkg));


    } else {

        console.error("error: A component with this name already exists");

    }
}


function removeBuildScript(COMPONENT_NAME) {

    var file_data = fs.readFileSync(PACKAGE_JSON_FILEPATH);

    var pkg = JSON.parse(file_data.toString('utf8'));

    if (typeof pkg["scripts"]["react:build:" + COMPONENT_NAME] !== 'undefined') {
        delete pkg["scripts"]["react:build:" + COMPONENT_NAME];

        fs.writeFileSync(PACKAGE_JSON_FILEPATH, JSON.stringify(pkg))
        
        console.log("Build script for " + COMPONENT_NAME + " has been deleted");

    } else {
        console.error("error: Cannot remove " + COMPONENT_NAME + ". No such component exists.");
    }


}

const action = process.argv[2];

const component = process.argv[3];

if (typeof action === 'undefined') {
    console.error("error: No action defined")
    process.exit(1);
}

if (typeof component == 'undefined') {
    console.error("error: You must specify the component")
    process.exit(1);
}

switch(action) {

    case "create":
        createBuildScript(component);
    break;
    case "remove":
        removeBuildScript(component);
    break;
    default:
        console.error("error: Unknown action: " + action);

}
