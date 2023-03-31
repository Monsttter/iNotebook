import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState= (props)=>{
    const s1= {
        "name": "Rahul",
        "class": "10E"
    }

    const [state, setState]= useState(s1);

    const update= ()=>{
        setTimeout(() => {
            setState({name: "Ayush", class:"9A"});
        }, 1000);
    }
    return (
        <NoteContext.Provider value={{state, update}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;