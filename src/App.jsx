import { useState, useEffect } from 'react'
import { FaRegEdit } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';

function App() {
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);

  const [list, setList] = useState(() => {
    const savedList = localStorage.getItem("todo_list");
    return savedList ? JSON.parse(savedList) : [];
  });

  const [id, setId] = useState(() => {
    const savedId = localStorage.getItem("todo_id");
    return savedId ? Number(savedId) : 0;
  });

  useEffect(() => {
    localStorage.setItem("todo_list", JSON.stringify(list));
    localStorage.setItem("todo_id", id.toString());
  }, [list, id]);

  function handleChange(e) {
    setInput(e.target.value); 		
  }
	
  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return; 

    if (editId !== null) {
      setList(prevList =>
        prevList.map(todo =>
          todo.id === editId ? { ...todo, task: input.trim() } : todo
        )
      );
      setEditId(null);
      setInput("");
      return;
    }

    const updatedList = [...list, { task: input.trim(), id: id, isCompleted: false }];
    setList(updatedList);
    setId(prevId => prevId + 1);
    setInput("");
  }	
	
  function handleCheckbox(id) {
    setList(prevList => 
      prevList.map(todo => 
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  }

  function handleEdit(task, id) {
    setInput(task);
    setEditId(id);
  }

  function handleDelete(id) {
    setList(list.filter(todo => todo.id !== id));
    if (editId === id) {
      setEditId(null);
      setInput("");
    }
  }

  //  Clears all tasks from list and resets input states
  function handleClearAll() {
    const confirmClear = window.confirm("Are you sure you want to delete all tasks?");
    if (confirmClear) {
      setList([]);
      setEditId(null);
      setInput("");
    }
  }

  return (
    <div className='m-0 p-0 box-border w-full h-screen fixed text-white flex flex-col items-center bg-linear-to-tr from-slate-900 via-slate-700 to-slate-400 overflow-hidden'>
      <div className='w-full max-w-2xl h-full flex flex-col p-4 md:p-6'>
        
        <h1 className='text-center mt-2 mb-4 font-extrabold text-white text-3xl select-none'>
          TODO
        </h1>
        
        <form className='z-10 h-16 flex items-center w-full bg-white/10 border border-white/20 rounded-2xl overflow-hidden backdrop-blur-3xl shrink-0' onSubmit={handleSubmit}>
          <input 
            onChange={handleChange}
            value={input}
            type="text" 
            className='border-none outline-none text-xl text-amber-100 grow h-full font-semibold p-4 placeholder-white/40' 
            placeholder={editId !== null ? "Edit your item..." : "Add TODO item here..."}
          />
          <button 
            type="submit"
            className='bg-pink-500 hover:bg-pink-600 text-white font-bold h-full w-[25%] sm:w-[20%] text-xl transition-all cursor-pointer shrink-0'
          >
            {editId !== null ? "Save" : "Add"}
          </button>
        </form>

        <div className='flex-1 overflow-y-auto mt-6 pr-1 space-y-4 pb-4 custom-scrollbar'>
          {list.length === 0 ? (
            <div className="flex justify-center pt-12">
              <span className="text-lg md:text-xl font-semibold tracking-wide text-white bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 shadow-sm select-none">
                ✨ Add your first TODO
              </span>
            </div>
          ) : (
            list.map((item) => (
              <div 
                className='flex backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl p-3 px-4 justify-between items-center shadow-md hover:bg-white/10 transition-all'  
                key={item.id}
              >
                <input 
                  type="checkbox" 
                  className="w-7 h-7 rounded-full appearance-none bg-transparent border-2 border-slate-400 checked:bg-slate-800 checked:border-slate-800 hover:scale-105 hover:cursor-pointer transition-all flex items-center justify-center after:content-['✓'] after:text-white after:text-sm after:hidden checked:after:block shrink-0" 
                  onChange={() => handleCheckbox(item.id)} 
                  checked={item.isCompleted}
                />
                
                <span className={`px-4 grow text-xl md:text-2xl font-medium break-all ${item.isCompleted ? 'line-through text-slate-400/70' : 'text-white'}`}>
                  {item.task} 
                </span>
                
                <div className="flex items-center space-x-2.5 select-none shrink-0">
                  <button 
                    onClick={() => handleEdit(item.task, item.id)}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm transition-all duration-200 hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                    title="Edit Task"
                  >
                    <FaRegEdit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 shadow-sm transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/40 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                    title="Delete Task"
                  >
                    <FaXmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        
        {list.length > 0 && (
          <div className="flex justify-end pt-2 pb-4 shrink-0 select-none">
            <button 
              onClick={handleClearAll}
              className="text-sm font-semibold tracking-wide bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 px-5 py-2.5 rounded-xl backdrop-blur-md shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              Clear All Tasks
            </button>
          </div>
        )}

      </div> 
    </div>
  )
}

export default App;
