

let newUrl="http://www.filltext.com?rows=99&f={firstName}&l={lastName}&pretty=true&e={email}&bst={stringArray|3,10}";

let infoContainer = document.getElementById("info");
let rawJSON = document.querySelector('#rawJSON');
let elementsPerPage =0;
let html ="";
let btn = document.getElementById("btn");

btn.addEventListener("click", function() {
  if(document.getElementById('pageSize').value === "" || parseInt(document.getElementById('pageSize').value) <1 ){
    alert('please insert how many elements per pages do u want ot visualze');
    return;
  }
  elementsPerPage = parseInt(document.getElementById('pageSize').value);

  let req = new XMLHttpRequest();
  req.open("GET",newUrl,true);
  req.send();
  let json;
  req.onload=function(){
    json=JSON.parse(req.responseText);
   // rawJSON.innerHTML=html + JSON.stringify(json);
    manageRender(json); // transfet in html all and charges in pages
  };
  
  btn.classList.add("hide-me");
  btn.disabled=true;
});

let pages = new Array();
let HtmlChunkArray = new Array();
let pageN=0;

function manageRender(data) {
  HtmlChunkArray = JsonToHtmlArray(data); //tanslates the whole array to html
  pagesIndication(); // updates the number of the page on top
  pages = definePages(HtmlChunkArray,elementsPerPage); // splits the pages every with n elements
  infoContainer.insertAdjacentHTML('beforeend', pages[pageN]); //display the first page
  pagesHandler(); // start the navigation capability of buttons.
}

function pagesHandler(){
  btnPrev = document.getElementById('previous');
  btnNext =  document.getElementById('next');
  let np =  parseInt(HtmlChunkArray.length / elementsPerPage) + 1; // to leave the reminder

  btnNext.addEventListener('click',()=>{
    if(pageN+1 < np ){
      btnPrev.disabled=false;
      infoContainer.innerHTML="";
      pageN++;
      pagesIndication();
      infoContainer.insertAdjacentHTML('beforeend', pages[pageN]);
    //  containerTransition();
    }else{btnNext.disabled=true;}
  });

  btnPrev.addEventListener('click',()=>{
    if(pageN > 0){
      btnNext.disabled=false;
      console.log(pageN);
      pageN--;
      pagesIndication();
      infoContainer.innerHTML="";
      infoContainer.insertAdjacentHTML('beforeend', pages[pageN]);
    }else{btnPrev.disabled=true;}
  });
}

//takes the whole array, cut it into n pieces every piece has the number of elements..
function definePages(chunk, limit){ 

  let chunkCopy = chunk.slice(0); // !!!xxx = chunk, when modify xxx get chunk modyf too!..
  let definedPages = new Array(); 
  for (i=0; i < (chunk.length/limit)+1; i++){
    definedPages.push(chunkCopy.splice(0,limit) );
  }
  if(definedPages[definedPages.length -1] == undefined){
    definedPages.pop(); // the array has a space for the reminder,if not needed get pop()'d.
  }
  console.log(HtmlChunkArray.length);
  return definedPages; // an array wit n pages containing n elements. 
}

function JsonToHtmlArray(jsonArray){ 
  let n = 1;
  let divArray = new Array();
  let htmlStr="";

  jsonArray.forEach(obj =>{
    htmlStr +="<div class='container'>";
    htmlStr += "<p>" +obj.f+" "+obj.l+"</p>";
    htmlStr += "<p>" +obj.e+ "</p>";
    htmlStr += "<strong>Links: </strong>"; 
    htmlStr += "<ul><a href='#'>";
    obj.bst.forEach(link =>{
      htmlStr += "<li>"+ link +"</li>";
    });
    htmlStr += "</a></ul>"
    htmlStr += "<p class='count'>"+n+"</p>";
    htmlStr += "</div>";
    divArray.push(htmlStr);   // every element in his div container pushed() as single html element;
    htmlStr = ""; 
    n++;
  });
  return divArray;
}

function pagesIndication(){ 
let n = pageN + 1;
let np = parseInt(HtmlChunkArray.length / elementsPerPage) + 1;
document.getElementById('pageN').innerHTML ="page #"+ n + " of "+ np ;
}

function regEx(){
  var x = document.getElementById("pageSize");
    var regex =  /\D+/g;
    x.value = x.value.replace(regex, "");
}
