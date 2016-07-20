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

        if (this.rangeValues.length === 0 || this.rangeValues.length !== this.rangePercentages.length)
            return;

        this.elementStart = this.getLeftPosition(element);
        this.elementWidth = element.offsetWidth;
        this.intervalTrack = element.querySelector(".slider-interval");
        this.minHandle = element.querySelector('div[data-slider-handle="min"]');
        this.maxHandle = element.querySelector('div[data-slider-handle="max"]');
        this.minHandleLabel = element.querySelector('input[data-slider-handle="min"]');
        this.maxHandleLabel = element.querySelector('input[data-slider-handle="max"]');

        if (!this.minHandle || !this.maxHandle || !this.minHandleLabel || !this.maxHandleLabel) {
            console.log("Missing needed elements");
            return;
        }

        this.setupHandlers();
        this.activeHandle = null;
    }

    setupHandlers() {
        this.minHandle.addEventListener("mousedown", e => this.startSlide(e, {
                getPosition: position => this.getMinHandlePosition(position),
                label: this.minHandleLabel
        }), false);

        this.maxHandle.addEventListener("mousedown", e => this.startSlide(e, {
            getPosition: position => this.getMaxHandlePosition(position),
            label: this.maxHandleLabel
        }), false);

        document.addEventListener("mouseup", e => this.handleStop(e), false);
        document.addEventListener("mousemove", e => this.handleMove(e), false);

        this.minHandleLabel.addEventListener("blur", e => this.handleValueInput(e, {
            handle: this.minHandle,
            getPosition: position => this.getMinHandlePosition(position)
        }), false);

        this.maxHandleLabel.addEventListener("blur", e => this.handleValueInput(e, {
            handle: this.maxHandle,
            getPosition: position => this.getMaxHandlePosition(position)
        }), false);

        if (!isNaN(this.element.dataset.startValue)) {
            const percentage = this.calculateHandlePosition(this.element.dataset.startValue);
            const position = percentage/100 * this.elementWidth;
            this.setHandlePosition(this.minHandle, this.minHandleLabel, position, this.element.dataset.startValue);
        }

        if (!isNaN(this.element.dataset.endValue)) {
            const percentage = this.calculateHandlePosition(this.element.dataset.endValue);
            const position = percentage/100 * this.elementWidth;
            this.setHandlePosition(this.maxHandle, this.maxHandleLabel, position, this.element.dataset.endValue);
        }
    }

    getMouseOffset(e)  {
        return e.pageX - this.elementStart - this.activeHandle.offset + (this.activeHandle.element.offsetWidth/2);
    }

    startSlide(e, data) {
        this.activeHandle = {
            element: e.target,
            label: data.label,
            getPosition: data.getPosition,
            offset: e.offsetX
        };
        e.target.classList.add("active")
        return false;
    }

    handleMove(e) {
        if (this.activeHandle)  {
            let position = this.getMouseOffset(e);
            position = this.activeHandle.getPosition(position);
            const value = this.calculateHandleValue(position);
            this.setHandlePosition(this.activeHandle.element, this.activeHandle.label, position, value);
            return false;
        }
    }

    handleValueInput(e, data) {
        const inputValue = e.target.value;
        if (isNaN(inputValue)) return;

        const percentage = this.calculateHandlePosition(inputValue);
        let position = percentage/100 * this.elementWidth;
        position = data.getPosition(position);
        const value = this.calculateHandleValue(position);
        this.setHandlePosition(data.handle, e.target, position, value);
        return false;
    }

    setHandlePosition(handle, label, position, value) {
        label.value = value.toString();
        if (handle.getAttribute("data-slider-handle") === "max")
            handle.style.left = `${position - handle.offsetWidth}px`;
        else
            handle.style.left = `${position}px`;
        this.setActiveInterval();
    }

    calculateHandleValue(position) {
        const percentage = position/this.elementWidth * 100;
        console.log(position, percentage);
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

    getMinHandlePosition(position) {
        if (position < 0)
            return 0;
        if (position + this.minHandle.offsetWidth > this.maxHandle.offsetLeft) {
            this.minHandle.style.zIndex = 5;
            this.maxHandle.style.zIndex = 1;
        }
        if (position > this.maxHandle.offsetLeft)
            return this.maxHandle.offsetLeft;
        return position;
    }

    getMaxHandlePosition(position) {
        if (position < this.minHandle.offsetLeft + this.maxHandle.offsetWidth) {
            this.maxHandle.style.zIndex = 5;
            this.minHandle.style.zIndex = 1;
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
        if (!this.activeHandle)
            return;
        this.activeHandle.element.classList.remove("active");
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
