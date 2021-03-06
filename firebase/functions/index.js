const functions = require('firebase-functions');
const fetch = require('node-fetch')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function createTask(taskTitle, taskTime, token = "00aee294bc9798d251cbbbe9d0f245451794aca6") {
    commands = [{"type": "item_add", "args": {"content": taskTitle, "due": { "string": taskTime, "lang": "en" } }, "uuid":uuid(), "temp_id":uuid()}];
    console.log(JSON.stringify(commands))
    return fetch("https://todoist.com/api/v8/sync", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            commands: commands,
            token: token
        })
    }).then(response=> {
        if (response.ok)
            return response.json()
        else
            throw new Error(response.status + " " + JSON.stringify(response))
    }).then(result=>{
        return result
    }).catch(error=>{
        throw error
    });
}

createTask("testTitle", "10 am").then(result=>console.log(result)).catch(error=>console.log(error))

exports.createTask = functions.https.onRequest((request, response) => {
    createTask(request.body.taskTitle, request.body.taskTime, request.body.token).then(result=>{
        response.json(result);
    }).catch(error=>{
        response.status(500).json(error);
    });
});
