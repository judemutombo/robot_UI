import React, { useEffect, useRef, useState } from 'react';
import SimpleTask from './SimpleTask';
import { clientStore } from '../store/clientStore';
import toast from 'react-hot-toast';

const Task = (props) => {
    const {sendTask, mapping, locations} = clientStore()
    const [zones, setZones] = useState([])
    const [selected, setSelected] = useState("")
    const [task, setTask] = useState("")
    const [params, setparams] = useState([])
    const [lcs, setLcs] = useState(false)
    const ref = useRef()
    const selection = (name) => {
        setSelected(name)
    }
    useEffect(()=> {
        setZones([])
        console.log(locations)
        if (!(locations == null)){
            locations.forEach(element => {
                setZones([...zones, <SimpleTask name={element.location} selection = {selection} selected={selected == element.location} key={element.location}/>])
            }); 
            setLcs(locations.length > 0)
        }
        
        
    }, [locations])
    const set = () => {
        if (params.length == 6) return toast.error("You can't load and unload more than 6 times")
            
        if (selected == "") return toast.error("Select a zone")
        let type = ref.current.value == "Loading" ? "L" : "U"
        if (type == "U"){
            let param = params[params.length - 1];

            if (param){
                let key = Object.keys(param)[0]
                if(param[key] != "Loading"){
                    return toast.error("You can't unload without loading")

                }
                else if (key == selected){
                    return toast.error("You can't unload from a zone you've loaded from")
                }
            }else{
                return toast.error("You need to load first")
            }
        }
        setTask(`${task}${selected}(${type}) -> `)
        setparams([...params, {[selected]: ref.current.value}])
        setSelected("")
    }
    const send = () => {
        if(params.length == 0) return toast.error("No task to send")
    }
    return (
        <div className="w-full h-full px-5 pt-5 relative">
            <button className='w-full  h-12 bg-slate-400  text-white' onClick={mapping}>Mapping</button>
            <input className='w-full  h-12 bg-white mt text-black px-5 outline-none mt-8' type="text" value={task} name="task" id="task" placeholder='Task display' disabled/>
            { !lcs ? <></> : 
                <div className='mt-4 w-full'>
                <p>Select a zone and choose a task type</p>
                <div className='grid grid-cols-4 gap-4 mt-4'>
                    {zones}
                </div>
                <select name="taskType" className='mt-4 w-full  h-12 px-5 outline-none' id="taskType" ref={ref}>
                    <option value="Loading">Loading</option>
                    <option value="Unloading">Unloading</option>
                </select>
                <button className='w-full  h-12 bg-slate-400  text-white mt-4' onClick={set}>Set</button>
            </div>
            }
            
            <div className='w-full  h-12  absolute bottom-2 left-0 px-5'>
                <button className='w-full  h-full bg-slate-400  text-white'>Send task</button>
            </div>
        </div>
    );
};

export default Task;
