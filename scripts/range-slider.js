class RangeSlider {

    constructor(element) {
        this.element = element;
        this.rangeStart = parseFloat(element.dataset.sliderStart);
        this.rangeEnd = parseFloat(element.dataset.sliderEnd);

        if (!this.rangeStart || !this.rangeEnd)
            return;

        this.elementStart = this.getLeftPosition(element);
        this.elementWidth = element.offsetWidth;
        this.intervalTrack = element.querySelector(".slider-interval");
        this.minHandle = element.querySelector('[data-slider-handle="min"]');
        this.maxHandle = element.querySelector('[data-slider-handle="max"]');

        if (!!this.minHandle && !!this.maxHandle)
            this.setHandlers();

        this.activeHandle = null;
    }

    setHandlers() {
        this.minHandle.addEventListener("mousedown", e => this.startSlide(e, position => this.setMinPosition(position)), false);
        this.maxHandle.addEventListener("mousedown", e => this.startSlide(e, position => this.setMaxPosition(position)), false);
        document.addEventListener("mouseup", e => this.handleStop(e), false);
        document.addEventListener("mousemove", e => this.handleMove(e), false);
    }

    getMouseOffset(e)  {
        return e.pageX - this.elementStart;
    }

    startSlide(e, data) {
        this.activeHandle = {
            element: e.target,
            setPosition: data
        };
        return false;
    }

    handleMove(e) {
        if (this.activeHandle)  {
            let position = this.getMouseOffset(e);
            position = this.activeHandle.setPosition(position);
            const value = this.calculateHandleValue(position);
            this.activeHandle.element.setAttribute("data-slider-value", value.toString());
            this.activeHandle.element.style.left = `${position}px`;
            this.setActiveInterval();
            return false;
        }
    }

    calculateHandleValue(position) {
        const percentage = position/this.elementWidth;
        console.log(percentage);

        const valueBase = this.rangeEnd - this.rangeStart;
        return (valueBase * percentage) + this.rangeStart;
    }

    setMinPosition(position) {
        if (position < 0)
            return 0;
        if (position > this.maxHandle.offsetLeft)
            return this.maxHandle.offsetLeft;
        return position;
    }

    setMaxPosition(position) {
        if (position < this.minHandle.offsetLeft)
            return this.minHandle.offsetLeft;
        if (position > this.getMaxPosition())
            return this.getMaxPosition();
        return position;
    }

    setActiveInterval() {
        this.intervalTrack.style.left = `${this.minHandle.offsetLeft}px`;
        this.intervalTrack.style.right = `${this.elementWidth - this.maxHandle.offsetLeft}px`;
    }

    handleStop() {
        this.activeHandle = null;
    }

    getLeftPosition(element)  {
        let left = 0;
        while (element.offsetParent){
            left += element.offsetLeft;
            element = element.offsetParent;
        }
        left += element.offsetLeft;
        return left;
    }

    getMaxPosition() {
        return this.elementWidth - this.maxHandle.offsetWidth;
    }


}



export default RangeSlider;
