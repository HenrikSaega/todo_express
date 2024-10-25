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
    let error = null
    if(req.body.task.trim().length === 0){
        error = 'Please insert correct task data'
        console.log('Please insert correct task data')
    }else{
        readFile('./tasks.json')
        .then(tasks =>{
            let index
            if(tasks.length === 0)
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
            console.log(newTask)
            tasks.push(newTask);
            const data = JSON.stringify(tasks, null, 2)
            writeFile('tasks.json', data)
            res.redirect('/')
        });
    }
});



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
        data = JSON.stringify(tasks, null, 2)
        writeFile('tasks.json', data)
        res.redirect('/')
    })
})

app.get('/delete-tasks', (req, res) => {
    tasks = []
    const data = JSON.stringify(tasks, null, 2)
    writeFile('./tasks.json', data)
    res.redirect('./')
})


app.listen(3001, () => {
    console.log('Server has started http://localhost:3001/')
});