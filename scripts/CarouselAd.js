import { animate, easeOutQuad } from './animate.js';


export class CarouselAd {
    constructor(container) {
        this.container = container;
        this.slides = [
            { title: 'Summer Sale!', subtitle: 'Up to 50% off.', cta: 'Shop Now', bgColor: '#ffcc00' },
            { title: 'New Arrivals', subtitle: 'See what’s new.', cta: 'Explore', bgColor: '#66ccff' },
            { title: 'Limited Time', subtitle: 'Only this weekend.', cta: 'Grab Deal', bgColor: '#99e699' },
        ];
        this.currentSlide = 0;
        this.slideElements = [];
        this.startX = null;
        this.dragging = false;
        this.dragStartX = 0;
        this.dragCurrentX = 0;
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
    #ad-container {
      position: relative;
      width: 100%;
      height: 300px; /* или нужная высота */
      overflow: hidden;
    }
    .carousel-slide {
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: none; /* анимации в js */
      will-change: transform, opacity;
    }
    .carousel-title { font-size: 16px; font-weight: bold; }
    .carousel-subtitle { font-size: 11px; margin-top: 4px; }
    .carousel-cta {
      align-self: flex-end;
      padding: 4px 8px;
      background: #000;
      color: #fff;
      font-size: 11px;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    .carousel-cta:hover { transform: scale(1.05); }
  `;
        document.head.appendChild(style);
    }


    animateToSlide(newIndex) {
        if (newIndex === this.currentSlide) return;

        const direction = newIndex > this.currentSlide ? 1 : -1;
        const width = this.container.offsetWidth;
        const current = this.slideElements[this.currentSlide];
        const next = this.slideElements[newIndex];

        next.style.transition = 'none';
        next.style.transform = `translateX(${direction * width}px)`;
        next.style.opacity = '1';

        animate({
            from: 0,
            to: 1,
            duration: 500,
            easing: easeOutQuad,
            onUpdate: (t) => {
                const move = width * (1 - t);

                current.style.transform = `translateX(${-direction * move}px)`;
                current.style.opacity = `${1 - t}`;

                next.style.transform = `translateX(${direction * (move - width)}px)`;
                next.style.opacity = `${t}`;
            },
            onComplete: () => {
                this.currentSlide = newIndex;
                this.updateSlides(); // Snap positions and cleanup
            }
        });
    }

    init() {
        this.injectStyles();
        this.renderSlides();
        this.addListeners();
        console.log('Ad rendered.');
    }

    renderSlides() {
        this.container.innerHTML = '';
        this.slideElements = this.slides.map((data, i) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.style.background = data.bgColor;
            slide.style.transform = `translateX(${i === this.currentSlide ? 0 : i < this.currentSlide ? '-100%' : '100%'})`;
            slide.style.opacity = i === this.currentSlide ? '1' : '0';

            const title = document.createElement('div');
            title.className = 'carousel-title';
            title.textContent = data.title;

            const subtitle = document.createElement('div');
            subtitle.className = 'carousel-subtitle';
            subtitle.textContent = data.subtitle;

            const cta = document.createElement('div');
            cta.className = 'carousel-cta';
            cta.textContent = data.cta;
            cta.addEventListener('click', () => {
                console.log(`CTA clicked on slide ${i} at ${Date.now()}`);
            });

            slide.appendChild(title);
            slide.appendChild(subtitle);
            slide.appendChild(cta);

            this.container.appendChild(slide);
            return slide;
        });
    }

    updateSlides() {
        this.slideElements.forEach((slide, i) => {
            if (i === this.currentSlide) {
                slide.style.transform = 'translateX(0)';
                slide.style.opacity = '1';
            } else if (i < this.currentSlide) {
                slide.style.transform = 'translateX(-100%)';
                slide.style.opacity = '0';
            } else {
                slide.style.transform = 'translateX(100%)';
                slide.style.opacity = '0';
            }
        });
        console.log(`Slide changed to index ${this.currentSlide}`);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.animateToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.animateToSlide(prevIndex);
    }

    startDrag(x) {
        this.dragging = true;
        this.dragStartX = x;
        this.dragCurrentX = x;
    }

    onDrag(x) {
        if (!this.dragging) return;
        this.dragCurrentX = x;
        const dx = this.dragCurrentX - this.dragStartX;

        this.slideElements.forEach((slide, i) => {
            const offset = (i - this.currentSlide) * this.container.offsetWidth + dx;
            slide.style.transition = 'none';
            slide.style.transform = `translateX(${offset}px)`;
            slide.style.opacity = i === this.currentSlide ? '1' : '0.7';
        });
    }

    endDrag(x) {
        if (!this.dragging) return;
        const dx = x - this.dragStartX;
        this.dragging = false;

        if (Math.abs(dx) > 50) {
            dx < 0 ? this.nextSlide() : this.prevSlide();
        } else {
            this.updateSlides(); // Snap back
        }
    }

    addListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === 'ArrowLeft') this.prevSlide();
        });

        // Mouse events
        this.container.addEventListener('mousedown', e => this.startDrag(e.clientX));
        document.addEventListener('mousemove', e => this.onDrag(e.clientX));
        document.addEventListener('mouseup', e => this.endDrag(e.clientX));

        // Touch events
        this.container.addEventListener('touchstart', e => this.startDrag(e.touches[0].clientX));
        this.container.addEventListener('touchmove', e => this.onDrag(e.touches[0].clientX));
        this.container.addEventListener('touchend', e => this.endDrag(e.changedTouches[0].clientX));
    }
}

// 👇 Запуск компонента
const ad = new CarouselAd(document.getElementById('ad-container'));
ad.init();