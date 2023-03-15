import {useRef, useEffect, useState} from 'react';
import laBatie from "./LaBatie";
import italist from "./Italist";
import vanGogh from "./VanGogh";
import {Point, Content, Banner, Video, List, Overview, Quote, TextBlock} from "./components/PageComponents.js";
import Scrollbar from './components/Scrollbar.js';

export default function Projects(){
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);

  const labatieRef = useRef(null);
  const italistRef = useRef(null);
  const vanGoghRef = useRef(null);

  const refs = [labatieRef, italistRef, vanGoghRef];
  var currents = [];

  useEffect(() => {
    // GLOBAL VARIABLES
    var posx = 0;
    var projectIndex = 1;

    var mouse = {
      x: 0,
      y: undefined,
      dx: 2,
      down: false,
      downPos: 0,
      distance: 0,
      hovering: false,
      clicked: false,

    }

    var canvas = canvasRef.current;
    var cursor = cursorRef.current;

    //var project = projectRef.current;
    for(var i = 0; i < refs.length; i++){
        currents.push(refs[i].current);
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.onresize = e => {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;


    }

    var c = canvas.getContext('2d');

    //Temp img

    var img = [];
    var imgsrc = ['La-Batie.png', 'Italist.png', "Dear-Van-Gogh.png"];

    for(var i = 0; i < imgsrc.length; i++){
      img.push(new Image());
      img[i].src = imgsrc[i];
    }

    canvas.onmousemove = e => {

      mouse.x = e.x;
      mouse.y = e.y;

      if(mouse.hovering && !mouse.clicked){
        cursor.style.display = 'block';
        cursor.style.top = mouse.y + 12 + 'px';
        cursor.style.left = mouse.x + 8 + 'px';
      }
      else{
        cursor.style.display = 'none';
      }
      //If not mouse down, then just return
      if(!mouse.down) return;
      e.preventDefault();

      //otherwise, is dragging
      setTimeout(function(){
        mouse.downPos = e.x;
      }, 100);

      mouse.distance = e.x - mouse.downPos;
      var direction = 1;

      if(mouse.distance < 0) direction = -1;
      mouse.dx = Math.abs(mouse.distance/20) * direction;


    };
    //drag start
    canvas.onmousedown = e =>{
      if(!mouse.down){
        mouse.downPos = e.x;
      }
      mouse.down = true;

    }

    canvas.onmouseup = e =>{
      mouse.down = false;
      mouse.prevPos = mouse.x;
    }

    //If Scroll

    canvas.onwheel = e =>{
      var direction = 0;
      if(e.deltaY < 0){
        //scrolling up
        direction = 1;
      }
      if(e.deltaY > 0){
        //scrolling down
        direction = -1;
      }
      mouse.distance = 1;
      mouse.dx = 8 * direction;
    }

    //On Click

    canvas.onclick = e =>{
      if(!mouse.hovering) return;
      mouse.clicked = true;
      //project.style.display = "block";
      //project.childNodes
      currents[projectIndex - 1].style.display = "block";
    }

    class ImageBox{

    constructor(ap){
      this.arrayPosition = ap;
      this.x = (canvas.width/6 + (this.w * this.arrayPosition)) ;
      this.y = canvas.height/2 - this.h/2;
      this.clipX = 0;
      this.clipY = 0;
      this.w = 400;
      this.h = 400;
      this.imgWidth = canvas.width + this.w/2;
      this.imgHeight = (this.imgWidth*(img[this.arrayPosition - 1].height/img[this.arrayPosition - 1].width));
      this.maxW = 0;
      this.maxH = 0;

      this.iw = 1.5;
      this.ih = 1.5;

      this.diw = 1.01;
      this.dih = 0.01;

      this.wdx = 60;
      this.idx = this.wdx/2;

      this.tx = 0;
      this.tdx = 8;

      this.wdy = 20;
      this.idy = this.wdy/2;
      this.factor = 0.967;
      this.parallax = img[this.arrayPosition - 1].width/4 *(posx / (canvas.width));
      this.count = 0;
    }
    setDimensions(){
      this.imgWidth = canvas.width + this.w/2;
      this.imgHeight = (this.imgWidth*(img[this.arrayPosition - 1].height/img[this.arrayPosition - 1].width));
    }
    image(context, h1){
      this.setDimensions();
      //margin between cards
      var margin = 40 * this.arrayPosition;

      //parallax distance

      //Leave animation on click
      if(mouse.clicked){
          //For all elements not the project index
          if(this.h > 0 && this.arrayPosition != projectIndex){
            this.wdx *= this.factor;
            this.maxH -= this.wdx;
            h1.switch = true;
            if(this.maxH < -this.h){
              this.maxH = -this.h
            }
          }
          else if(this.h > 0 && this.arrayPosition == projectIndex){
            //For element that IS the project index
              if(this.x + this.clipX > 0){this.idx *= this.factor; this.clipX -= this.idx;}
              if(this.y + this.clipY > 0) {this.idy *= this.factor;  this.clipY -= this.idy};
              if(this.w + this.maxW < canvas.width) {this.wdx *= this.factor; this.maxW += this.wdx};
              if(this.y + this.maxH < canvas.height) {this.wdy *= this.factor; this.maxH += this.wdy};

              if(this.imgWidth/this.iw < canvas.width){this.iw /= this.diw; this.ih /= this.diw}

              if(this.tx >  -((this.arrayPosition * this.w/2)  + this.parallax)){
                this.tdx *= this.factor;
                this.tx -= this.tdx;
              }

              h1.switch = true;

          }

      }
      else{
        //Otherwise reset values
        this.x = (canvas.width/6 + (this.w * this.arrayPosition)) + margin + posx;
        this.y = canvas.height/2 - this.h/2;
        this.parallax = this.imgWidth/2 *(posx / (canvas.width));

      }

      //Draws the images with clipping
      context.save();
        const rect = new Path2D();
        rect.rect(this.x + this.clipX, this.y + this.clipY, this.w + this.maxW, this.h + this.maxH);
        context.clip(rect);
        context.drawImage(img[this.arrayPosition - 1], (this.arrayPosition * this.w/2)  + this.parallax + this.tx,
                               0,
                               this.imgWidth/this.iw,
                               this.imgHeight/this.ih);


      context.restore();

      //Handles Hover condition
      if(this.x < canvas.width/2 && this.x + this.w > canvas.width/2){
        projectIndex = this.arrayPosition;
        //check if hovering
          if(mouse.x > this.x &&  mouse.x < this.x + this.w){
            if(mouse.y > this.y && mouse.y < this.y + this.h ){
              mouse.hovering = true;
            }
            else{
              mouse.hovering = false;
            }
          }
          else{
            mouse.hovering = false;
          }
      }

      h1.set(this.x, this.y + this.h + 32);
      h1.drawHeader();
      h1.drawSubheader();
    }
  }



    class Header{
      constructor(text, subtext){
        this.text = text;
        this.subtext = subtext;
        this.x = 0;
        this.y = 0;
        this.dy = 0.5;
        this.fontSize = 24;
        this.offset = 24 + 4;
        this.switch = false;
        this.jumble = "";
        this.count = 0;
        this.fps = 60;
      }
      set(x, y){
        this.x = x;
        this.y = y;

      }
      drawHeader(){
        c.font = `500 ${this.fontSize}px GT America`;

        c.save();
          const rect = new Path2D();
          rect.rect(this.x, this.y -26, c.measureText(this.text).width, 28);
          c.clip(rect);
          c.fillStyle = "rgba(244, 244,244, 1)";
          c.fill();

          if(this.x < canvas.width/2 && this.x + 400 > canvas.width/2 && !this.switch){
            // Come down
            this.offset -= this.dy;
            if(this.offset <= 20){
              //Slow to Stop
              this.dy *= 0.975;
              if(this.offset < 0.5){
                this.dy = 0;
                this.offset = 0;
                this.switch = true;
              }
            }
          }
          else{
            // Continue downards
            if(this.offset > -(this.fontSize + 4) && this.offset < this.fontSize + 4){
              this.dy = 0.5;
              this.offset -= this.dy;
            }
          }
          if(this.offset <= -(this.fontSize + 4)){
            this.offset = this.fontSize + 4;
            this.switch = false;
          }

          c.fillText(this.text,this.x, this.y - this.offset);
        c.restore();
    }

      //MIGHT WANT TO CHANGE AFTER
      drawSubheader(){
          const collection = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

          if(this.fps > 4){
            if(this.x < canvas.width/2 && this.x + 400 > canvas.width/2 && !this.switch){
              //Jumble into randomness of length text
              if(this.jumble.length < this.subtext.length){
                var newString = "";
                for(var i = 0; i < this.jumble.length; i++){
                  newString += collection[Math.floor(Math.random() * collection.length)];
                }
                this.jumble = newString;
                this.jumble += collection[Math.floor(Math.random() * collection.length)];
              }
              else if (this.jumble.length >= this.subtext.length && this.jumble != this.subtext){
                //Jumble into the text itself
                var newString = "";
                if(this.count < this.subtext.length){
                  newString += this.subtext.substring(0, this.count + 1);
                  this.count++;
                }
                for(var i = this.count + 1; i <= this.subtext.length; i++){
                  newString += collection[Math.floor(Math.random() * collection.length)];
                }

                this.jumble = newString;
              }
            }
            else{
              //Jumble into nothingness
              this.count = 0;
              var newString = "";
              for(var i = this.count + 1; i <= this.jumble.length; i++){
                newString += collection[Math.floor(Math.random() * collection.length)];
              }

              this.jumble = newString;
              this.jumble = this.jumble.substring(0, this.jumble.length - 1);
            }

            this.fps = 0;
          }

          c.font = "400 12px GT America Mono";
          c.fillStyle = "rgba(244, 244, 244, 1)";
          c.fill();
          c.fillText(this.jumble,this.x, this.y + 20);

          this.fps++;
        }


  }
  class Nav{
    constructor(){
      this.dx = 1;
      this.height = 50;
      this.width = canvas.width;
    }
    drawNav(w){
      var rem = 16;
      var length = Math.floor(w/rem);
      var h = canvas.height - (4*rem);
      c.save();
        //Move origin to bottom center
        c.translate(canvas.width/2 - w/2, h);

        //Current project out of x being viewed
        c.font = "400 12px GT America Mono";
        c.fillStyle = "rgba(244, 244, 244, 1)";
        c.fill();
        c.save();
          var t1 = new Path2D();
          t1.rect(0, -6, w, this.height);
          c.clip(t1);
          c.fillText('0' + projectIndex,0, 8);
          c.fillText('0' + 5,w - 24, 8);

        c.restore();

        const rect = new Path2D();
        rect.rect(100, -12.5, 200, this.height);

        if(mouse.clicked){
          if(this.height >= -1){
            this.height -= this.dx;
          }
        }
        else{
          if(this.height <= 50){
            this.height += this.dx;
          }
        }


        c.clip(rect);

        //Iterate by project total * 5
        for(var i = 0; i <= length; i++){
          var x = i*rem + posx/rem;
          c.beginPath();
          //Height is function of position
          if(x > w/2 - 10 && x <= w/2){
            c.moveTo(x, -2);
            c.lineTo(x, 10);
          }
          else if(x > w/2 - 30 && x < w/2 + 10){
            c.moveTo(x, -1);
            c.lineTo(x, 9);
          }
          else{
            c.moveTo(x, 0);
            c.lineTo(x, 8);
          }
          c.strokeStyle = "#f4f4f4";
          c.stroke();
        }

        //Left Gradient
        const g1 = c.createLinearGradient(100, 0, 200, 0);
        g1.addColorStop(0, 'rgba(16,16,16,1)');
        g1.addColorStop(1, 'rgba(16,16,16,0)');

        //Right Gradient
        const g2 = c.createLinearGradient(200, 0, 300, 0);
        g2.addColorStop(0, 'rgba(16,16,16,0)');
        g2.addColorStop(1, 'rgba(16,16,16,1)');

        c.fillStyle = g1;
        c.fillRect(100, -2, 100, 20);

        c.fillStyle = g2;
        c.fillRect(200, -2, 100, 20);
      c.restore();
    }
  }


  //Probably want to load these from a text file
  var titles = [ "LA BATIE", "ITALIST.COM", "DEAR VAN GOGH"];
  var subheaders = ["WEB DESIGN", "UX DESIGN", "IMMERSIVE MEDIA"];
  var headers = [];
  var imageBoxes = [];

  function init(){
    for(var i = 0; i < titles.length; i++){
      headers.push(new Header(titles[i], subheaders[i]));
      imageBoxes.push(new ImageBox(i+1));
    }
  }

  var nav = new Nav();

  //Animates Everything
  function draw(){

      for(var i = 0; i < headers.length; i++){
        imageBoxes[i].image(c, headers[i]);
      }
      nav.drawNav(400);
  }
  var id;
  function animate(){

  id = requestAnimationFrame(animate);

    c.clearRect(0, 0, canvas.width, canvas.height);

    //Limit distance (currently not responsive)
    if(posx != mouse.distance){
      if((mouse.dx < 0 && posx > -(canvas.width - 160)) || (mouse.dx > 0 && posx < 440)){
        posx += mouse.dx;
        mouse.dx *= 0.97;
      }
    }
    //draw
    draw();
  }
  init();
  animate();

  return() => cancelAnimationFrame(id);

  });
  return(
    <>
    <h3 ref={cursorRef} className="cursor">open </h3>

    <div ref={labatieRef} style={{display: 'none'}}>
      <LaBatie/>
    </div>

    <div ref={italistRef} style={{display: 'none'}}>
      <Italist/>
    </div>

    <div ref={vanGoghRef} style={{display: 'none'}}>
      <VanGogh/>
    </div>
    <canvas ref={canvasRef} id="canvas" width={0} height={0}></canvas>

    </>
  )
}

