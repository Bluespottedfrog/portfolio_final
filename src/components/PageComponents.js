
function Overview({names, roles, tools, title, length, desc}){

  return(
  <div className={'overview-container '}>
    <div>
      <h2>{title}</h2>
      <p>{desc} </p>
      <br/>
      <div className={'flex row'} style={{flexWrap: 'wrap'}}>
        <List items={names} title={'TEAM'}/>
        <List items={roles} title={'my roles'}/>
        <List items={tools} title={'tools'}/>
        <List items={[length]} title={'timeframe'}/>
      </div>
    </div>
  </div>
);
}

function List({items, title}){
  var itemsList = [];
  for(var i = 0; i < items.length; i++){
    itemsList.push(<p className={'detail'}>{items[i]}</p>);
  }
  return(
    <>
    <div className={'flex col'} style={{marginRight: '2rem'}}>
      <h3>{title}</h3>
      {itemsList}
    </div>
    </>
  )
}


function Video({source, label}){
  var width, height;
  return(
    <>
    <div className={'content-container margins'} >
      <div>
        <iframe width="1080" height="608"
                src={source}
        >
        </iframe>
        <p className={'label'}> {label} </p>
      </div>
    </div>
    </>
  )
}

function Banner({source, label}){
  var width, height;
  return(
    <>
    <div className={'content-container'} style={{marginTop: '2rem'}} >
      <div>
        <img className={"banner-image"} src={source}/>
        <p className={'label'}> {label} </p>
      </div>
    </div>
    </>
  )
}

function Content({title, desc}){
  return(
    <>
      <div className="content-container margins">
        <div>
          <h2>{title}</h2>
          <p>{desc}</p>
        </div>
      </div>
    </>
  );
}

function Point({title, desc}){
  var list =[];
  for(var i = 0; i < desc.length; i++){
    list.push(<div className="point"><p>{i + 1}</p><p style={{maxWidth: '25rem'}}>{desc[i]}</p></div>);
  }
  return(
    <div className="content-container">
    <div>
      <h3>{title}</h3>
      {list}
      </div>
    </div>
  )
}

function Quote({desc, source}){
  return(
    <div className="content-container">
    <div>
      <p className="quote">
        {`"${desc}"`}
      </p>
      <p className="quote-source">
        {source}
      </p>
      </div>
    </div>
  )
}

function TextBlock({title, desc}){
  return(
  <>
    <div className="content-container">
      <div>
        <h5>{title}</h5>
        <p>{desc}</p>
      </div>
    </div>
  </>
);
}
export {
  Point, Content, Banner, Video, List, Overview, Quote, TextBlock
}
