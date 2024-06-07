import "./style.css";

function component() {
  const element = document.createElement("div");

  element.innerHTML = "uwu";

  return element;
}

document.body.appendChild(component());
