import {useState, useEffect} from 'react';

export default function Scrollbar({height}){
  useEffect(() =>{
    document.body.addEventListener('click', function(){
      console.log('working');
      console.log(document.body.scrollHeight);
    })

  });
  return(
    <>
      <div className={'scrollbar'}>
      </div>
    </>
  )
}
