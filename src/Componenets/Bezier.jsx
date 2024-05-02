import React, { useState , useEffect} from 'react';
import { Stage, Layer, Line, Circle,Text } from 'react-konva';



const BezierCurveCreator = ({
  shapes,
  X,
  Y,
  transformerRef,
  selectedid,
  setselectedid,
  currentPoints,
  setCurrentPoints,
  selectedidhover,
  setselectedidhover,
  onshape,
  setonshape,
  showmode,
  opacity,
  setopacity
}) => {
  
  useEffect(() => {
    if (selectedid != null && transformerRef.current) {
      const selectedShape = shapes.find(shape => shape.id === selectedid);
      if (selectedShape && selectedShape.ref && selectedShape.ref.current) {
        transformerRef.current.nodes([selectedShape.ref.current]);
      } else {
        transformerRef.current.nodes([]);
      }
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedid, shapes]);
  



  function handlebezier(shape){
    setselectedid(shape.id);
    
  }
  
  function handleenterbez(id){
    if (showmode){
      setonshape(false)
    }
    else{
      setonshape(true)
    };
    setselectedidhover(id);
    
    
    
  }
  function handleleavebez(){
    setonshape(false)
    
  }

  
  

  return (
    <>
      
      
      
          {shapes.map((shape) => (
            <Line
              key={shapes.indexOf(shape)}
              points={shape.points}
              stroke="red"
              strokeWidth={4}
              fill="lightblue"
              opacity={shape.opacity}
              closed={true}
              tension={0.5}
              bezier={false}

              
              ref={node => { shape.ref = node; }} // Keep a ref in each shape
              draggable
              onClick={()=>handlebezier(shape)}
              onMouseEnter={()=>handleenterbez(shape.id)}
              onMouseLeave={()=>handleleavebez()}
              
            />
          ))}
          {/* Draw current shape being created */}
          <Line
            points={currentPoints}
            stroke="red"
            strokeWidth={4}
            tension={0.5}
            bezier={true}
            
            
          />
          {currentPoints.map((_, index) => (
            index % 2 === 0 && (
              <Circle
                key={index}
                x={currentPoints[index]}
                y={currentPoints[index + 1]}
                radius={5}
                fill="blue"
                draggable
                onDragMove={(e) => {
                  const newPoints = currentPoints.slice();
                  newPoints[index] = e.target.x();
                  newPoints[index + 1] = e.target.y();
                  setCurrentPoints(newPoints);
                }}
                onClick={()=>console.log(selectedid)}
              />
            )
          ))}
          

          

     
    </>
  );
};

export default BezierCurveCreator;
