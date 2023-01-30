import { ArenaResponse, Content } from "./arena";

export default function generateTemplate(response: ArenaResponse) {
  const arrowLeft = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z"/></svg>`;
  const arrowRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"/></svg>`;
  const template = document.createElement("template");
  template.innerHTML = `
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
        ${response.contents.map((content) => handleContent(content)).join("")}
      </div>
      <div class="slider_details">
        <div class="slider__nav">   
          <div class="buttons">
              <button type="button" class="btn" id="prev-button"> ${arrowLeft} </button>
              <button type="button" class="btn" id="next-button"> ${arrowRight} </button>
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
`;
  return {
    template,
  };
}

function handleContent(content: Content) {
  const description = content.description || "";
  switch (content.class) {
    case "Text":
      return `<div data-description="${description}" class="slide arena_text"><div class="inner_text">${content.content_html}</div></div>`;
    case "Image":
      return `<div data-description="${description}" class="slide arena_image"><img loading="lazy" src="${content.image.original.url}" alt="${content.title}"/></div>`;
    case "Media":
      return `<div data-description="${description}" class="slide arena_media">${content.embed.html}</div>`;
    case "Link":
      return `<div data-description="${description}" data-link="${content.source.url}" class="slide arena_link"><img loading="lazy" src="${content.image.original.url}" alt="${content.description}"></div>`;
    case "Attachment":
      return `<div data-description="${description}" data-link="${content.source?.url}" class="slide arena_attachment"><img loading="lazy" src="${content.image.original.url}" alt="${content.description}"></div>`;
    case "Channel":
      return;
    default:
      return `<div data-description="${description}" class="slide">No content</div>`;
  }
}
