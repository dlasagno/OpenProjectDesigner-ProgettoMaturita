var opened = false;

function ciao(){
  if(!opened){
    document.getElementById("a").classList.add("active");
    //document.getElementById("b").style.marginLeft ="200px";
    document.getElementById("c").classList.add("move-left");
    opened=true;
  } else {
    document.getElementById("a").classList.remove("active");
    //document.getElementById("b").style.marginLeft ="0px";
    document.getElementById("c").classList.remove("move-left");
    opened=false;
  }
}