var projects = [<LaBatie/>, <Italist/>];
function LaBatie({show}){
  var [display, changeDisplay] = useState('none');

  return(
    <>
      <div className={'wrapper flex col abs'} style={{display:`${show}`}}>


        <div style={{marginTop: '100vh'}}>
          <Overview names={laBatie.overview.names}
                    roles={laBatie.overview.roles}
                    tools={laBatie.overview.tools}
                    desc={laBatie.overview.desc}
                    title={laBatie.overview.title}
                    length={laBatie.overview.length}
                    />
          <Video source={'https://www.youtube.com/embed/watch?v=Pu0Ln4FQcC0'}/>

          <Content title={laBatie.about.title} desc={laBatie.about.desc}/>
          <Video source={"https://www.youtube.com/embed/watch?v=lBQaCZ0x7FE"} desc={"Festival de Geneve promotional content 2021"}/>

          <Content title={laBatie.intent.title} desc={laBatie.intent.desc}/>
          <Point title={'content design approach'} desc={['Encourage visitors to explore the site through denial and reward', 'Unique visual and interactive identity of the performances to re-invoke memorable experiences for attendees.']}/>

          <Content title={laBatie.identity.title} desc={laBatie.identity.desc}/>
          <Banner source={'LaBatie/Exploration.jpg'} label={'Lateral exploration of design works'}/>

          <Content title={laBatie.dan.title} desc={laBatie.dan.desc}/>
          <Quote desc={' Legibility is based on order, convention (predictability), simplicity and on the reader as a passive recipient. Unpredictability is the ability of a design to attract or seduce you, in an intense, virtually cluttered world, into reading it in the first place. It is usually based on disorder, originality and complexity.'} source={'Interview with Dan Friedman, conducted by Peter Rea for Eye Magazine 1994'}/>


          <Content title={''} desc={laBatie.dan.desc2}/>

          <Banner source={'LaBatie/DanQualities2.png'} label={"The design quality we extracted was using transformations of repeated elements to guide attention towards elements."}/>
          <Banner source={'LaBatie/DanQualities3.png'} label={"Another design quality we extracted was 'Breaking the grid', which creates an element of chaos, making compositions more dynamic."}/>

          <Content title={laBatie.finalQualities.title} desc={laBatie.finalQualities.desc}/>
          <Banner source={'LaBatie/FinalPrinciples.png'} />

          <Content title={laBatie.graphicExp.title} desc={laBatie.graphicExp.desc}/>
          <Banner source={'LaBatie/Poster.png'}/>
          <Banner source={'LaBatie/BusStop.png'}/>
          <Banner source={'LaBatie/Mural.png'}/>

          <Content title={laBatie.interactionExp.title} desc={laBatie.interactionExp.desc}/>
          <Banner source={'LaBatie/FunctionalExpressive.gif'} label={"The interactions and motion graphics were intended to communicate the dynamic and loud atmosphere of the cabaret shows. By surfacing related content in a fast-paced manner, we hoped to have brought forward the atmosphere of the cabaret show."}/>
          <Banner source={'LaBatie/ExpressiveExpressive.gif'} label={"This design intended to use the interaction of dragging and hovering to reveal cropped images to communicate a sense of mystique and curiousity to communicate the more seductive side of the cabaret shows which often have erotic elements."}/>

          <Content title={laBatie.framing.title} desc={laBatie.framing.desc}/>
          <Banner source={'LaBatie/Insights.png'} />

          <Content title={laBatie.intervention.title} desc={laBatie.intervention.desc}/>

          <Video source={'./LaBatie/Tutorial.mp4'} label={'The text scramble was our way of using motion graphics to create an element of unpredicability. To play on this idea of slowly revealing the contents of the text in an enticing manner.'}/>
          <Video source={'./LaBatie/TheHomeScreen.mp4'} label={'The revealed media content after dragging over it uses our Design Quality of close-crop framing, as a way to play on the architectual idea of denial and reward. Visitors upon finding the content are rewarded with a partial view of the media mostly hidden by the crop.'}/>
          <Video source={'./LaBatie/Homescreen_1.mp4'} label={'Upon clicking the partially revealed content, the background changes to show the entirety of the content and the merchandise associated which can be bought.'}/>


          <Content title={laBatie.takeaways.title} desc={laBatie.takeaways.desc}/>


        </div>

      </div>
    </>
  );
}

