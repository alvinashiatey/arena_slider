import { ArenaResponse } from "./arena";
import generateTemplate from "./SliderTemplate";

export class Slide extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _channel: string | undefined;
  private _slides: NodeListOf<HTMLDivElement> | undefined;
  private _counter = 0;
  private _descriptionContainer: HTMLDivElement | undefined;
  private _nextButton: HTMLButtonElement | undefined;
  private _prevButton: HTMLButtonElement | undefined;
  private _description: HTMLParagraphElement | undefined;
  private _current: HTMLSpanElement | undefined;
  private _total: HTMLSpanElement | undefined;
  private _slideWrapper: HTMLDivElement | undefined;
  private _anchor: HTMLAnchorElement | undefined;
  private _isSliding = false;
  private _pointerStartX = 0;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({
      mode: "open",
    });
  }

  private async setUpTemplate() {
    try {
      const response = await this.fetchChannel(this._channel ?? "arena_slider");
      const { template } = generateTemplate(response);
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.setupEventListeners();
      this.setSlideHeight();
    } catch (e) {
      console.log(e);
    }
  }

  static get observedAttributes() {
    return ["channel", "width", "height"];
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    const host = this._shadowRoot.querySelector(":host") as HTMLElement;
    switch (name) {
      case "channel":
        this._channel = newValue;
        break;
      case "width":
        host?.style.setProperty("--ar-w", newValue);
        break;
      case "height":
        host?.style.setProperty("--ar-h", newValue);
        break;
      default:
        return;
    }
  }

  private fetchChannel(channel: string): Promise<ArenaResponse> {
    const randomString = Math.random().toString(16).slice(2);
    const contentUrl = `https://api.are.na/v2/channels/${channel}?sort=position&order=asc&per=100?nocache=${randomString}`;
    return fetch(contentUrl).then((response) => response.json());
  }

  async render() {
    await this.setUpTemplate();
  }

  connectedCallback() {
    this.render();
  }

  private setupEventListeners() {
    this._nextButton = this._shadowRoot.querySelector(
      "#next-button"
    ) as HTMLButtonElement;
    this._prevButton = this._shadowRoot.querySelector(
      "#prev-button"
    ) as HTMLButtonElement;
    this._slides = this._shadowRoot.querySelectorAll(".slide");
    this._descriptionContainer = this._shadowRoot.querySelector(
      ".description"
    ) as HTMLDivElement;
    this._description = this._shadowRoot.querySelector(
      "#description"
    ) as HTMLParagraphElement;
    this._current = this._shadowRoot.querySelector(
      "#current"
    ) as HTMLSpanElement;
    this._total = this._shadowRoot.querySelector("#total") as HTMLSpanElement;
    this._slideWrapper = this._shadowRoot.querySelector(
      ".arena_slide_wrapper"
    ) as HTMLDivElement;
    const slideWidth = this._slides[0].clientWidth;
    this._anchor = this._descriptionContainer.querySelector(
      "a"
    ) as HTMLAnchorElement;

    this._total.innerHTML = `${this._slides.length}`;
    this._current.innerHTML = "1";
    this._slideWrapper.style.transform = `translateX(${
      -slideWidth * this._counter
    }px)`;

    this._nextButton?.addEventListener("click", this.slideFrame.bind(this, 1));
    this._prevButton?.addEventListener("click", this.slideFrame.bind(this, -1));
    window.addEventListener("resize", this.resize.bind(this));
    this._slideWrapper.onpointerdown = this.pointerDown.bind(this);
    this._slideWrapper.ontouchstart = this.pointerDown.bind(this);

    this.updateDescription();
  }

  private slideFrame(offset: number) {
    if (!this._slides || !this._slideWrapper || this._isSliding) return;

    this._isSliding = true;

    const newCounter = this._counter + offset;
    if (newCounter < 0 || newCounter > this._slides.length - 1) {
      this._isSliding = false;
      return;
    }

    this._slideWrapper.style.transition = "transform 0.4s ease-in-out";
    this._counter = newCounter;
    this._slideWrapper.style.transform = `translateX(${
      -this._slides[0].clientWidth * this._counter
    }px)`;
    this.updateDescription();

    setTimeout(() => {
      this._isSliding = false;
    }, 400);
  }

  private updateDescription() {
    if (
      !this._slides ||
      !this._description ||
      !this._anchor ||
      !this._descriptionContainer ||
      !this._current
    ) {
      return;
    }

    const slide = this._slides[this._counter];
    this._description.innerHTML = slide.getAttribute("data-description") || "";
    const slideLink = slide.getAttribute("data-link");

    if (slideLink && slideLink !== "undefined") {
      this._anchor.setAttribute("href", slideLink);
      this._anchor.innerHTML = "◉ Link";
    } else {
      this._anchor.setAttribute("href", "#");
      this._anchor.innerHTML = "";
    }

    const hasDescription = this._description.innerHTML !== "";
    const hasDescriptionOrLink =
      hasDescription || (slideLink && slideLink !== "undefined");
    this._descriptionContainer?.classList.toggle(
      "line",
      Boolean(hasDescriptionOrLink)
    );
    this._current.innerHTML = `${this._counter + 1}`;
  }

  private setSlideHeight() {
    if (!this._slides) return;
    const slideWidth = this._slides[0].clientWidth;
    this._slides.forEach((slide) => {
      slide.style.height = `${slideWidth}px`;
    });
  }

  private resize() {
    if (!this._slides || !this._slideWrapper) return;
    const slideWidth = this._slides[0].clientWidth;
    this._slideWrapper.style.transform = `translateX(${
      -slideWidth * this._counter
    }px)`;
    this.setSlideHeight();
  }

  private pointerDown(e: PointerEvent | TouchEvent) {
    if (!this._slideWrapper || !this._slides) return;
    e.preventDefault();
    this._isSliding = true;
    this._pointerStartX =
      (e as PointerEvent).clientX || (e as TouchEvent).touches[0].clientX;
    this._slideWrapper.style.transition = "none";
    this._slides[this._counter].style.cursor = "grabbing";
    document.onpointerup = this.pointerUp.bind(this);
    document.onpointermove = this.pointerMove.bind(this);
    document.ontouchstart = this.pointerDown.bind(this);
    document.ontouchend = this.pointerUp.bind(this);
    document.ontouchmove = this.pointerMove.bind(this);
  }

  private pointerUp(e: PointerEvent | TouchEvent) {
    if (!this._slideWrapper || !this._slides) return;
    e.preventDefault();
    this._isSliding = false;
    const threshold = this._slides[0].clientWidth / 2;
    const x =
      (e as PointerEvent).clientX ||
      (e as TouchEvent).changedTouches[0].clientX;
    const diff = this._pointerStartX - x;
    this._slideWrapper.style.transition = "transform 0.2s ease-in-out";
    if (diff > threshold) {
      this.slideFrame(1);
    } else if (diff < -threshold) {
      this.slideFrame(-1);
    } else {
      this._slideWrapper.style.transform = `translateX(${
        -this._slides[0].clientWidth * this._counter
      }px)`;
    }
    document.onpointerup = null;
    document.onpointermove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
  }

  private pointerMove(e: PointerEvent | TouchEvent) {
    if (!this._isSliding || !this._slideWrapper || !this._slides) return;
    e.preventDefault();
    const x =
      (e as PointerEvent).clientX ||
      (e as TouchEvent).changedTouches[0].clientX;
    const slideWidth = this._slides[0].clientWidth;
    const diff = this._pointerStartX - x;
    if (this._counter === 0 && diff < 0) return;
    if (this._counter === this._slides.length - 1 && diff > 0) return;
    this._slideWrapper.style.transform = `translateX(calc(${
      -slideWidth * this._counter
    }px - ${diff}px))`;
  }
}
