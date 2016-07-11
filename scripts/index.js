import RangeSlider from './range-slider';

export default class Index {
    constructor() {
        this.dataComponents = document.querySelectorAll("[data-component]");
        if (this.dataComponents.length > 0) {
            this.dataComponents = Array.prototype.slice.call(this.dataComponents);
            this.loadDataComponents();
        }
    }

    loadDataComponents() {
        this.dataComponents.forEach(function (component) {
            var componentName = component.getAttribute("data-component");
            var componentOptions = component.getAttribute("data-component-options");
            if (!!componentOptions) {
                try {
                    componentOptions = JSON.parse(componentOptions);
                }
                catch(ex) {
                    console.log("Component options: ", componentOptions, " is not valid json");
                }
            }
            switch (componentName) {
                case "RangeSlider":
                    new RangeSlider(component, componentOptions);
                    break;
                }
            });
    };
}

new Index();