class MapElement {
    element;
    id = '';
    tag = '';
    title = '';
    description = '';

    constructor(element) {
        this.element = $(element);
        this.id = this.element.attr('data-id');
        this.tag = this.element.prop('tagName');

        this.element.attr('style', '');
    }

    addTexts(title, description) {
        this.title = title;
        this.description = description;
    }

    toSVG() {
        return $(this.element[0].cloneNode());
    }

    toInfo() {
        return `<h2>${this.title}</h2><div class="description">${this.description}</div>`;
    }
}

class MapClass {
    elements = {};
    container = null;

    constructor(settings) {
        this.settings = settings;
        this.container = $(settings.container);

        this.loadImage();

        const promise = this.loadSVG();

        promise.then(async () => {
            await this.loadDescriptions();
            console.log(this.elements);

            this.events();
        });
    }

    loadImage() {
        const img = new Image();
        img.src = this.settings.map;
        img.onload = () => {
            $('.svg-full-size', this.container)
                .attr('xlink:href', img.src)
                .attr('width', img.width)
                .attr('height', img.height);

            $('.map-svg', this.container)[0]
                .setAttribute('viewBox', `0 0 ${img.width} ${img.height}`);

            console.log(img.width, img.height);
        };
        console.log(img);
    }

    async loadSVG() {
        return new Promise(resolve => {
            $.ajax({
                url: this.settings.svg,
                success: (response) => {
                    const svg = $(response);

                    $('[data-id]', svg).each((i, element) => {
                        this.registerElement(element);
                    })

                    resolve(svg);
                }
            });
        });
    }

    registerElement(element) {
        const mapElement = new MapElement(element);

        this.elements[mapElement.id] = mapElement;

        $('.map-mask', this.container).append(mapElement.toSVG());

        const hoverElement = mapElement.toSVG()
        $('.map-hover-elements', this.container).append(hoverElement);

        console.log(mapElement.id);
    }

    async loadDescriptions() {
        return new Promise(resolve => {
            $.ajax({
                url: this.settings.descriptions,
                contentType: `text/plain; charset=${this.settings.unicode ? 'utf-8' : 'windows-1251'}`,
                success: (response) => {
                    const html = $('<div></div>').html(response);

                    $('.element-content', html).each((i, element) => {
                        const id = element.id;
                        this.elements[id].addTexts(
                            $('h2', element).html(),
                            $('.description', element).html(),
                        );
                    })

                    resolve();
                }
            });
        });
    }

    setSingleHoverElementClass(id, className) {
        $('.map-svg .map-mask :not(.map-mask-bg)', this.container).each((_, elem) => {
            const elemId = $(elem).attr('data-id');
            elem.classList.toggle(className, elemId === id);
        });
    }

    mouseOver(id) {
        this.container.toggleClass('has-hover', id !== null);

        this.setSingleHoverElementClass(id, 'hover');

        if (id !== null) {
            $('.map-tooltip', this.container).html(this.elements[id].title);
        }
    }

    click(id) {
        if (id && this.container.hasClass('has-active') &&
            ($('.map-svg .map-mask .active:not(map-mask-bg)').attr('data-id') === id)
        ) {
            this.click(null);
            return;
        }

        this.container.toggleClass('has-active', id !== null);

        this.setSingleHoverElementClass(id, 'active');

        if (id !== null) {
            $('.map-info .map-info-content', this.container)
                .html(this.elements[id].toInfo());
        }
    }

    fullscreen() {
        if (!document.fullscreenElement) {
            this.container[0].requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    events() {
        $('.map-hover-elements > *', this.container).on('mouseover', e => {
            const target = e.currentTarget;
            const id = $(target).attr('data-id');

            this.mouseOver(id);
        }).on('mouseout', e => {
            this.mouseOver(null);
        }).on('click', e => {
            const target = e.currentTarget;
            const id = $(target).attr('data-id');

            this.click(id);
        });

        $(this.container).on('mousemove', e => {
            $('.map-tooltip', this.container)
                .css('left', e.offsetX + 'px')
                .css('top', e.offsetY + 'px')
        }).on('fullscreenchange', e => {
            this.container.toggleClass('fullscreen', !!document.fullscreenElement);
        });

        $('.map-info button', this.container).on('click', e => {
            this.click(null);
            e.preventDefault();
        });

        $('.map-fullscreen', this.container).on('click', e => {
            this.fullscreen();
            e.preventDefault();
        });
    }
}

async function Init(settings) {
    console.log("Ready!", settings);

    window.Map = new MapClass(settings);
}
