// Express server setup
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

//let todos =[];

// connecting mongoose
mongoose.connect('mongodb://localhost:27017/todoDB')
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch((err)=>{
    console.error('Error connecting to MongoDB', err);
});

const todoSchema = new mongoose.Schema({
    title:{
        required : true,
        type : String
    },
    description: {
        required : true,
        type :String
    }
});

const todoModel = mongoose.model('Todo', todoSchema);
app.post('/todos', async(req, res) => {
   const {title, description } = req.body;
   try{
   const newTodo = new todoModel({title, description});
   await newTodo.save();
   res.status(201).send('Todo item created');
   }catch(err){
    console.error('Error creating todo item', err);
    return res.status(500).send('Internal Server Error');
   }

})

// Get all todo items
app.get('/todos', async(req,res)=>{
    try{
       const todos = await todoModel.find();
       res.json(todos);
    }
    catch(err){
        console.error('Error fetching todo items', err);
        return res.status(500).send('Internal Server Error');
    }
})

// Update todo item by ID
app.put('/todos/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const {title, description} = req.body;
        const updatedTodo = await todoModel.findByIdAndUpdate(id, {title, description});
        if(!updatedTodo){
            return res.status(404).send('Todo item not found');
        }
        res.json(updatedTodo);
        console.log('Todo item updated successfully');
    }catch(err){
        console.error('Error updating todo item', err);
        return res.status(500).send('Internal Server Error');
    }
});

// Delete todo item by ID
app.delete('/todos/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const deletedTodo = await todoModel.findByIdAndDelete(id);
        if(!deletedTodo){
            return res.status(404).send('Todo item not found');
        }
        res.json(deletedTodo);
        console.log('Todo item deleted successfully');
    }catch(err){
        console.error('Error deleting todo item', err);
        return res.status(500).send('Internal Server Error');
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});