function Italist({show}){
  var [display, changeDisplay] = useState('none');

  return(
    <>
      <div className={'wrapper flex col abs'} style={{display:`${show}`}}>


        <div style={{marginTop: '100vh'}}>
          <Overview names={italist.overview.names}
                    roles={italist.overview.roles}
                    tools={italist.overview.tools}
                    desc={italist.overview.desc}
                    title={italist.overview.title}
                    length={italist.overview.length}
                    />
          <Video source={'https://www.youtube.com/embed/watch?v=HFqAtRsJ0NY'} label={'Concept video'}/>

          <Content title={italist.about.title} desc={italist.about.desc}/>
          <Banner source={'./Italist/ItalistWebsite.jpg'} label={'Words associated with lower cost and sale are seen numerous times throughout their website.'}/>

          <Content title={italist.bvp.title} desc={italist.bvp.desc}/>
          <Banner source={'./Italist/BrandValuePillars.png'} desc={italist.bvp.desc2}/>

          <Content title={italist.insights.title} desc={italist.insights.desc}/>
          <Banner source={'./Italist/Research.png'} label={`An excerpt from a research article titled Emotional Branding Speaks to the Consumer's Heart, by Yong-Kyum Kim, a Professor of Retail and Consumer Sciences.`}/>
          <Banner source={'./Italist/Mindy.png'} label={'Mindy was one of our user-testing participants, who is a frequent buyer of luxury fashion brands.'}/>

          <Content title={italist.hmw.title} desc={italist.hmw.desc}/>
          <Banner source={'./Italist/ZaacThomasMichelle.png'} label={"Part of our sprint involved ideating for How Might We's"}/>
          <Content title={italist.problem.title} desc={italist.problem.desc}/>
          <Quote desc={italist.problem.desc2}/>

          <Content title={italist.solution.title} desc={italist.solution.desc}/>
          <TextBlock title={italist.strat.title} desc={italist.strat.desc}/>
          <Point title={"Key focuses"} desc={['Familiarity with boutiques to help inform purchasing decisions', "Discover from which boutique their product comes from", "Explore the nuances of each boutique through the offered products."]}/>

          <Video source={'./Italist/HomeScreen_Final_Final_Final.mp4'} label={'The intent with this homescreen is to not only introduce featured boutiques, but to communicate the feeling of walking down the streets in Italy past these boutiques and looking through their display window.'}/>
          <Video source={'./Italist/Main.mp4'} label={'The main shopping screen featuring products sold from a selected boutique. This is as if a customer has walked into the boutique to explore the products being offered.'}/>
          <Video source={'./Italist/ProductItself.mp4'} label={'Detailed information relating to the product which was inspired by a negative review on Italist.com about the lack of information leading to heavy cognitive overhead.'}/>
          <Video source={'./Italist/Guya.mp4'} label={'A story about how this particular boutique came to exist, as if a customer were to walk in the boutique itself to personally get to know the owners.'}/>

          <Content title={italist.takeaways.title} desc={italist.insights.desc}/>


        </div>

      </div>
    </>
  );
}

