document.querySelector("#socials").addEventListener("change", event => {
  if (event.target.checked) {
    document.querySelector("#input_for_socials").style.display = "block";
  } else {
    document.querySelector("#input_for_socials").style.display = "none";
  }
});
