class RangeSlider {

    constructor(element) {
        this.element = element;
        this.rangeValues = [];
        this.rangePercentages = [];
        element.dataset.sliderValues.split(",").forEach(item => {
           if (!isNaN(parseFloat(item.trim())))
            this.rangeValues.push(parseFloat(item.trim()));
        });
        element.dataset.sliderPercentages.split(",").forEach(item => {
            if (!isNaN(parseFloat(item.trim())))
                this.rangePercentages.push(parseFloat(item.trim()));
        });

        if (!this.rangeValues.length === 0|| this.rangeValues.length !== this.rangePercentages.length)
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
        const percentage = position/this.elementWidth * 100;
        console.log(percentage);
        const rangeSection = this.getRangeSectionByPercentage(percentage);
        const values = this.getSectionValues(rangeSection);
        return Math.ceil((percentage - values.startPercentage) * (values.value * values.ratio) / 100 + values.startValue);
    }

    calculateHandlePosition(value) {
        const rangeSection = this.getRangeSectionByValue(value);
        const values = this.getSectionValues(rangeSection);
        return (value - values.startValue) / (values.value * values.ratio) * 100 + values.startPercentage;
    }

    getSectionValues(rangeSection) {
        const sectionValues = {
            startValue: this.rangeValues[rangeSection - 1],
            endValue: this.rangeValues[rangeSection],
            startPercentage: this.rangePercentages[rangeSection - 1],
            endPercentage: this.rangePercentages[rangeSection],
        };
        sectionValues.value = sectionValues.endValue - sectionValues.startValue;
        sectionValues.percentage = sectionValues.endPercentage - sectionValues.startPercentage;
        sectionValues.ratio = 100/sectionValues.percentage;

        return sectionValues;
    }

    getRangeSectionByPercentage(percentage) {
        let section = 1;
        while(percentage > this.rangePercentages[section]) {
            section++;
        }
        return section;
    }

    getRangeSectionByValue(value) {
        let section = 1;
        while(value > this.rangeValues[section]) {
            section++;
        }
        return section;
    }

    setMinPosition(position) {
        if (position < 0)
            return 0;
        if (position > this.maxHandle.offsetLeft) {
            this.minHandle.style.zIndex = 2;
            return this.maxHandle.offsetLeft;
        }
        return position;
    }

    setMaxPosition(position) {
        if (position < this.minHandle.offsetLeft) {
            this.maxHandle.style.zIndex = 2;
            return this.minHandle.offsetLeft;
        }
        if (position > this.getMaxPosition())
            return this.elementWidth;
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
