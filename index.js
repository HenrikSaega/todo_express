const express = require('express');
const app = express();
const fs = require('node:fs');
const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));

const readFile = (filename) => {
    return new Promise((resolve, reject) =>{
        fs.readFile(filename, "utf8", (err, data)=>{
            if(err)
            {
                console.error(err);
                return;
            } 
            const tasks = JSON.parse(data)
            resolve(tasks);
            // kui tasks.json on tühi, siis lisab sinna kaldsulud, et vältida errorit!
            if(data.trim()=== "")
            {
                fs.writeFile(filename, "[]", utf8)
            } 
        });
    });
};

const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, 'utf-8', err => {
            if (err) {
                console.log(err)
                return
            }
            resolve(true)
        })
    })
}


app.get('/', (req, res) => {
    readFile('./tasks.json')
    .then(tasks => {
        res.render('index',{
        tasks: tasks,
        error: null
        });
    });
});

app.post('/', (req, res) => {
    let task = req.body.task
    let error = null
    if(req.body.task.trim().length == 0){
        error = 'Please insert correct task data'
        readFile('./tasks.json')
        .then(tasks =>{
            res.render('index', {
                tasks: tasks,
                error: error
            })
        })
    }
    else{
    readFile('./tasks.json')
    .then(tasks =>{
        let index
        if(tasks.length == 0)
        {
            index = 1
        }
        else
        {
            index = tasks[tasks.length-1].id +1; 
        }
        const newTask = { 
            "id" : index,
            "task" : req.body.task
        }
        tasks.push(newTask);
        data = JSON.stringify(tasks, null, 2)
        writeFile('tasks.json', data)
        res.redirect('/')
    })
    }
})


app.post('/', (req, res) => {
    console.log("Form sent data");
    let task = req.body.task;   
});

app.get('/delete-task/:taskId', (req, res) => {
    let deletedTaskId = parseInt(req.params.taskId)
    console.log(deletedTaskId)
    readFile('./tasks.json')
    .then(tasks => {
        tasks.forEach((task, index) => {
            if(task.id === deletedTaskId){
                tasks.splice(index, 1) 
            }
        });
        const data = JSON.stringify(tasks, null, 2)
        writeFile('tasks.json', data)
        res.redirect('/')

        // kui tasks.json on tühi, siis lisab sinna kaldsulud, et vältida errorit!
        if(data.trim()=== "")
        {
            fs.writeFile(filename, "[]", utf8)
        } 
    })
})

app.get('/delete-tasks', (req, res) => {
    tasks = []
    const data = JSON.stringify(tasks, null, 2)
    writeFile('./tasks.json', data)
    res.redirect('/')

    // kui tasks.json on tühi, siis lisab sinna kaldsulud, et vältida errorit!
    if(data.trim()=== "")
    {
        fs.writeFile(filename, "[]", utf8)
    }
})

app.get('/update-task/:taskId', (req, res) => {
    let updateTaskId = parseInt(req.params.taskId)
    readFile('./tasks.json')
    .then(tasks => {
        let updateTask;
        tasks.forEach((task) =>{
            if(task.id === updateTaskId){
                updateTask = task.task;
            }
        })
        res.render('update',{
            updateTask: updateTask,
            updateTaksId: updateTaskId,
            error: null
        })
        console.log("Current task in process of update => " + JSON.stringify(tasks[updateTaskId-1]))
    })
})
app.get('/update-task', (req, res) => {
    console.log(req.body)
    let updateTaskId = parseInt(req.body.taskId)
    let updateTask = req.body.task
    let error = null
    if(updateTask.trim().length === 0){
        error = 'Please insert correct task data'
        res.render('update',{
            updateTask: updateTask,
            updateTaskId: updateTaskId,
            error: error
        })
    }
    else{
        readFile('/tasks.json')
        .then(tasks => {
            tasks.forEach((task, index) => {  
                if(task.id === updateTaskId){
                    tasks[index].task = updateTask
                }
            })
        })
        console.log(tasks)
        const data = JSON.stringify(tasks, null, 2)
        writeFile('tasks.json', updateTask)
        res.redirect('/')
    }
})

app.listen(3001, () => {
    console.log('Server has started http://localhost:3001/')
});