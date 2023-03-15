import {useEffect, useState, useRef} from 'react';

export default function Projects(){
  var [mouseDown, changeMouseDown] = useState(0);
  var [prevPos, changePrevPos] = useState(0);
  var [translateX, changeTranslateX] = useState(0);
  var [nextpercentage, changeNext] = useState(0);
  var [pos,changePos] = useState(0);


  var track = useRef();

  var images = [];

  for(var i = 0; i < 7; i++){
    images.push(<Image translateX={translateX + 100}/>);
  }

  useEffect(() => {
    var dx = 1;
    window.onwheel = e =>{
      const trans = translateX + (-1.5 * (e.deltaY / Math.abs(e.deltaY)));
      if(trans > 0){
        trans = 0;
      }
      else if(trans < -100){
        trans = -100;
      }
      changeTranslateX(trans);

      track.current.animate({
        transform: `translate(${translateX}%, -50%)`
      }, { duration: 1200, fill:"forwards"});

    }

    window.onmousemove = e => {
      if(mouseDown === 0) return;

      const mouseDelta = parseFloat(mouseDown) - e.clientX;
      const maxDelta = window.innerWidth / 2;
      const percentage = (mouseDelta / maxDelta) * -100;
      const final = parseFloat(prevPos) + percentage;

      if(final > 0){
        final = 0;
      }
      else if(final < -100){
        final = -100;
      }
      changeNext(final);
      changeTranslateX(nextpercentage);

      console.log('translateX: ' + translateX + ' pos: ' + pos);
      if(pos < translateX - 5){
        changePos(pos + dx);
      }
      else if(pos > translateX + 5){
        changePos(pos - dx);
      }
      else{
        dx *= 0.999;
        if(pos > translateX){
          changePos(pos - dx);
        }
        else{
          changePos(pos + dx);
        }
      }
      track.current.style.transform = `translate(${pos}%, -50%)`;
      //changeTranslateX(translateX * 0.99);
/*
      track.current.animate({
        transform: `translate(${translateX}%, -50%)`
      }, { duration: 1200, fill:"forwards"});*/

    }

    window.onmousedown = e =>{
      changeMouseDown(e.clientX);
      dx = 1;
    }

    window.onmouseup = e =>{
      changeMouseDown(0);
      changePrevPos(nextpercentage);
      dx = 0;
    }
  });
  return(
    <div className={"container"} >
      <div style={{top: '60%', position: 'absolute', left: '25%'}}>
        <h1> Projects </h1>
      </div>
      <div ref={track} className={'image-track'} >
        {images}
      </div>
    </div>
  );
}


function Image({translateX}){
  var imageanimate = useRef();

  useEffect(() => {
    imageanimate.current.animate({objectPosition: `${translateX}% center`}, {duration: 1200, fill: 'forwards'});
  });
  return(
  <img ref={imageanimate} className="image" src="https://images.unsplash.com/photo-1672522597762-63bb63b4f1d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      draggable='false'/>
    );
}
