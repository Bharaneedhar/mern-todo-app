import { useState } from "react";
import { useEffect } from "react";
export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const[todos,setTodos]= useState([]);
    const[error,setError]= useState([]);
    const[message,setMessage]= useState([]);
    const[editId, setEditId]= useState(-1);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const apiUrl = "http://localhost:8000";
    const handleSubmit = () => {
        setError("");
        // check logic
        if(title.trim() !==''&& description.trim() !=='') {
            fetch(apiUrl+"/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            }).then((response) => {
                if(response.ok){
                    setTodos([...todos, {title, description}]);
                    setMessage("Item added sucessfully");
                    setTimeout(() => {setMessage("")}, 3000);
                    setTitle("");
                    setDescription("");
                }
                else{
                    setError("Failed to add todo item");
                }
            }).catch((error)=>{
                setError("Error: "+ error.message);
            })
        }
    }
    useEffect(()=>{
        getItems()
    },[])
    const getItems=()=>{
        fetch(apiUrl+"/todos").then((response)=>{
            response.json().then((response)=>{
                setTodos(response);
            })
        })
    }
    const handleEdit=(item)=>{
       setEditId(item._id);
       setEditTitle(item.title); 
       setEditDescription(item.description)
    }

    const handleUpdate = () => {
        setError("");
        // check logic
        if(editTitle.trim() !==''&& editDescription.trim() !=='') {
            fetch(apiUrl+"/todos/"+editId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: editTitle, description: editDescription }),
            }).then((response) => {
                if(response.ok){
                    //UPDATE ITEM TO LIST
                    const updatedTodos = todos.map((item)=>{
                        if(item._id == editId){
                            item.title= editTitle;
                            item.description= editDescription;
                        }
                        return item;
                    })
                    setTodos(updatedTodos);
                    setMessage("Item updated successfully");
                    setTimeout(() => {setMessage("")}, 3000);
                    setTitle("");
                    setDescription("");
                    setEditId(-1);
                }
                else{
                    setError("Failed to update todo item");
                }
            }).catch((error)=>{
                setError("Error: "+ error.message);
            })
        }
    }

    const handleEditCancel=()=>{
        setEditId(-1);
    }

    const handleDelete= async(id)=>{
        if(window.confirm("Are you sure you want to delete this item?")){
            fetch(apiUrl+"/todos/"+id, {
                method: "DELETE",
            }).then((response) => {
                if(response.ok){
                    const updatedTodos = todos.filter((item) => item._id !== id);
                    setTodos(updatedTodos);
                    setMessage("Item deleted successfully");
                    setTimeout(() => {setMessage("")}, 3000);
                }
                else{
                    setError("Failed to delete todo item");
                }
            }).catch((error)=>{
                setError("Error: "+ error.message);
            })
        }
    }
    return <>
    <div className ="row p-3 bg-success text-light">
        <h1>Todo Project with MERN stack</h1>
    </div>
    <div className = "row">
        <h3  className="text-start ms-4">Add Item</h3>
        {message && <p className = "text-success">{message}</p>} 
        <div className ="form-group d-flex gap-2 col-md-6 ms-4 mb-3">
            <input className="form-control ms-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" type = "text"></input>
            <input className="form-control w-50" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}    className="form-control" type = "text"></input>
            <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className = "text-danger">{error}</p>}
    </div>
    <div className = "row">
        <h3 className="text-start ms-4">Tasks</h3>
        <div className="col-md-6">
            <ul className="list-groups">
            {
                todos.map((item)=><li className="list-group-item bg-info bg-green-100 d-flex justify-content-between align-items-center my-2">
                <div className="d-flex flex-column me-2 text-start w-100">
                    {
                        editId == -1 || editId !== item._id ? <>
                        <span className ="fw-bold">{item.title}</span>
                        <span className ="fw-bold">{item.description}</span>
                        </> : <>
                       <div className ="form-group d-flex gap-2">
                            <input placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="form-control" type = "text"></input>
                            <input placeholder="Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}    className="form-control" type = "text"></input>
                        </div>
                        </>
                    }
                    
                </div>
                <div className="d-flex gap-2">
                    {editId == -1 || editId !== item._id ? <button className="btn btn-warning" onClick={()=> handleEdit(item)}>Edit</button> :  <button className="btn btn-warning" onClick={handleUpdate}>Update</button> } 

                    {editId == -1 ? <button className="btn btn-danger" onClick={()=> handleDelete(item._id)}>Delete</button> :
                    <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}

                </div>
            </li>
            )}
            
            </ul>
        </div>
       
    </div>
    </>
}