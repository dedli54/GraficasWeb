
const btnRegresar= document.querySelector("#regresar");
const modal= document.getElementById("modal");


window.addEventListener(
    "keydown",
    (event) => {
      if (event.defaultPrevented) {
        return; // Do nothing if event already handled
      }
  
      switch (event.code) {
        case "KeyA":
         modal.showModal();
          break;
        case "KeyB":
            modal.close();
            break;
      }
  
      
    },
    true,
  );