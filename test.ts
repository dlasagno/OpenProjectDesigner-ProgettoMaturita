var opened = false;

function ciao(){
  if(!opened){
    document.getElementById("a").classList.add("active");
    //document.getElementById("b").style.marginLeft ="200px";
    document.getElementById("c").style.marginLeft =200-60+"px";
    opened=true;
  } else {
    document.getElementById("a").classList.remove("active");
    //document.getElementById("b").style.marginLeft ="0px";
    document.getElementById("c").style.marginLeft ="0px";
    opened=false;
  }
}
