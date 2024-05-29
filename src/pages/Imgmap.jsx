import React from 'react'

import useImage from 'use-image';
import { TbRectangle } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
import {
  Arrow,
  Circle,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
  Image as KonvaImage,
} from "react-konva";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from "./constants";
import BezierCurveCreator from '../Componenets/Bezier';
import Strock from '../Componenets/Strock';
import TextConf from '../Componenets/TextConf';
import '../App.css'

const Imgmap = () => {
  const [images, setImages] = useState([]);
  const [imageProperties, setImageProperties] = useState([]);
  const [konvaImages, setKonvaImages] = useState([]);
  
    const [stageRefs, setStageRefs] = useState([[React.createRef()]]);
    const [action, setAction] = useState(ACTIONS.SELECT);
    const [fillColor, setFillColor] = useState("#ff0000");
    const [rectangles, setRectangles] = useState([]);
    const [circles, setCircles] = useState([]);
    const [arrows, setArrows] = useState([]);
    const [scribbles, setScribbles] = useState([]);
  
    const strokeColor = "black";
    const isPaining = useRef();
    const currentShapeId = useRef();
    const transformerRef = useRef();
    const [Y,setY]=useState(0)
    const [X,setX]=useState(0)
    const [selectedshape,setselectedshape]=useState(null); 
  
    const [opacity,setopacity]=useState(1)
  
    
    const [onshape,setonshape]=useState(false)
    
    const isImageDraggable = action===ACTIONS.SELECT
    const isDraggable = action === ACTIONS.SELECT;
  
    
    const[selectedshapehover,setselectedshapehover]=useState(null)
  
    const[showmode,setshowmode]=useState(false)
  
  
    const [shapes, setShapes] = useState([]);
    const [currentPoints, setCurrentPoints] = useState([]);
  
    const [TextConfClicked,setTextConfClicked]=useState(false);
    const [textpanelcolor,settextpanelcolor]=useState('black');
    const [textpanelopacity,settextpanelopacity]=useState(0.5);
    const [panelLine,setpanelLine]=useState(true);
  
    const handleImageUpload = (event) => {
      const files = event.target.files;
      const newImages = [];
      const newImageProperties = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new window.Image();
          img.src = e.target.result;
          img.onload = () => {
            newImages.push(img);
            newImageProperties.push({ x: 50, y: 50, width: 200, height: 200, scaleX: 1, scaleY: 1, rotation: 0 });
            if (newImages.length === files.length) {
              setImages(prevImages => [...prevImages, ...e.target.result]);
              setKonvaImages(prevKonvaImages => [...prevKonvaImages, ...newImages]);
              setImageProperties(prevProps => [...prevProps, ...newImageProperties]);
            }
          };
        };
        reader.readAsDataURL(file);
      });
    };
  
    const handleDragEnd = (index, e) => {
      const newImageProperties = [...imageProperties];
      newImageProperties[index] = {
        ...newImageProperties[index],
        x: e.target.x(),
        y: e.target.y(),
      };
      setImageProperties(newImageProperties);
    };
  
    const handleTransformEnd = (index, e) => {
      const node = e.target;
      const newImageProperties = [...imageProperties];
      newImageProperties[index] = {
        ...newImageProperties[index],
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
        rotation: node.rotation(),
      };
      setImageProperties(newImageProperties);
    };
    const handleSelectImage = (e) => {
      
      if (transformerRef.current) {
        transformerRef.current.nodes([e.target]);
        transformerRef.current.getLayer().batchDraw();
      }
      
    }
  
    function onPointerDown(index) {
      
      if (action === ACTIONS.SELECT) return;
  
      const stage = stageRefs[index].current;
      const { x, y } = stage.getPointerPosition();
      const id = uuidv4();
  
      currentShapeId.current = id;
      isPaining.current = true;
  
      switch (action) {
        case ACTIONS.RECTANGLE:
          setRectangles((rectangles) => [
            ...rectangles,
            {
              id,
              stageid:currentIndex,
              x,
              y,
              height: 20,
              width: 20,
              fillColor,
              opacity,
              Text:'',
              strockwidth:0,
              strockcolor:'black',
            },
          ]);
          break;
          
  
        case ACTIONS.CIRCLE:
          setCircles((circles) => [
            ...circles,
            {
              id,
              x,
              y,
              radius: 20,
              fillColor,
              opacity,
              Text:'',
              strockwidth:0,
              strockcolor:'black',
              
            },
          ]);
          break;
  
        case ACTIONS.ARROW:
          setArrows((arrows) => [
            ...arrows,
            {
              id,
              points: [x, y, x + 20, y + 20],
              fillColor,
            },
          ]);
          break;
        case ACTIONS.SCRIBBLE:
          setScribbles((scribbles) => [
            ...scribbles,
            {
              id,
              pointsscrib: [x, y],
              fillColor,
            },
          ]);
        case ACTIONS.BEZIER:
          setCurrentPoints(cup=>[...cup,x,y]);
          
          break;
      }
    }
    function onPointerMove(index) {
      if (action === ACTIONS.SELECT || !isPaining.current) return;
  
      const stage = stageRefs[index].current;
      const { x, y } = stage.getPointerPosition();
  
      switch (action) {
        case ACTIONS.RECTANGLE:
          setRectangles((rectangles) =>
            rectangles.map((rectangle) => {
              if (rectangle.id === currentShapeId.current) {
                return {
                  ...rectangle,
                  width: x - rectangle.x,
                  height: y - rectangle.y,
                };
              }
              return rectangle;
            })
          );
          break;
        case ACTIONS.CIRCLE:
          setCircles((circles) =>
            circles.map((circle) => {
              if (circle.id === currentShapeId.current) {
                return {
                  ...circle,
                  radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
                };
              }
              return circle;
            })
          );
          break;
        case ACTIONS.ARROW:
          setArrows((arrows) =>
            arrows.map((arrow) => {
              if (arrow.id === currentShapeId.current) {
                return {
                  ...arrow,
                  points: [arrow.points[0], arrow.points[1], x, y],
                };
              }
              return arrow;
            })
          );
          break;
        case ACTIONS.SCRIBBLE:
          setScribbles((scribbles) =>
            scribbles.map((scribble) => {
              if (scribble.id === currentShapeId.current) {
                return {
                  ...scribble,
                  pointsscrib: [...scribble.pointsscrib, x, y],
                };
              }
              return scribble;
            })
          );
          break;
      }
    }
  
    function onPointerUp() {
      isPaining.current = false;
    }
  /*error in exporting */ 
    function handleExport() {
      const uri = stageRef.current.toDataURL();
      var link = document.createElement("a");
      link.download = "image.png";
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
  
    function onClick(e,key,color) {
      if (action !== ACTIONS.SELECT) return;
      const target = e.currentTarget;
      transformerRef.current.nodes([target]);
      setselectedshape(key);
      setFillColor(color);
      const rect=rectangles.find(rect=>rect.id===key);
      setopacity(rect.Opacity);
  
      
      
      
      
    }
  
    function handleSlider(event){
      const newopacity=parseFloat(event.target.value);
      setopacity(newopacity);
      const newrects=rectangles.map(rec=>{
        if(rec.id===selectedshape){
          return {...rec,opacity:opacity};
  
        }else{
          return rec;
        }
      })
      const newcircles=circles.map(cir=>{
        if(cir.id===selectedshape){
          return {...cir,opacity:opacity};
  
        }else{
          return cir;
        }
      })
  
      const newshapes=shapes.map(shape=>{
        if(shape.id===selectedshape){
          return {...shape,opacity:opacity};
  
        }else{
          return shape;
        }
      })
      setRectangles(newrects);
      setShapes(newshapes);
      setCircles(newcircles);
    }
  
    function handlemouseenter(key){
      if (showmode){
        setonshape(false)
      }
      else{
        setonshape(true)
      };
      setselectedshapehover(key);
      
      
  
    }
  
    function handlemouseleave(){
      setonshape(false);
      
      
  
    }
    function handletextchange(e,rec){
      rectangles.find(rect=>rect.id===rec.id).Text=e.target.value;
      
      
  
    }
  
    function handleXY(e){
      setX(e.clientX);
      setY(e.clientY);
    }

    
    
  
    function handlecolor(e){
      setFillColor(e.target.value);
      const newrects=rectangles.map(rec=>{
        if(rec.id===selectedshape){
          return {...rec,fillColor:fillColor};
        }else{
          return rec;
        }
      })
      const newcircles=circles.map(cir=>{
        if(cir.id===selectedshape){
          return {...cir,fillColor:fillColor};
        }else{
          return cir;
        }
      })
      const newshapes=shapes.map(shape=>{
        if(shape.id===selectedshape){
          return {...shape,fillColor:fillColor};
        }else{
          return shape;
        }
      })
      setRectangles(newrects);
      setShapes(newshapes);
      setCircles(newcircles);
    }
  
  
    /*-----------------BEZIER CURVES ---------------------*/
    
  
    const handleCloseCurve = () => {
      
      if(action===ACTIONS.BEZIER || action===ACTIONS.SCRIBBLE || action===ACTIONS.SELECT){
        if (currentPoints.length >= 6) {
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          for (let i = 0; i < currentPoints.length; i += 2) {
            minX = Math.min(minX, currentPoints[i]);
            maxX = Math.max(maxX, currentPoints[i]);
            minY = Math.min(minY, currentPoints[i + 1]);
            maxY = Math.max(maxY, currentPoints[i + 1]);
          }
            // Check to ensure there are enough points for a curve
          const newShape = {
            width:-minX + maxX,
            x:(minX + maxX) / 2,
            y:(minY + maxY) / 2, //////////////////////////////////////////////
            id: uuidv4(),
            points: currentPoints,
            color: 'red',
            opacity,
            fillColor,
            text: '',
            strockwidth:0,
            strockcolor:'black'
          };
          setShapes([...shapes, newShape]);
          setCurrentPoints([]); 
          
        }
      }
    };
  
    const handleCanvasClick = (e) => {
      const { x, y } = e.target.getStage().getPointerPosition();
      if (action === ACTIONS.BEZIER) {
      setCurrentPoints([...currentPoints, x, y]);
    }
      
    };
  
    function handletextchangebezier(e,shape){
      shapes.find(shap=>shap.id===shape.id).Text=e.target.value;
    }
    function handletextchangecir(e,circle){
      circles.find(cir=>cir.id===circle.id).Text=e.target.value;
    }
    function deleteshape(e){
      const newrects=rectangles.filter(rec=>rec.id!==selectedshape)
      setRectangles(newrects)
      const newshapes=shapes.filter(shape=>shape.id!==selectedshape)
      setShapes(newshapes)
      const newcercles=circles.filter(cir=>cir.id!==selectedshape)
      setCircles(newcercles)
      const newarrows=arrows.filter(arr=>arr.id!==selectedshape)
      setArrows(newarrows)
    }
    
    const [stages, setStages] = useState([{ id: 1 }]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const STAGE_WIDTH = 2000;
    const STAGE_HEIGHT = 400;
    const addStage = () => {
      const newStage = { id: stages.length + 1 };
      setStages([...stages, newStage]);
      setCurrentIndex(stages.length);
      
      showStage(stages.length);
      setStageRefs((prevStageRefs) => [...prevStageRefs, React.createRef()]);
      console.log(stageRefs);
    };
  
    const showStage = (index) => {
      containerRef.current.style.transform = `translateX(-${index * STAGE_WIDTH}px)`;
    };
  
    const prevStage = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        showStage(currentIndex - 1);
      }
    };
  
    const nextStage = () => {
      if (currentIndex < stages.length - 1) {
        setCurrentIndex(currentIndex + 1);
        showStage(currentIndex + 1);
      }
    };
  /*-----------------------------------------------------
  
  
                            return 
  
  //
    ------------------------------------------------------*/
    return (
      <div onMouseMove={(e)=>handleXY(e)}>
        <div className="App">
          <input
            id="file-upload"
            type="file"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" className="btn btn-primary">
            Upload Image
          </label>
          
        </div>
        <div>
          <input type='range' min="0" max="1" step="0.01" value={opacity} onChange={handleSlider}>
  
  
          </input>
        </div>
        <button onClick={()=>setshowmode(!showmode)}>{showmode?'activate':'deactivate showmode'}</button>
  
        {showmode && rectangles.map(rec =>
            <div className="hover-panel" style={{
              display: 'block' ,
              position: 'relative',
              top: '10%', 
              left: '10%', 
              zIndex: 1000,
              padding: '10px',
              background: 'white',
              border: '1px solid black',
              borderRadius: '5px',
            }}>
              <div>
                <label> Text: </label>
                <input type='text'  onChange={(e)=>handletextchange(e,rec)}></input>
              </div>
              Shape ID: {rec.id}
            </div>
            )
  
          }
  
          {!showmode && onshape && rectangles.map(rec=>
          rec.id===selectedshapehover? 
          <>
          <div style={{
            position:'absolute',
            left:`${panelLine?rec.x+rec.width:X-100}px`,
            top:`${panelLine?rec.y:Y-(rec.Text.replace(/[^a-zA-Z]/g, '').length)/23*30 - 80}px`,
            padding:'10px',
            background:`${textpanelcolor}`,
            opacity:`${textpanelopacity}`,
            border:'1px solide black',
            width:'200px',
            borderRadius: '5px',
            zIndex:1000,
            textOverflow:'clip',
            overflowWrap:'break-word',
  
          }}>
            <p style={{color:'white'}}>{rec.Text}</p>
          </div>
          <svg style={{
            position:'absolute',
            left:'0',
            top:'0',
            width:'100%',
            height:'100%',
            pointerEvents:'none',
            zIndex:999
          }}>
            {panelLine && <line x1={X} y1={Y} x2={rec.x + rec.width + 10} y2={rec.y} stroke="black"></line>}
  
          </svg>
          
          </>:null
  
          )
  
          }
          {showmode && circles.map(circle =>
            <div className="hover-panel" style={{
              display: 'block' ,
              position: 'relative',
              top: '10%', 
              left: '10%', 
              zIndex: 1000,
              padding: '10px',
              background: 'white',
              border: '1px solid black',
              borderRadius: '5px',
            }}>
              <div>
                <label> Text: </label>
                <input type='text'  onChange={(e)=>handletextchangecir(e,circle)}></input>
              </div>
              Shape ID: {circle.id}
            </div>
            )
  
          }
          {!showmode && onshape && circles.map(circle=>
          circle.id===selectedshapehover? 
          <>
          <div style={{
            position:'absolute',
            left:`${circle.x+circle.radius}px`,
            top:`${circle.y}px`,
            padding:'10px',
            background:'Black',
            opacity:'50%',
            border:'1px solide black',
            borderRadius: '5px',
            zIndex:1000
  
          }}>
            <p style={{color:'white'}}>{circle.Text}</p>
          </div>
          <svg style={{
            position:'absolute',
            left:'0',
            top:'0',
            width:'100%',
            height:'100%',
            pointerEvents:'none',
            zIndex:999
          }}>
            <line x1={X} y1={Y} x2={circle.x + circle.radius + 10} y2={circle.y} stroke="black"></line>
  
          </svg>
          
          </>:null
  
          )
  
          }
          {showmode && shapes.map(shape =>
              <div className="hover-panel" style={{
                display: 'block' ,
                position: 'relative',
                top: '10%', 
                left: '10%', 
                zIndex: 1000,
                padding: '10px',
                background: 'white',
                border: '1px solid black',
                borderRadius: '5px',
              }}>
                <div>
                  <label> Text: </label>
                  <input type='text'  onChange={(e)=>handletextchangebezier(e,shape)}></input>
                </div>
                Shape ID: {shape.id}
              </div>
            )
  
          }
  
          {!showmode && onshape && shapes.map(shape=>
            shape.id===selectedshapehover? 
            <>
            <div style={{
              position:'absolute',
              left:`${shape.x+shape.width}px`,
              top:`${shape.y}px`,
              padding:'10px',
              background:'Black',
              opacity:'50%',
              border:'1px solide black',
              borderRadius: '5px',
              zIndex:1000
  
            }}>
            <p style={{color:'white'}}>{shape.Text}</p>
            </div>
            <svg style={{
              position:'absolute',
              left:'0',
              top:'0',
              width:'100%',
              height:'100%',
              pointerEvents:'none',
              zIndex:999
            }}>
           <line x1={X} y1={Y} x2={shape.x+shape.width+10} y2={shape.y} stroke="black"></line>
  
            </svg>
          
            </>:null
  
            )
  
          }
  
            
  
          
          
        
  
      
        <div className="relative w-full h-screen overflow-hidden">
          {/* Controls */}
          <div className="absolute top-0 z-10 w-full py-2 ">
            <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg">
              <button
                className={
                  action === ACTIONS.SELECT
                    ? "bg-violet-300 p-1 rounded"
                    : "p-1 hover:bg-violet-100 rounded"
                }
                onClick={() => setAction(ACTIONS.SELECT)}
              >
                <GiArrowCursor size={"2rem"} />
              </button>
              <button
                className={
                  action === ACTIONS.RECTANGLE
                    ? "bg-violet-300 p-1 rounded"
                    : "p-1 hover:bg-violet-100 rounded"
                }
                onClick={() => setAction(ACTIONS.RECTANGLE)}
              >
                <TbRectangle size={"2rem"} />
              </button>
              <button
                className={
                  action === ACTIONS.CIRCLE
                    ? "bg-violet-300 p-1 rounded"
                    : "p-1 hover:bg-violet-100 rounded"
                }
                onClick={() => setAction(ACTIONS.CIRCLE)}
              >
                <FaRegCircle size={"1.5rem"} />
              </button>
              <button
                className={
                  action === ACTIONS.ARROW
                    ? "bg-violet-300 p-1 rounded"
                    : "p-1 hover:bg-violet-100 rounded"
                }
                onClick={() => setAction(ACTIONS.ARROW)}
              >
                <FaLongArrowAltRight size={"2rem"} />
              </button>
              <button
                className={
                  action === ACTIONS.SCRIBBLE
                    ? "bg-violet-300 p-1 rounded"
                    : "p-1 hover:bg-violet-100 rounded"
                }
                onClick={() => setAction(ACTIONS.SCRIBBLE)}
              >
                <LuPencil size={"1.5rem"} />
              </button>
  
              
  
              <button>
                <input
                  className="w-6 h-6"
                  type="color"
                  value={fillColor}
                  onChange={handlecolor}
                />
              </button>
  
              
  
              <button onClick={handleExport}>
                <IoMdDownload size={"1.5rem"} />
              </button>
              <button onClick={handleCloseCurve}>Close Shape</button>
              <button onClick={()=>setAction(ACTIONS.BEZIER)}>BEZIER</button>
              <button onClick={(e)=>deleteshape(e)}>DELETE</button>
  
  
            </div>
            <Strock 
              rectangles={rectangles}
              setrectangles={setRectangles}
              selectedshape={selectedshape}
              shapes={shapes}
              setshapes={setShapes}
              circles={circles}
              setCircles={setCircles}
            ></Strock>
            <TextConf
            textpanelcolor={textpanelcolor}
            textpanelopacity={textpanelopacity}
            panelLine={panelLine}
            setpanelLine={setpanelLine}
            settextpanelcolor={settextpanelcolor}
            settextpanelopacity={settextpanelopacity}
            TextConfClicked={TextConfClicked}
            setTextConfClicked={setTextConfClicked}
            
            >
            </TextConf>
          </div>
          <div ref={containerRef} className='stage-container'>
          {stageRefs.map((stageRef, index) => (
            <Stage
              key={index}
              ref={stageRef}
              width={2000}
              height={window.innerHeight}
              onPointerDown={()=>onPointerDown(index)}
              onPointerMove={()=>onPointerMove(index)}
              onPointerUp={onPointerUp}
              onMouseDown={action===ACTIONS.BEZIER?handleCanvasClick:null}
            >
              <Layer>
    
                
                <Rect
                  x={0}
                  y={0}
                  height={window.innerHeight}
                  width={window.innerWidth}
                  fill="#ffffff"
                  id="bg"
                  onClick={() => {
                    transformerRef.current.nodes([]);
                  }}
                />
                {konvaImages.map((image, index) => (
            <KonvaImage
              key={index}
              image={image}
              x={imageProperties[index].x}
              y={imageProperties[index].y}
              width={imageProperties[index].width}
              height={imageProperties[index].height}
              scaleX={imageProperties[index].scaleX}
              scaleY={imageProperties[index].scaleY}
              rotation={imageProperties[index].rotation}
              draggable
              onDragEnd={(e) => handleDragEnd(index, e)}
              onTransformEnd={(e) => handleTransformEnd(index, e)}
              onClick={handleSelectImage}
            />
          ))}
            
                <BezierCurveCreator shapes={shapes}
                transformerRef={transformerRef}
                  selectedid={selectedshape}
                  setselectedid={setselectedshape} 
                  currentPoints={currentPoints} 
                  setCurrentPoints={setCurrentPoints}
                  selectedidhover={selectedshapehover}
                  setselectedidhover={setselectedshapehover}
                  onshape={onshape}
                  setonshape={setonshape}
                  showmode={showmode}
                  X={X}
                  Y={Y}
                  opacity={opacity}
                  setopacity={setopacity}
                  fillColor={fillColor}
                  ></BezierCurveCreator>
    
                {rectangles.filter((rec)=>rec.stageid===currentIndex).map((rectangle) => (
                  <Rect
                    key={rectangle.id}
                    x={rectangle.x}
                    y={rectangle.y}
                    stroke={rectangle.strockcolor}
                    strokeWidth={rectangle.strockwidth}
                    fill={rectangle.fillColor}
                    opacity={rectangle.opacity}
                    height={rectangle.height}
                    width={rectangle.width}
                    draggable={isDraggable}
                    onClick={(e)=>onClick(e,rectangle.id,rectangle.fillColor)}
                    onMouseEnter={()=>handlemouseenter(rectangle.id)}
                    onMouseLeave={handlemouseleave}
                    
                    
                    
                  />
                ))}
    
                
    
                {circles.map((circle) => (
                  <Circle
                    key={circle.id}
                    radius={circle.radius}
                    x={circle.x}
                    y={circle.y}
                    stroke={circle.strockcolor}
                    strokeWidth={circle.strockwidth}
                    fill={circle.fillColor}
                    draggable={isDraggable}
                    opacity={circle.opacity}
    
                    onClick={(e)=>onClick(e,circle.id,circle.fillColor)}
                    onMouseEnter={()=>handlemouseenter(circle.id)}
                    onMouseLeave={handlemouseleave}
                  />
                ))}
                {arrows.map((arrow) => (
                  <Arrow
                    key={arrow.id}
                    points={arrow.points}
                    stroke={strokeColor}
                    strokeWidth={2}
                    fill={arrow.fillColor}
                    draggable={isDraggable}
                    onClick={(e)=>onClick(e,arrow.id,arrow.fillColor)}
                  />
                ))}
    
                {scribbles.map((scribble) => (
                  <Line
                    key={scribble.id}
                    lineCap="round"
                    lineJoin="round"
                    points={scribble.points}
                    stroke={strokeColor}
                    strokeWidth={2}
                    fill={scribble.fillColor}
                    draggable={isDraggable}
                    onClick={(e)=>onClick(e,scribble.id,scribble.fillColor)}
                  />
                ))}
    
                <Transformer ref={transformerRef} />
              </Layer>
            </Stage>
          ))}
        </div>
        <button onClick={prevStage}>Previous</button>
        <button onClick={nextStage}>Next</button>
        <button onClick={addStage}>Add Stage</button>
  
          
        </div>
        
      </div>
    )
}

export default Imgmap