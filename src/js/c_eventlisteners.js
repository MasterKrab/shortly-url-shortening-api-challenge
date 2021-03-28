menuButton.addEventListener("click", () => menu.classList.toggle("navigation--active"));

form.addEventListener("submit", async e => {
   e.preventDefault();

   if(validateUrl(form.url.value)){
      form.url.setAttribute("aria-invalid", "false");
      form.url.classList.remove("form__input--error")
      form.url.parentElement.classList.remove("form__input-container--error");
      spinner.classList.add("spinner--active");
      await addLink(form.url.value);
      return;
   }

   form.url.value.trim().length == 0
   ? form.url.parentElement.dataset.error = "Please provide a link"
   : form.url.parentElement.dataset.error = "Please provide a valid link";

   showError();
});

linksContainer.addEventListener("click", e =>{
   if(e.target.classList.contains("shortened__copy")){
      !requestClipboardPermisions() && showErrorButton(e);

      navigator.clipboard.writeText(e.target.dataset.link)
         .then(() =>{
            e.target.classList.add("shortened__copy--copied");
            e.target.textContent = "Copied!";

            setTimeout(() =>{
               e.target.classList.remove("shortened__copy--copied");
               e.target.textContent = "Copy";
            }, 3000);
         })
         .catch(() => showErrorButton(e));
   };
});

document.addEventListener("DOMContentLoaded", () => {
   links = JSON.parse(localStorage.getItem("links")) || [];
   links.length > 0 && printLinks();
});