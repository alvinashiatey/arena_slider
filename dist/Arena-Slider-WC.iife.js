(function(){"use strict";function r(i){const t='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z"/></svg>',e='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"/></svg>',n=document.createElement("template");return n.innerHTML=`
    <style>
        :host {
            --btn-gap: 0.1rem;
            display: block;
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
            margin: 0 auto;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            max-width: 100%;
            width: var(--ar-w, 35rem);
            overflow: hidden;
        }
        :host .arena_slider{
            height: inherit;
            position: relative;
            box-sizing: border-box;
        }
        :host .arena_slide_wrapper {
            box-sizing: border-box;
            display: flex;
            align-items: stretch;
        }
        :host .slide{
            width: 100%;
            height: var(--ar-h, 35rem);
            box-sizing: border-box;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: var(--ar-clr, #fefefe);
            padding-block: 0.5rem;
        }
        :host .slide .inner_text{
            box-sizing: border-box;
            height:auto;
            padding-block: 2rem;
        }
        :host .slide img{
            max-height: 100%;
            object-fit: contain;
        }
        :host .slide.arena_text{
            overflow: auto;
            padding-inline: 3rem;
            font-size: 1.25rem;
            line-height: 1.5;
            background-color: var(--ar-bg, black);
            justify-content: initial;
            font-family: var(--ar-fnt, "Helvetica Neue", Helvetica, Arial),sans-serif;
        }
        :host .slide.arena_media iframe{
            width: 100%;
            height: 100%;
        }
        :host .description{
            padding-block: calc(var(--btn-gap, 0.1rem)*4);
        }
        :host .description p, :host .description a{
            font-size: calc(var(--ar-fs, 1.5rem) / 1.8);
            margin: 0;
        }
         :host .description a{
            color: var(--ar-clr, dodgerblue);
            text-decoration: none;
         }
        :host .description.line{
            border-bottom: 1px solid #181818;
        }
        :host .slider__nav{
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: var(--ar-fs, 1.2rem);
            padding-block-start: var(--btn-gap, 0.1rem);
            border-bottom: 1px solid var(--ar-bg, #181818);
            border-top: 1px solid var(--ar-bg, #181818);
        }
        :host .slider__nav p{
            margin: 0;
        }
        :host .buttons{
            display: flex;
            gap: var(--btn-gap, 0.1rem);
        }
        :host button.btn {
            padding: 0;
            background-color: transparent;
            color: #181818;
            border: none;
            font-size: var(--ar-fs, 1.5rem);
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
            height: fit-content;
        }
        :host button.btn:hover {
            transform: scale(1.1);
        }
    </style>
    <div class="arena_slider">
      <div class="arena_slide_wrapper">
        ${i.contents.map(s=>o(s)).join("")}
      </div>
      <div class="slider_details">
        <div class="slider__nav">   
          <div class="buttons">
              <button type="button" class="btn" id="prev-button"> ${t} </button>
              <button type="button" class="btn" id="next-button"> ${e} </button>
          </div>
          <div class="count">
              <p><span id="current">0</span>/<span id="total">0</span></p>
          </div>
        </div>
        <div class="description">
            <a id="link"></a>
            <p id="description"></p>
        </div>
       </div>
    </div>
`,{template:n}}function o(i){const t=i.description||"";switch(i.class){case"Text":return`<div data-description="${t}" class="slide arena_text"><div class="inner_text">${i.content_html}</div></div>`;case"Image":return`<div data-description="${t}" class="slide arena_image"><img loading="lazy" src="${i.image.original.url}" alt="${i.title}"/></div>`;case"Media":return`<div data-description="${t}" class="slide arena_media">${i.embed.html}</div>`;case"Link":return`<div data-description="${t}" data-link="${i.source.url}" class="slide arena_link"><img loading="lazy" src="${i.image.original.url}" alt="${i.description}"></div>`;case"Attachment":return`<div data-description="${t}" data-link="${i.source?.url}" class="slide arena_attachment"><img loading="lazy" src="${i.image.original.url}" alt="${i.description}"></div>`;case"Channel":return;default:return`<div data-description="${t}" class="slide">No content</div>`}}class a extends HTMLElement{_shadowRoot;_channel;_slides;_counter=0;_descriptionContainer;_nextButton;_prevButton;_description;_current;_total;_slideWrapper;_anchor;_isSliding=!1;_pointerStartX=0;constructor(){super(),this._shadowRoot=this.attachShadow({mode:"open"})}async setUpTemplate(){try{const t=await this.fetchChannel(this._channel??"arena_slider"),{template:e}=r(t);this._shadowRoot.appendChild(e.content.cloneNode(!0)),this.setupEventListeners(),this.setSlideHeight()}catch(t){console.log(t)}}static get observedAttributes(){return["channel","width","height"]}attributeChangedCallback(t,e,n){const s=this._shadowRoot.querySelector(":host");switch(t){case"channel":this._channel=n;break;case"width":s?.style.setProperty("--ar-w",n);break;case"height":s?.style.setProperty("--ar-h",n);break;default:return}}fetchChannel(t){const e=Math.random().toString(16).slice(2),n=`https://api.are.na/v2/channels/${t}?sort=position&order=asc&per=100?nocache=${e}`;return fetch(n).then(s=>s.json())}async render(){await this.setUpTemplate()}connectedCallback(){this.render()}setupEventListeners(){this._nextButton=this._shadowRoot.querySelector("#next-button"),this._prevButton=this._shadowRoot.querySelector("#prev-button"),this._slides=this._shadowRoot.querySelectorAll(".slide"),this._descriptionContainer=this._shadowRoot.querySelector(".description"),this._description=this._shadowRoot.querySelector("#description"),this._current=this._shadowRoot.querySelector("#current"),this._total=this._shadowRoot.querySelector("#total"),this._slideWrapper=this._shadowRoot.querySelector(".arena_slide_wrapper");const t=this._slides[0].clientWidth;this._anchor=this._descriptionContainer.querySelector("a"),this._total.innerHTML=`${this._slides.length}`,this._current.innerHTML="1",this._slideWrapper.style.transform=`translateX(${-t*this._counter}px)`,this._nextButton?.addEventListener("click",this.slideFrame.bind(this,1)),this._prevButton?.addEventListener("click",this.slideFrame.bind(this,-1)),window.addEventListener("resize",this.resize.bind(this)),this._slideWrapper.onpointerdown=this.pointerDown.bind(this),this._slideWrapper.ontouchstart=this.pointerDown.bind(this),this.updateDescription()}slideFrame(t){if(!this._slides||!this._slideWrapper||this._isSliding)return;this._isSliding=!0;const e=this._counter+t;if(e<0||e>this._slides.length-1){this._isSliding=!1;return}this._slideWrapper.style.transition="transform 0.4s ease-in-out",this._counter=e,this._slideWrapper.style.transform=`translateX(${-this._slides[0].clientWidth*this._counter}px)`,this.updateDescription(),setTimeout(()=>{this._isSliding=!1},400)}updateDescription(){if(!this._slides||!this._description||!this._anchor||!this._descriptionContainer||!this._current)return;const t=this._slides[this._counter];this._description.innerHTML=t.getAttribute("data-description")||"";const e=t.getAttribute("data-link");e&&e!=="undefined"?(this._anchor.setAttribute("href",e),this._anchor.innerHTML="\u25C9 Link"):(this._anchor.setAttribute("href","#"),this._anchor.innerHTML="");const s=this._description.innerHTML!==""||e&&e!=="undefined";this._descriptionContainer?.classList.toggle("line",Boolean(s)),this._current.innerHTML=`${this._counter+1}`}setSlideHeight(){if(!this._slides)return;const t=this._slides[0].clientWidth;this._slides.forEach(e=>{e.style.height=`${t}px`})}resize(){if(!this._slides||!this._slideWrapper)return;const t=this._slides[0].clientWidth;this._slideWrapper.style.transform=`translateX(${-t*this._counter}px)`,this.setSlideHeight()}pointerDown(t){!this._slideWrapper||!this._slides||(t.preventDefault(),this._isSliding=!0,this._pointerStartX=t.clientX||t.touches[0].clientX,this._slideWrapper.style.transition="none",this._slides[this._counter].style.cursor="grabbing",document.onpointerup=this.pointerUp.bind(this),document.onpointermove=this.pointerMove.bind(this),document.ontouchstart=this.pointerDown.bind(this),document.ontouchend=this.pointerUp.bind(this),document.ontouchmove=this.pointerMove.bind(this))}pointerUp(t){if(!this._slideWrapper||!this._slides)return;t.preventDefault(),this._isSliding=!1;const e=this._slides[0].clientWidth/2,n=t.clientX||t.changedTouches[0].clientX,s=this._pointerStartX-n;this._slideWrapper.style.transition="transform 0.2s ease-in-out",s>e?this.slideFrame(1):s<-e?this.slideFrame(-1):this._slideWrapper.style.transform=`translateX(${-this._slides[0].clientWidth*this._counter}px)`,document.onpointerup=null,document.onpointermove=null,document.ontouchend=null,document.ontouchmove=null}pointerMove(t){if(!this._isSliding||!this._slideWrapper||!this._slides)return;t.preventDefault();const e=t.clientX||t.changedTouches[0].clientX,n=this._slides[0].clientWidth,s=this._pointerStartX-e;this._counter===0&&s<0||this._counter===this._slides.length-1&&s>0||(this._slideWrapper.style.transform=`translateX(calc(${-n*this._counter}px - ${s}px))`)}}customElements.define("arena-slider",a)})();
