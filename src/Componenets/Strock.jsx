import React, { useState } from 'react'

const Strock = ({rectangles,setrectangles,selectedshape,shapes,setshapes,circles,setCircles}) => {
  const [strock,setstrock]=useState(false)
  const [strockcolor,setstrockcolor]=useState()
  const [strockwidth,setstrockwidth]=useState(0)

  function hadlestrockwidth(e){
    setstrockwidth(parseFloat(e.target.value))
    const newrects =rectangles.map(rec=>{
        if(rec.id===selectedshape){
            return{...rec,strockwidth:strockwidth}
        }else{
            return rec
        }
    }
    )
    const newshapes=shapes.map(shape=>{
        if(shape.id===selectedshape){
            return {...shape,strockwidth:strockwidth}
        }else{
            return shape
        }
    })
    const newcircles=circles.map(cir=>{
        if(cir.id===selectedshape){
            return {...cir,strockwidth:strockwidth}
        }else{
            return cir
        }
    })
    setCircles(newcircles)
    setshapes(newshapes)
    setrectangles(newrects)
    
  }
  function handlestrockcolor(e){
    setstrockcolor(e.target.value)
    const newrects =rectangles.map(rec=>{
        if(rec.id===selectedshape){
            return{...rec,strockcolor:strockcolor}
        }else{
            return rec
        }
    }
    )
    const newshapes=shapes.map(shape=>{
        if(shape.id===selectedshape){
            return {...shape,strockcolor:strockcolor}
        }else{
            return shape
        }
    })
    const newcircles=circles.map(cir=>{
        if(cir.id===selectedshape){
            return {...cir,strockcolor:strockcolor}
        }else{
            return cir
        }
    })
    setCircles(newcircles)
    setshapes(newshapes)
    setrectangles(newrects)
  }

  
  
    return (
    <>
        <button onClick={()=>setstrock(!strock)} >Strock </button>
        {strock && (
        <>
            <div style={{
                display:'flex',
                alignItems:'center',
            }}>
                <p>strock width:</p>
                <input type='range' onChange={hadlestrockwidth} min={0} max={11} step={0.1} value={strockwidth}/> 
            </div>
            <div style={{
                display:'flex',
                alignItems:'center',
            }}>
                <p>strock color:</p>
                <input type='color' value={strockcolor} onChange={handlestrockcolor}/>

            </div>
            
        </>
        ) 
        }
    </>
    )
}

export default Strock