(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rangeSlider = require("./range-slider");

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Index = function () {
    function Index() {
        _classCallCheck(this, Index);

        this.dataComponents = document.querySelectorAll("[data-component]");
        if (this.dataComponents.length > 0) {
            this.dataComponents = Array.prototype.slice.call(this.dataComponents);
            this.loadDataComponents();
        }
    }

    _createClass(Index, [{
        key: "loadDataComponents",
        value: function loadDataComponents() {
            this.dataComponents.forEach(function (component) {
                var componentName = component.getAttribute("data-component");
                var componentOptions = component.getAttribute("data-component-options");
                if (!!componentOptions) {
                    try {
                        componentOptions = JSON.parse(componentOptions);
                    } catch (ex) {
                        console.log("Component options: ", componentOptions, " is not valid json");
                    }
                }
                switch (componentName) {
                    case "RangeSlider":
                        new _rangeSlider2.default(component, componentOptions);
                        break;
                }
            });
        }
    }]);

    return Index;
}();

exports.default = Index;


new Index();

},{"./range-slider":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RangeSlider = function () {
    function RangeSlider(element) {
        var _this = this;

        _classCallCheck(this, RangeSlider);

        this.element = element;
        this.rangeValues = [];
        this.rangePercentages = [];

        element.dataset.sliderValues.split(",").forEach(function (item) {
            if (!isNaN(parseFloat(item.trim()))) _this.rangeValues.push(parseFloat(item.trim()));
        });

        element.dataset.sliderPercentages.split(",").forEach(function (item) {
            if (!isNaN(parseFloat(item.trim()))) _this.rangePercentages.push(parseFloat(item.trim()));
        });

        if (this.rangeValues.length === 0 || this.rangeValues.length !== this.rangePercentages.length) return;

        this.elementStart = this.getLeftPosition(element);
        this.elementWidth = element.offsetWidth;
        this.intervalTrack = element.querySelector(".slider-interval");

        element.setAttribute("data-start-range", this.rangeValues[0]);
        element.setAttribute("data-end-range", this.rangeValues[this.rangeValues.length - 1]);

        this.minHandle = element.querySelector('div[data-slider-handle="min"]');
        this.maxHandle = element.querySelector('div[data-slider-handle="max"]');
        this.minInput = element.querySelector('input[data-slider-handle="min"]');
        this.maxInput = element.querySelector('input[data-slider-handle="max"]');

        if (!this.minHandle || !this.maxHandle || !this.minInput || !this.maxInput) {
            console.log("Missing needed elements");
            return;
        }

        this.setupHandlers();
        this.activeHandle = null;
    }

    _createClass(RangeSlider, [{
        key: "setupHandlers",
        value: function setupHandlers() {
            var _this2 = this;

            ["touchstart", "mousedown"].forEach(function (type) {
                _this2.minHandle.addEventListener(type, function (e) {
                    return _this2.startSlide(e, {
                        getPosition: function getPosition(position) {
                            return _this2.getMinHandlePosition(position);
                        },
                        label: _this2.minInput
                    });
                }, false);

                _this2.maxHandle.addEventListener(type, function (e) {
                    return _this2.startSlide(e, {
                        getPosition: function getPosition(position) {
                            return _this2.getMaxHandlePosition(position);
                        },
                        label: _this2.maxInput
                    });
                }, false);
            });

            this.element.addEventListener("touchmove", function (e) {
                return _this2.handleMove(e);
            }, false);
            this.element.addEventListener("touchend", function (e) {
                return _this2.handleStop(e);
            }, false);
            this.element.addEventListener("touchcancel", function (e) {
                return _this2.handleStop(e);
            }, false);

            document.addEventListener("mouseup", function (e) {
                return _this2.handleStop(e);
            }, false);
            document.addEventListener("mousemove", function (e) {
                return _this2.handleMove(e);
            }, false);

            this.minInput.addEventListener("blur", function (e) {
                return _this2.handleValueInput(e, {
                    handle: _this2.minHandle,
                    getPosition: function getPosition(position) {
                        return _this2.getMinHandlePosition(position);
                    }
                });
            }, false);

            this.maxInput.addEventListener("blur", function (e) {
                return _this2.handleValueInput(e, {
                    handle: _this2.maxHandle,
                    getPosition: function getPosition(position) {
                        return _this2.getMaxHandlePosition(position);
                    }
                });
            }, false);

            if (!isNaN(this.element.dataset.startValue)) {
                var percentage = this.calculateHandlePosition(this.element.dataset.startValue);
                var position = percentage / 100 * this.elementWidth;
                this.setHandlePosition(this.minHandle, this.minInput, position, this.element.dataset.startValue);
            }

            if (!isNaN(this.element.dataset.endValue)) {
                var _percentage = this.calculateHandlePosition(this.element.dataset.endValue);
                var _position = _percentage / 100 * this.elementWidth;
                this.setHandlePosition(this.maxHandle, this.maxInput, _position, this.element.dataset.endValue);
            }
        }
    }, {
        key: "getHandleOffset",
        value: function getHandleOffset(e) {
            var pageX = e.type === "touchmove" ? e.changedTouches[0].pageX : e.pageX;
            return pageX - this.elementStart - this.activeHandle.offset + this.activeHandle.element.offsetWidth / 2;
        }
    }, {
        key: "startSlide",
        value: function startSlide(e, data) {
            this.activeHandle = {
                element: e.target,
                label: data.label,
                getPosition: data.getPosition,
                offset: e.offsetX || 0
            };
            e.target.classList.add("active");
            return false;
        }
    }, {
        key: "handleMove",
        value: function handleMove(e) {
            e.preventDefault();

            if (this.activeHandle) {
                var position = this.getHandleOffset(e);
                position = this.activeHandle.getPosition(position);
                var value = this.calculateHandleValue(position);
                this.setHandlePosition(this.activeHandle.element, this.activeHandle.label, position, value);
                return false;
            }
        }
    }, {
        key: "handleValueInput",
        value: function handleValueInput(e, data) {
            var inputValue = e.target.value;
            if (isNaN(inputValue)) return;

            var percentage = this.calculateHandlePosition(inputValue);
            var position = Math.ceil(percentage / 100 * this.elementWidth);
            position = data.getPosition(position);
            var value = this.calculateHandleValue(position);
            this.setHandlePosition(data.handle, e.target, position, value);
            return false;
        }
    }, {
        key: "setHandlePosition",
        value: function setHandlePosition(handle, label, position, value) {
            label.value = value.toString();
            label.style.left = position - label.offsetWidth / 2 + "px";
            handle.style.left = position - handle.offsetWidth / 2 + "px";
            this.setActiveInterval();
        }
    }, {
        key: "calculateHandleValue",
        value: function calculateHandleValue(position) {
            var percentage = position / this.elementWidth * 100;
            console.log(position + "px: " + percentage + "%");
            var rangeSection = this.getRangeSectionByPercentage(percentage);
            var values = this.getSectionValues(rangeSection);
            return Math.ceil((percentage - values.startPercentage) * (values.value * values.ratio) / 100 + values.startValue);
        }
    }, {
        key: "calculateHandlePosition",
        value: function calculateHandlePosition(value) {
            var rangeSection = this.getRangeSectionByValue(value);
            var values = this.getSectionValues(rangeSection);
            return (value - values.startValue) / (values.value * values.ratio) * 100 + values.startPercentage;
        }
    }, {
        key: "getSectionValues",
        value: function getSectionValues(rangeSection) {
            var sectionValues = {
                startValue: this.rangeValues[rangeSection - 1],
                endValue: this.rangeValues[rangeSection],
                startPercentage: this.rangePercentages[rangeSection - 1],
                endPercentage: this.rangePercentages[rangeSection]
            };
            sectionValues.value = sectionValues.endValue - sectionValues.startValue;
            sectionValues.percentage = sectionValues.endPercentage - sectionValues.startPercentage;
            sectionValues.ratio = 100 / sectionValues.percentage;

            return sectionValues;
        }
    }, {
        key: "getRangeSectionByPercentage",
        value: function getRangeSectionByPercentage(percentage) {
            var section = 1;
            while (percentage > this.rangePercentages[section]) {
                section++;
            }
            return section;
        }
    }, {
        key: "getRangeSectionByValue",
        value: function getRangeSectionByValue(value) {
            var section = 1;
            while (value > this.rangeValues[section]) {
                section++;
            }
            return section;
        }
    }, {
        key: "getMinHandlePosition",
        value: function getMinHandlePosition(position) {
            if (position < 0) return 0;
            if (position + this.minHandle.offsetWidth / 2 > this.maxHandle.offsetLeft) {
                this.minHandle.style.zIndex = 5;
                this.maxHandle.style.zIndex = 1;
            }
            if (position > this.maxHandle.offsetLeft + this.maxHandle.offsetWidth / 2) return this.maxHandle.offsetLeft + this.maxHandle.offsetWidth / 2;
            return position;
        }
    }, {
        key: "getMaxHandlePosition",
        value: function getMaxHandlePosition(position) {
            if (position - this.maxHandle.offsetWidth / 2 < this.minHandle.offsetLeft + this.maxHandle.offsetWidth) {
                this.maxHandle.style.zIndex = 5;
                this.minHandle.style.zIndex = 1;
            }
            if (position - this.maxHandle.offsetWidth / 2 < this.minHandle.offsetLeft) return this.minHandle.offsetLeft + this.maxHandle.offsetWidth / 2;
            if (position > this.elementWidth) return this.elementWidth;
            return position;
        }
    }, {
        key: "setActiveInterval",
        value: function setActiveInterval() {
            this.intervalTrack.style.left = this.minHandle.offsetLeft + this.maxHandle.offsetWidth / 2 + "px";
            this.intervalTrack.style.right = this.elementWidth - this.maxHandle.offsetLeft + "px";
        }
    }, {
        key: "handleStop",
        value: function handleStop() {
            if (!this.activeHandle) return;
            this.activeHandle.element.classList.remove("active");
            this.activeHandle = null;
        }
    }, {
        key: "getLeftPosition",
        value: function getLeftPosition(element) {
            var left = 0;
            while (element.offsetParent) {
                left += element.offsetLeft;
                element = element.offsetParent;
            }
            left += element.offsetLeft;
            return left;
        }
    }]);

    return RangeSlider;
}();

exports.default = RangeSlider;

},{}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2luZGV4LmpzIiwic2NyaXB0cy9yYW5nZS1zbGlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7OztJQUVxQixLO0FBQ2pCLHFCQUFjO0FBQUE7O0FBQ1YsYUFBSyxjQUFMLEdBQXNCLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQXRCO0FBQ0EsWUFBSSxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsR0FBNkIsQ0FBakMsRUFBb0M7QUFDaEMsaUJBQUssY0FBTCxHQUFzQixNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsS0FBSyxjQUFoQyxDQUF0QjtBQUNBLGlCQUFLLGtCQUFMO0FBQ0g7QUFDSjs7Ozs2Q0FFb0I7QUFDakIsaUJBQUssY0FBTCxDQUFvQixPQUFwQixDQUE0QixVQUFVLFNBQVYsRUFBcUI7QUFDN0Msb0JBQUksZ0JBQWdCLFVBQVUsWUFBVixDQUF1QixnQkFBdkIsQ0FBcEI7QUFDQSxvQkFBSSxtQkFBbUIsVUFBVSxZQUFWLENBQXVCLHdCQUF2QixDQUF2QjtBQUNBLG9CQUFJLENBQUMsQ0FBQyxnQkFBTixFQUF3QjtBQUNwQix3QkFBSTtBQUNBLDJDQUFtQixLQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUFuQjtBQUNILHFCQUZELENBR0EsT0FBTSxFQUFOLEVBQVU7QUFDTixnQ0FBUSxHQUFSLENBQVkscUJBQVosRUFBbUMsZ0JBQW5DLEVBQXFELG9CQUFyRDtBQUNIO0FBQ0o7QUFDRCx3QkFBUSxhQUFSO0FBQ0kseUJBQUssYUFBTDtBQUNJLGtEQUFnQixTQUFoQixFQUEyQixnQkFBM0I7QUFDQTtBQUhSO0FBS0MsYUFoQkw7QUFpQkg7Ozs7OztrQkEzQmdCLEs7OztBQThCckIsSUFBSSxLQUFKOzs7Ozs7Ozs7Ozs7O0lDaENNLFc7QUFFRix5QkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FB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SyxTQUFMLENBQWUsS0FBZixDQUFxQixNQUFyQixHQUE4QixDQUE5QjtBQUNIO0FBQ0QsZ0JBQUksV0FBVyxLQUFLLFNBQUwsQ0FBZSxXQUFmLEdBQTZCLENBQXhDLEdBQTRDLEtBQUssU0FBTCxDQUFlLFVBQS9ELEVBQ0ksT0FBTyxLQUFLLFNBQUwsQ0FBZSxVQUFmLEdBQTRCLEtBQUssU0FBTCxDQUFlLFdBQWYsR0FBNkIsQ0FBaEU7QUFDSixnQkFBSSxXQUFXLEtBQUssWUFBcEIsRUFDSSxPQUFPLEtBQUssWUFBWjtBQUNKLG1CQUFPLFFBQVA7QUFDSDs7OzRDQUVtQjtBQUNoQixpQkFBSyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLElBQXpCLEdBQW1DLEtBQUssU0FBTCxDQUFlLFVBQWYsR0FBNEIsS0FBSyxTQUFMLENBQWUsV0FBZixHQUE2QixDQUE1RjtBQUNBLGlCQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBeUIsS0FBekIsR0FBb0MsS0FBSyxZQUFMLEdBQW9CLEtBQUssU0FBTCxDQUFlLFVBQXZFO0FBQ0g7OztxQ0FFWTtBQUNULGdCQUFJLENBQUMsS0FBSyxZQUFWLEVBQ0k7QUFDSixpQkFBSyxZQUFMLENBQWtCLE9BQWxCLENBQTBCLFNBQTFCLENBQW9DLE1BQXBDLENBQTJDLFFBQTNDO0FBQ0EsaUJBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNIOzs7d0NBRWUsTyxFQUFTO0FBQ3JCLGdCQUFJLE9BQU8sQ0FBWDtBQUNBLG1CQUFPLFFBQVEsWUFBZixFQUE2QjtBQUN6Qix3QkFBUSxRQUFRLFVBQWhCO0FBQ0EsMEJBQVUsUUFBUSxZQUFsQjtBQUNIO0FBQ0Qsb0JBQVEsUUFBUSxVQUFoQjtBQUNBLG1CQUFPLElBQVA7QUFDSDs7Ozs7O2tCQUdVLFciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJhbmdlU2xpZGVyIGZyb20gJy4vcmFuZ2Utc2xpZGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXgge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRhdGFDb21wb25lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWNvbXBvbmVudF1cIik7XG4gICAgICAgIGlmICh0aGlzLmRhdGFDb21wb25lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YUNvbXBvbmVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmRhdGFDb21wb25lbnRzKTtcbiAgICAgICAgICAgIHRoaXMubG9hZERhdGFDb21wb25lbnRzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2FkRGF0YUNvbXBvbmVudHMoKSB7XG4gICAgICAgIHRoaXMuZGF0YUNvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbiAoY29tcG9uZW50KSB7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbXBvbmVudFwiKTtcbiAgICAgICAgICAgIHZhciBjb21wb25lbnRPcHRpb25zID0gY29tcG9uZW50LmdldEF0dHJpYnV0ZShcImRhdGEtY29tcG9uZW50LW9wdGlvbnNcIik7XG4gICAgICAgICAgICBpZiAoISFjb21wb25lbnRPcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50T3B0aW9ucyA9IEpTT04ucGFyc2UoY29tcG9uZW50T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29tcG9uZW50IG9wdGlvbnM6IFwiLCBjb21wb25lbnRPcHRpb25zLCBcIiBpcyBub3QgdmFsaWQganNvblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2ggKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiUmFuZ2VTbGlkZXJcIjpcbiAgICAgICAgICAgICAgICAgICAgbmV3IFJhbmdlU2xpZGVyKGNvbXBvbmVudCwgY29tcG9uZW50T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH07XG59XG5cbm5ldyBJbmRleCgpOyIsImNsYXNzIFJhbmdlU2xpZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5yYW5nZVZhbHVlcyA9IFtdO1xuICAgICAgICB0aGlzLnJhbmdlUGVyY2VudGFnZXMgPSBbXTtcblxuICAgICAgICBlbGVtZW50LmRhdGFzZXQuc2xpZGVyVmFsdWVzLnNwbGl0KFwiLFwiKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKCFpc05hTihwYXJzZUZsb2F0KGl0ZW0udHJpbSgpKSkpXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZVZhbHVlcy5wdXNoKHBhcnNlRmxvYXQoaXRlbS50cmltKCkpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LnNsaWRlclBlcmNlbnRhZ2VzLnNwbGl0KFwiLFwiKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKCFpc05hTihwYXJzZUZsb2F0KGl0ZW0udHJpbSgpKSkpXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZVBlcmNlbnRhZ2VzLnB1c2gocGFyc2VGbG9hdChpdGVtLnRyaW0oKSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5yYW5nZVZhbHVlcy5sZW5ndGggPT09IDAgfHwgdGhpcy5yYW5nZVZhbHVlcy5sZW5ndGggIT09IHRoaXMucmFuZ2VQZXJjZW50YWdlcy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdGhpcy5lbGVtZW50U3RhcnQgPSB0aGlzLmdldExlZnRQb3NpdGlvbihlbGVtZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50V2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICB0aGlzLmludGVydmFsVHJhY2sgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyLWludGVydmFsXCIpO1xuXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zdGFydC1yYW5nZVwiLCB0aGlzLnJhbmdlVmFsdWVzWzBdKTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWVuZC1yYW5nZVwiLCB0aGlzLnJhbmdlVmFsdWVzW3RoaXMucmFuZ2VWYWx1ZXMubGVuZ3RoIC0gMV0pO1xuXG4gICAgICAgIHRoaXMubWluSGFuZGxlID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbZGF0YS1zbGlkZXItaGFuZGxlPVwibWluXCJdJyk7XG4gICAgICAgIHRoaXMubWF4SGFuZGxlID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbZGF0YS1zbGlkZXItaGFuZGxlPVwibWF4XCJdJyk7XG4gICAgICAgIHRoaXMubWluSW5wdXQgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W2RhdGEtc2xpZGVyLWhhbmRsZT1cIm1pblwiXScpO1xuICAgICAgICB0aGlzLm1heElucHV0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtkYXRhLXNsaWRlci1oYW5kbGU9XCJtYXhcIl0nKTtcblxuICAgICAgICBpZiAoIXRoaXMubWluSGFuZGxlIHx8ICF0aGlzLm1heEhhbmRsZSB8fCAhdGhpcy5taW5JbnB1dCB8fCAhdGhpcy5tYXhJbnB1dCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJNaXNzaW5nIG5lZWRlZCBlbGVtZW50c1wiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0dXBIYW5kbGVycygpO1xuICAgICAgICB0aGlzLmFjdGl2ZUhhbmRsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgc2V0dXBIYW5kbGVycygpIHtcblxuICAgICAgICBbXCJ0b3VjaHN0YXJ0XCIsIFwibW91c2Vkb3duXCJdLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1pbkhhbmRsZS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGUgPT4gdGhpcy5zdGFydFNsaWRlKGUsIHtcbiAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbjogcG9zaXRpb24gPT4gdGhpcy5nZXRNaW5IYW5kbGVQb3NpdGlvbihwb3NpdGlvbiksXG4gICAgICAgICAgICAgICAgbGFiZWw6IHRoaXMubWluSW5wdXRcbiAgICAgICAgICAgIH0pLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIHRoaXMubWF4SGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZSA9PiB0aGlzLnN0YXJ0U2xpZGUoZSwge1xuICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uOiBwb3NpdGlvbiA9PiB0aGlzLmdldE1heEhhbmRsZVBvc2l0aW9uKHBvc2l0aW9uKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogdGhpcy5tYXhJbnB1dFxuICAgICAgICAgICAgfSksIGZhbHNlKVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBlID0+IHRoaXMuaGFuZGxlTW92ZShlKSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGUgPT4gdGhpcy5oYW5kbGVTdG9wKGUpLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hjYW5jZWxcIiwgZSA9PiB0aGlzLmhhbmRsZVN0b3AoZSksIGZhbHNlKTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBlID0+IHRoaXMuaGFuZGxlU3RvcChlKSwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGUgPT4gdGhpcy5oYW5kbGVNb3ZlKGUpLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5taW5JbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBlID0+IHRoaXMuaGFuZGxlVmFsdWVJbnB1dChlLCB7XG4gICAgICAgICAgICBoYW5kbGU6IHRoaXMubWluSGFuZGxlLFxuICAgICAgICAgICAgZ2V0UG9zaXRpb246IHBvc2l0aW9uID0+IHRoaXMuZ2V0TWluSGFuZGxlUG9zaXRpb24ocG9zaXRpb24pXG4gICAgICAgIH0pLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5tYXhJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBlID0+IHRoaXMuaGFuZGxlVmFsdWVJbnB1dChlLCB7XG4gICAgICAgICAgICBoYW5kbGU6IHRoaXMubWF4SGFuZGxlLFxuICAgICAgICAgICAgZ2V0UG9zaXRpb246IHBvc2l0aW9uID0+IHRoaXMuZ2V0TWF4SGFuZGxlUG9zaXRpb24ocG9zaXRpb24pXG4gICAgICAgIH0pLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKCFpc05hTih0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGFydFZhbHVlKSkge1xuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuY2FsY3VsYXRlSGFuZGxlUG9zaXRpb24odGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhcnRWYWx1ZSk7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHBlcmNlbnRhZ2UgLyAxMDAgKiB0aGlzLmVsZW1lbnRXaWR0aDtcbiAgICAgICAgICAgIHRoaXMuc2V0SGFuZGxlUG9zaXRpb24odGhpcy5taW5IYW5kbGUsIHRoaXMubWluSW5wdXQsIHBvc2l0aW9uLCB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGFydFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNOYU4odGhpcy5lbGVtZW50LmRhdGFzZXQuZW5kVmFsdWUpKSB7XG4gICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gdGhpcy5jYWxjdWxhdGVIYW5kbGVQb3NpdGlvbih0aGlzLmVsZW1lbnQuZGF0YXNldC5lbmRWYWx1ZSk7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHBlcmNlbnRhZ2UgLyAxMDAgKiB0aGlzLmVsZW1lbnRXaWR0aDtcbiAgICAgICAgICAgIHRoaXMuc2V0SGFuZGxlUG9zaXRpb24odGhpcy5tYXhIYW5kbGUsIHRoaXMubWF4SW5wdXQsIHBvc2l0aW9uLCB0aGlzLmVsZW1lbnQuZGF0YXNldC5lbmRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRIYW5kbGVPZmZzZXQoZSkge1xuICAgICAgICBjb25zdCBwYWdlWCA9IGUudHlwZSA9PT0gXCJ0b3VjaG1vdmVcIiA/IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggOiBlLnBhZ2VYO1xuICAgICAgICByZXR1cm4gcGFnZVggLSB0aGlzLmVsZW1lbnRTdGFydCAtIHRoaXMuYWN0aXZlSGFuZGxlLm9mZnNldCArICh0aGlzLmFjdGl2ZUhhbmRsZS5lbGVtZW50Lm9mZnNldFdpZHRoIC8gMik7XG4gICAgfVxuXG4gICAgc3RhcnRTbGlkZShlLCBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlSGFuZGxlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogZS50YXJnZXQsXG4gICAgICAgICAgICBsYWJlbDogZGF0YS5sYWJlbCxcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiBkYXRhLmdldFBvc2l0aW9uLFxuICAgICAgICAgICAgb2Zmc2V0OiBlLm9mZnNldFggfHwgMFxuICAgICAgICB9O1xuICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBoYW5kbGVNb3ZlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUhhbmRsZSkge1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5nZXRIYW5kbGVPZmZzZXQoZSk7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuYWN0aXZlSGFuZGxlLmdldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jYWxjdWxhdGVIYW5kbGVWYWx1ZShwb3NpdGlvbik7XG4gICAgICAgICAgICB0aGlzLnNldEhhbmRsZVBvc2l0aW9uKHRoaXMuYWN0aXZlSGFuZGxlLmVsZW1lbnQsIHRoaXMuYWN0aXZlSGFuZGxlLmxhYmVsLCBwb3NpdGlvbiwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlVmFsdWVJbnB1dChlLCBkYXRhKSB7XG4gICAgICAgIGNvbnN0IGlucHV0VmFsdWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgaWYgKGlzTmFOKGlucHV0VmFsdWUpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuY2FsY3VsYXRlSGFuZGxlUG9zaXRpb24oaW5wdXRWYWx1ZSk7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IE1hdGguY2VpbChwZXJjZW50YWdlIC8gMTAwICogdGhpcy5lbGVtZW50V2lkdGgpO1xuICAgICAgICBwb3NpdGlvbiA9IGRhdGEuZ2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuY2FsY3VsYXRlSGFuZGxlVmFsdWUocG9zaXRpb24pO1xuICAgICAgICB0aGlzLnNldEhhbmRsZVBvc2l0aW9uKGRhdGEuaGFuZGxlLCBlLnRhcmdldCwgcG9zaXRpb24sIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHNldEhhbmRsZVBvc2l0aW9uKGhhbmRsZSwgbGFiZWwsIHBvc2l0aW9uLCB2YWx1ZSkge1xuICAgICAgICBsYWJlbC52YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIGxhYmVsLnN0eWxlLmxlZnQgPSBgJHtwb3NpdGlvbiAtIGxhYmVsLm9mZnNldFdpZHRoIC8gMn1weGA7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gYCR7cG9zaXRpb24gLSBoYW5kbGUub2Zmc2V0V2lkdGggLyAyfXB4YDtcbiAgICAgICAgdGhpcy5zZXRBY3RpdmVJbnRlcnZhbCgpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUhhbmRsZVZhbHVlKHBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSBwb3NpdGlvbiAvIHRoaXMuZWxlbWVudFdpZHRoICogMTAwO1xuICAgICAgICBjb25zb2xlLmxvZyhgJHtwb3NpdGlvbn1weDogJHtwZXJjZW50YWdlfSVgKTtcbiAgICAgICAgY29uc3QgcmFuZ2VTZWN0aW9uID0gdGhpcy5nZXRSYW5nZVNlY3Rpb25CeVBlcmNlbnRhZ2UocGVyY2VudGFnZSk7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0U2VjdGlvblZhbHVlcyhyYW5nZVNlY3Rpb24pO1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChwZXJjZW50YWdlIC0gdmFsdWVzLnN0YXJ0UGVyY2VudGFnZSkgKiAodmFsdWVzLnZhbHVlICogdmFsdWVzLnJhdGlvKSAvIDEwMCArIHZhbHVlcy5zdGFydFZhbHVlKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVIYW5kbGVQb3NpdGlvbih2YWx1ZSkge1xuICAgICAgICBjb25zdCByYW5nZVNlY3Rpb24gPSB0aGlzLmdldFJhbmdlU2VjdGlvbkJ5VmFsdWUodmFsdWUpO1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldFNlY3Rpb25WYWx1ZXMocmFuZ2VTZWN0aW9uKTtcbiAgICAgICAgcmV0dXJuICh2YWx1ZSAtIHZhbHVlcy5zdGFydFZhbHVlKSAvICh2YWx1ZXMudmFsdWUgKiB2YWx1ZXMucmF0aW8pICogMTAwICsgdmFsdWVzLnN0YXJ0UGVyY2VudGFnZTtcbiAgICB9XG5cbiAgICBnZXRTZWN0aW9uVmFsdWVzKHJhbmdlU2VjdGlvbikge1xuICAgICAgICBjb25zdCBzZWN0aW9uVmFsdWVzID0ge1xuICAgICAgICAgICAgc3RhcnRWYWx1ZTogdGhpcy5yYW5nZVZhbHVlc1tyYW5nZVNlY3Rpb24gLSAxXSxcbiAgICAgICAgICAgIGVuZFZhbHVlOiB0aGlzLnJhbmdlVmFsdWVzW3JhbmdlU2VjdGlvbl0sXG4gICAgICAgICAgICBzdGFydFBlcmNlbnRhZ2U6IHRoaXMucmFuZ2VQZXJjZW50YWdlc1tyYW5nZVNlY3Rpb24gLSAxXSxcbiAgICAgICAgICAgIGVuZFBlcmNlbnRhZ2U6IHRoaXMucmFuZ2VQZXJjZW50YWdlc1tyYW5nZVNlY3Rpb25dLFxuICAgICAgICB9O1xuICAgICAgICBzZWN0aW9uVmFsdWVzLnZhbHVlID0gc2VjdGlvblZhbHVlcy5lbmRWYWx1ZSAtIHNlY3Rpb25WYWx1ZXMuc3RhcnRWYWx1ZTtcbiAgICAgICAgc2VjdGlvblZhbHVlcy5wZXJjZW50YWdlID0gc2VjdGlvblZhbHVlcy5lbmRQZXJjZW50YWdlIC0gc2VjdGlvblZhbHVlcy5zdGFydFBlcmNlbnRhZ2U7XG4gICAgICAgIHNlY3Rpb25WYWx1ZXMucmF0aW8gPSAxMDAgLyBzZWN0aW9uVmFsdWVzLnBlcmNlbnRhZ2U7XG5cbiAgICAgICAgcmV0dXJuIHNlY3Rpb25WYWx1ZXM7XG4gICAgfVxuXG4gICAgZ2V0UmFuZ2VTZWN0aW9uQnlQZXJjZW50YWdlKHBlcmNlbnRhZ2UpIHtcbiAgICAgICAgbGV0IHNlY3Rpb24gPSAxO1xuICAgICAgICB3aGlsZSAocGVyY2VudGFnZSA+IHRoaXMucmFuZ2VQZXJjZW50YWdlc1tzZWN0aW9uXSkge1xuICAgICAgICAgICAgc2VjdGlvbisrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWN0aW9uO1xuICAgIH1cblxuICAgIGdldFJhbmdlU2VjdGlvbkJ5VmFsdWUodmFsdWUpIHtcbiAgICAgICAgbGV0IHNlY3Rpb24gPSAxO1xuICAgICAgICB3aGlsZSAodmFsdWUgPiB0aGlzLnJhbmdlVmFsdWVzW3NlY3Rpb25dKSB7XG4gICAgICAgICAgICBzZWN0aW9uKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlY3Rpb247XG4gICAgfVxuXG4gICAgZ2V0TWluSGFuZGxlUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICBpZiAoKHBvc2l0aW9uICsgdGhpcy5taW5IYW5kbGUub2Zmc2V0V2lkdGggLyAyKSA+IHRoaXMubWF4SGFuZGxlLm9mZnNldExlZnQpIHtcbiAgICAgICAgICAgIHRoaXMubWluSGFuZGxlLnN0eWxlLnpJbmRleCA9IDU7XG4gICAgICAgICAgICB0aGlzLm1heEhhbmRsZS5zdHlsZS56SW5kZXggPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NpdGlvbiA+ICh0aGlzLm1heEhhbmRsZS5vZmZzZXRMZWZ0ICsgdGhpcy5tYXhIYW5kbGUub2Zmc2V0V2lkdGggLyAyKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1heEhhbmRsZS5vZmZzZXRMZWZ0ICsgdGhpcy5tYXhIYW5kbGUub2Zmc2V0V2lkdGggLyAyO1xuICAgICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgfVxuXG4gICAgZ2V0TWF4SGFuZGxlUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICAgICAgaWYgKChwb3NpdGlvbiAtIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoIC8gMikgPCAodGhpcy5taW5IYW5kbGUub2Zmc2V0TGVmdCArIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoKSkge1xuICAgICAgICAgICAgdGhpcy5tYXhIYW5kbGUuc3R5bGUuekluZGV4ID0gNTtcbiAgICAgICAgICAgIHRoaXMubWluSGFuZGxlLnN0eWxlLnpJbmRleCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvc2l0aW9uIC0gdGhpcy5tYXhIYW5kbGUub2Zmc2V0V2lkdGggLyAyIDwgdGhpcy5taW5IYW5kbGUub2Zmc2V0TGVmdClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1pbkhhbmRsZS5vZmZzZXRMZWZ0ICsgdGhpcy5tYXhIYW5kbGUub2Zmc2V0V2lkdGggLyAyO1xuICAgICAgICBpZiAocG9zaXRpb24gPiB0aGlzLmVsZW1lbnRXaWR0aClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRXaWR0aDtcbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgIH1cblxuICAgIHNldEFjdGl2ZUludGVydmFsKCkge1xuICAgICAgICB0aGlzLmludGVydmFsVHJhY2suc3R5bGUubGVmdCA9IGAke3RoaXMubWluSGFuZGxlLm9mZnNldExlZnQgKyB0aGlzLm1heEhhbmRsZS5vZmZzZXRXaWR0aCAvIDJ9cHhgO1xuICAgICAgICB0aGlzLmludGVydmFsVHJhY2suc3R5bGUucmlnaHQgPSBgJHt0aGlzLmVsZW1lbnRXaWR0aCAtIHRoaXMubWF4SGFuZGxlLm9mZnNldExlZnR9cHhgO1xuICAgIH1cblxuICAgIGhhbmRsZVN0b3AoKSB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmVIYW5kbGUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuYWN0aXZlSGFuZGxlLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgdGhpcy5hY3RpdmVIYW5kbGUgPSBudWxsO1xuICAgIH1cblxuICAgIGdldExlZnRQb3NpdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGxldCBsZWZ0ID0gMDtcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICBsZWZ0ICs9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBsZWZ0ICs9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYW5nZVNsaWRlcjtcbiJdfQ==
