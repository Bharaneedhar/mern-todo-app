import { useState } from "react";
import { useEffect } from "react";
export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const[todos,setTodos]= useState([]);
    const[error,setError]= useState([]);
    const[message,setMessage]= useState([]);
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
    return <>
    <div className ="row p-3 bg-success text-light">
        <h1>Todo Project with MERN stack</h1>
    </div>
    <div className = "row">
        <h3>Add Item</h3>
        {message && <p className = "text-success">{message}</p>} 
        <div className ="form-group d-flex gap-2">
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" type = "text"></input>
            <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}    className="form-control" type = "text"></input>
            <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className = "text-danger">{error}</p>}
    </div>
    <div className = "row">
        <h3>Tasks</h3>
        <ul className="list-groups">
            {
                todos.map((item)=><li className="list-group-item bg-info bg-green-100 d-flex justify-content-between align-items-center my-2">
                <div className="d-flex flex-column">
                    <span className ="fw-bold">{item.title}</span>
                    <span className ="fw-bold">{item.description}</span>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-warning">Edit</button>
                    <button className="btn btn-danger">Delete</button>
                </div>
            </li>
            )}
            
        </ul>
    </div>
    </>
}