import {useEffect, useRef, useState} from 'react';

export default function Navbar(){
  const closeRef = useRef(null);
  const aboutRef = useRef(null);
  const aboutR = useRef(null);

  useEffect(() => {
    var about = aboutRef.current;

    about.onclick = e =>{
      aboutR.current.style.opacity = 1;
      aboutR.current.style.display = 'flex';
    }

    var close = closeRef.current;

    close.onclick = e =>{
      aboutR.current.style.display = 'none';
      aboutR.current.style.opacity = 0;
    }
  });
  return(
    <>
      <div className="navbar-container">
        <div className="navbar">
          <NavItem href={"."} text={"Work"}/>
          <a ref={aboutRef}><h3 className={'nav-item'}>About</h3></a>

          <NavItem href={"Thomas_Tran_Resume.pdf"} text={"Resume"}/>
        </div>
      </div>


      <div ref={aboutR} className={'about-container'}>
      <div >
        <h6>I am a Interaction Designer and Developer who is nearing graduation at SFU's Interactive Art and Technology Program.
        I am a human that believe in creating meaningful and impactful experiences. Currently, I am learning Muay Thai and Boxing, and am involved in
        Polkadot governance (Web3). Feel free to contact me via email at thomas.tran789@gmail.com, I am always happy to chat!
        </h6>

        <h3 className="nav-item" style={{marginLeft:'50%'}} ref={closeRef}> Close </h3>
        </div>
      </div>

    </>
  )
}

function NavItem({text, href}){
  var navRef = useRef(null);
  const collection = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  var [jumble, changeText] = useState(text);
  var [isJumbling, changeJumbling] = useState(false);

  useEffect(() =>{
    var nav = navRef.current;

    nav.onmouseover = e => {
      requestAnimationFrame(function(){
        var newString = "";
        for(var i = 0; i < text.length; i++){
          newString += collection[Math.floor(Math.random() * collection.length)];
        }
        changeText(newString);
      });

    };

    nav.onmouseleave = e =>{
      changeText(text);
    };
  });
  return(
    <>
      <a href={href}><h3 className={'nav-item'} ref={navRef}>{jumble}</h3></a>
    </>
  );
}


function About({reference}){

  useEffect(() => {
    var close = reference.current;

    close.onclick = e =>{
      close.style.display = 'none';
      close.style.opacity = 0;
    }
  });
  return(
    <>
      <div className={'about-container'}>
      <div>
        <h6>I am a Interaction Designer and Developer who is nearing graduation at SFU's Interactive Art and Technology Program.
        I am a human that believe in creating meaningful and impactful experiences. Currently, I am learning Muay Thai and Boxing, and am involved in
        Polkadot governance (Web3). Feel free to contact me via email at thomas.tran789@gmail.com, I am always happy to chat!
        </h6>

        <h3 ref={reference}> Close </h3>
        </div>
      </div>
    </>
  )
}
