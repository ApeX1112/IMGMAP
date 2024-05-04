import React, { useState } from 'react'

const TextConf = () => {
  const [TextConfClicked,setTextConfClicked]=useState(false);
  const [textpanelcolor,settextpanelcolor]=useState('#000');
  const [textpanelopacity,settextpanelopacity]=useState(0.5);

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
      <input type='color' value={textpanelcolor}/>
      <input type='range' value={textpanelopacity} min={0} max={1} step={0.01} onChange={handlepanelopacity}/>

      </>

    )}
    
    </>
  )
}

export default TextConf