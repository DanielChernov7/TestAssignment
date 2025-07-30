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
    }

    init() {
        this.injectStyles();
        this.renderSlides();
        this.addListeners();
        console.log('Ad rendered.');
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
          .carousel-slide {
            position: absolute;
            width: 100%;
            height: 100%;
            padding: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: transform 0.4s ease, opacity 0.4s ease;
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
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
    }

    addListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === 'ArrowLeft') this.prevSlide();
        });

        this.container.addEventListener('mousedown', e => {
            this.startX = e.clientX;
        });
        this.container.addEventListener('mouseup', e => {
            if (this.startX === null) return;
            const dx = e.clientX - this.startX;
            if (dx > 50) this.prevSlide();
            else if (dx < -50) this.nextSlide();
            this.startX = null;
        });

        this.container.addEventListener('touchstart', e => {
            if (e.touches.length === 1) this.startX = e.touches[0].clientX;
        });
        this.container.addEventListener('touchend', e => {
            if (this.startX === null) return;
            const dx = e.changedTouches[0].clientX - this.startX;
            if (dx > 50) this.prevSlide();
            else if (dx < -50) this.nextSlide();
            this.startX = null;
        });
    }
}

// 👇 Запуск компонента
const ad = new CarouselAd(document.getElementById('ad-container'));
ad.init();