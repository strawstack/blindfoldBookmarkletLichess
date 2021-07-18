(function(){ 
    document.querySelectorAll("piece").forEach(p => p.style.opacity = (p.style.opacity == "" || p.style.opacity == "1")? "0":"1");
})();