import React, { useState } from 'react'

const TextConf = ({TextConfClicked,
      setTextConfClicked,
      textpanelcolor,
      textpanelopacity,
      settextpanelcolor,
      settextpanelopacity,
      panelLine,
      setpanelLine
    
    }) => {
  

  function handleTextConfClick(){
    setTextConfClicked(!TextConfClicked);
  }
  function handlepanelopacity(e){
    settextpanelopacity(e.target.value)
  }
  return (
    <>
    <button onClick={handleTextConfClick}>TextPanel</button>
    {TextConfClicked&&(
      <>
      <input type='color' value={textpanelcolor} onChange={(e)=>settextpanelcolor(e.target.value)}/>
      <input type='range' value={textpanelopacity} min={0} max={1} step={0.01} onChange={handlepanelopacity}/>
      <button onClick={()=>setpanelLine(!panelLine)}> {`${panelLine?'remove':'apply'}`} Line </button>

      </>

    )}
    
    </>
  )
}

export default TextConf