function VanGogh({show}){
  return(
    <>
    <div className={'wrapper flex col abs'} style={{display:`${show}`}}>


      <div style={{marginTop: '100vh'}}>
      <Overview
                title={vanGogh.overview.title}
                names={vanGogh.overview.names}
                roles={vanGogh.overview.roles}
                tools={vanGogh.overview.tools}
                desc={vanGogh.overview.desc}
                length={vanGogh.overview.length}/>
      <Video source={'https://vimeo.com/695007753'} label={'Project trailer video'}/>

      <Content title={vanGogh.about.title} desc={vanGogh.about.desc}/>
      <Content title={vanGogh.immersion.title} desc={vanGogh.immersion.desc}/>
      <Point title={"Types of Immersion"} desc={vanGogh.immersion.desc2}/>

      <Content title={vanGogh.insights.title} desc={vanGogh.insights.desc}/>
      <Content title={vanGogh.insights2.title} desc={vanGogh.insights2.desc}/>

      <Banner source={'./VanGogh/Journey.JPG'} label={"Sequence of paintings experienced by the user based upon events happening in Vincent and Theo's lives indicated by research"}/>

      <Content title={vanGogh.interaction.title} desc={vanGogh.interaction.desc}/>
      <Banner source={'./VanGogh/EarlyPaint.png'} label={"An early iteration of the painting mechanic"}/>

      <Content title={vanGogh.usertest.title} desc={vanGogh.usertest.desc}/>
      <Point title={"Workshop structure"} desc={vanGogh.usertest.desc2}/>
      <Banner source={'./VanGogh/UserTest.JPG'} label={"Results of the workshop"}/>
      <Banner source={'./VanGogh/Jacky.JPG'} label={"Jacky was one of the 2 participants that chose to create a painting that invoked a feeling, as opposed to a replication."}/>


      <Content title={vanGogh.results.title} desc={vanGogh.results.desc}/>

      <Content title={vanGogh.changes.title} desc={vanGogh.changes.desc}/>
      <Banner source={''} label={"The final iteration of the painting mechanic, which is cleaner and faster."}/>
      <Banner source={'./VanGogh/OldRoom.png'} label={"Early iteration of the model environment of Room in Arles done in Blender"}/>
      <Banner source={'./VanGogh/NewRoom.png'} label={"Retexturing and volumetric lighting gave more life to the environment."}/>

      <Content title={vanGogh.conclusion.title} desc={vanGogh.conclusion.desc}/>
      <Video source={'https://www.youtube.com/embed/watch?v=uJYDmBGS_BA'} label={'Project journey video + walkthrough'}/>

      <Content title={vanGogh.takeaways.title} desc={vanGogh.takeaways.desc}/>

      </div>
      </div>


    </>
  );
}
