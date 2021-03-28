const showErrorButton = e =>{
   e.target.classList.add("shortened__copy--error");
   e.target.textContent = "Error";

   setTimeout(() =>{
      e.target.classList.remove("shortened__copy--error");
      e.target.textContent = "Copy";
   }, 3000);
};

const requestClipboardPermisions = () =>{
   return navigator.permissions.query({name: "clipboard-write"})
      .then(result => result.state == "granted" || result.state == "prompt" ? true : false);
};

const syncLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const printLinks = () =>{
   const fragment = document.createDocumentFragment();
   const templateLink = document.getElementById("template-link").content;

   linksContainer.textContent = "";

   links.forEach(link => {
      const linkElement = templateLink.querySelector(".shortened__link");
      linkElement.textContent = link.url;
      linkElement.href = link.url;
      const shortenedLink = templateLink.querySelector(".shortened__shortened-link")
      shortenedLink.textContent = link.shortenedUrl;
      shortenedLink.href = link.shortenedUrl;
      const buttonCopy = templateLink.querySelector(".shortened__copy")
      buttonCopy.dataset.link = link.url;
      buttonCopy.ariaLabel = `Copy the shortened link from ${link.url} to the clipboard`

      const cloneTemplate = document.importNode(templateLink, true);
      fragment.appendChild(cloneTemplate);
   });

   linksContainer.appendChild(fragment);
   spinner.classList.remove("spinner--active");
};

const showError = () =>{
   form.url.setAttribute("aria-invalid", "true");
   form.url.classList.add("form__input--error");
   form.url.parentElement.classList.add("form__input-container--error");
}

const shortenUrl = async url =>{
   try {
      const request = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
      const data = await request.json();
      return data.result.full_short_link;
   } catch (error) {
      form.url.parentElement.dataset.error = "We could not shorten that link";
      spinner.classList.remove("spinner--active");
      showError();
      console.error(error);
   };
};

const addLink = async url =>{
   for(const link of links){
      if(url === link.url){
         form.url.parentElement.dataset.error = "This link has already been shortened";
         spinner.classList.remove("spinner--active");
         showError();
         return;
      }
   };

   const urlInfo = {
      url,
      shortenedUrl: await shortenUrl(url)
   };

   if(validateUrl(urlInfo.shortenedUrl)){
      links = [...links, urlInfo];
      syncLocalStorage("links", links);
      printLinks();
   }
};

const validateUrl = url => {
   const urlRegex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g
   return urlRegex.test(url) ? true : false;
};