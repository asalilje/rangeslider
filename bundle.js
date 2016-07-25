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
            var position = percentage / 100 * this.elementWidth;
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
            this.intervalTrack.style.right = this.elementWidth - this.maxHandle.offsetWidth / 2 + "px";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2luZGV4LmpzIiwic2NyaXB0cy9yYW5nZS1zbGlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7OztJQUVxQixLO0FBQ2pCLHFCQUFjO0FBQUE7O0FBQ1YsYUFBSyxjQUFMLEdBQXNCLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQXRCO0FBQ0EsWUFBSSxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsR0FBNkIsQ0FBakMsRUFBb0M7QUFDaEMsaUJBQUssY0FBTCxHQUFzQixNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsS0FBSyxjQUFoQyxDQUF0QjtBQUNBLGlCQUFLLGtCQUFMO0FBQ0g7QUFDSjs7Ozs2Q0FFb0I7QUFDakIsaUJBQUssY0FBTCxDQUFvQixPQUFwQixDQUE0QixVQUFVLFNBQVYsRUFBcUI7QUFDN0Msb0JBQUksZ0JBQWdCLFVBQVUsWUFBVixDQUF1QixnQkFBdkIsQ0FBcEI7QUFDQSxvQkFBSSxtQkFBbUIsVUFBVSxZQUFWLENBQXVCLHdCQUF2QixDQUF2QjtBQUNBLG9CQUFJLENBQUMsQ0FBQyxnQkFBTixFQUF3QjtBQUNwQix3QkFBSTtBQUNBLDJDQUFtQixLQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUFuQjtBQUNILHFCQUZELENBR0EsT0FBTSxFQUFOLEVBQVU7QUFDTixnQ0FBUSxHQUFSLENBQVkscUJBQVosRUFBbUMsZ0JBQW5DLEVBQXFELG9CQUFyRDtBQUNIO0FBQ0o7QUFDRCx3QkFBUSxhQUFSO0FBQ0kseUJBQUssYUFBTDtBQUNJLGtEQUFnQixTQUFoQixFQUEyQixnQkFBM0I7QUFDQTtBQUhSO0FBS0MsYUFoQkw7QUFpQkg7Ozs7OztrQkEzQmdCLEs7OztBQThCckIsSUFBSSxLQUFKOzs7Ozs7Ozs7Ozs7O0lDaENNLFc7QUFFRix5QkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FB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cUIsTUFBckIsR0FBOEIsQ0FBOUI7QUFDSDtBQUNELGdCQUFJLFdBQVcsS0FBSyxTQUFMLENBQWUsV0FBZixHQUE2QixDQUF4QyxHQUE0QyxLQUFLLFNBQUwsQ0FBZSxVQUEvRCxFQUNJLE9BQU8sS0FBSyxTQUFMLENBQWUsVUFBZixHQUE0QixLQUFLLFNBQUwsQ0FBZSxXQUFmLEdBQTZCLENBQWhFO0FBQ0osZ0JBQUksV0FBVyxLQUFLLFlBQXBCLEVBQ0ksT0FBTyxLQUFLLFlBQVo7QUFDSixtQkFBTyxRQUFQO0FBQ0g7Ozs0Q0FFbUI7QUFDaEIsaUJBQUssYUFBTCxDQUFtQixLQUFuQixDQUF5QixJQUF6QixHQUFtQyxLQUFLLFNBQUwsQ0FBZSxVQUFmLEdBQTRCLEtBQUssU0FBTCxDQUFlLFdBQWYsR0FBNkIsQ0FBNUY7QUFDQSxpQkFBSyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLEtBQXpCLEdBQW9DLEtBQUssWUFBTCxHQUFvQixLQUFLLFNBQUwsQ0FBZSxXQUFmLEdBQTZCLENBQXJGO0FBQ0g7OztxQ0FFWTtBQUNULGdCQUFJLENBQUMsS0FBSyxZQUFWLEVBQ0k7QUFDSixpQkFBSyxZQUFMLENBQWtCLE9BQWxCLENBQTBCLFNBQTFCLENBQW9DLE1BQXBDLENBQTJDLFFBQTNDO0FBQ0EsaUJBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNIOzs7d0NBRWUsTyxFQUFTO0FBQ3JCLGdCQUFJLE9BQU8sQ0FBWDtBQUNBLG1CQUFPLFFBQVEsWUFBZixFQUE2QjtBQUN6Qix3QkFBUSxRQUFRLFVBQWhCO0FBQ0EsMEJBQVUsUUFBUSxZQUFsQjtBQUNIO0FBQ0Qsb0JBQVEsUUFBUSxVQUFoQjtBQUNBLG1CQUFPLElBQVA7QUFDSDs7Ozs7O2tCQUdVLFciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJhbmdlU2xpZGVyIGZyb20gJy4vcmFuZ2Utc2xpZGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXgge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRhdGFDb21wb25lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWNvbXBvbmVudF1cIik7XG4gICAgICAgIGlmICh0aGlzLmRhdGFDb21wb25lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YUNvbXBvbmVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmRhdGFDb21wb25lbnRzKTtcbiAgICAgICAgICAgIHRoaXMubG9hZERhdGFDb21wb25lbnRzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2FkRGF0YUNvbXBvbmVudHMoKSB7XG4gICAgICAgIHRoaXMuZGF0YUNvbXBvbmVudHMuZm9yRWFjaChmdW5jdGlvbiAoY29tcG9uZW50KSB7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbXBvbmVudFwiKTtcbiAgICAgICAgICAgIHZhciBjb21wb25lbnRPcHRpb25zID0gY29tcG9uZW50LmdldEF0dHJpYnV0ZShcImRhdGEtY29tcG9uZW50LW9wdGlvbnNcIik7XG4gICAgICAgICAgICBpZiAoISFjb21wb25lbnRPcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50T3B0aW9ucyA9IEpTT04ucGFyc2UoY29tcG9uZW50T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29tcG9uZW50IG9wdGlvbnM6IFwiLCBjb21wb25lbnRPcHRpb25zLCBcIiBpcyBub3QgdmFsaWQganNvblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2ggKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiUmFuZ2VTbGlkZXJcIjpcbiAgICAgICAgICAgICAgICAgICAgbmV3IFJhbmdlU2xpZGVyKGNvbXBvbmVudCwgY29tcG9uZW50T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH07XG59XG5cbm5ldyBJbmRleCgpOyIsImNsYXNzIFJhbmdlU2xpZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5yYW5nZVZhbHVlcyA9IFtdO1xuICAgICAgICB0aGlzLnJhbmdlUGVyY2VudGFnZXMgPSBbXTtcblxuICAgICAgICBlbGVtZW50LmRhdGFzZXQuc2xpZGVyVmFsdWVzLnNwbGl0KFwiLFwiKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKCFpc05hTihwYXJzZUZsb2F0KGl0ZW0udHJpbSgpKSkpXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZVZhbHVlcy5wdXNoKHBhcnNlRmxvYXQoaXRlbS50cmltKCkpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LnNsaWRlclBlcmNlbnRhZ2VzLnNwbGl0KFwiLFwiKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKCFpc05hTihwYXJzZUZsb2F0KGl0ZW0udHJpbSgpKSkpXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZVBlcmNlbnRhZ2VzLnB1c2gocGFyc2VGbG9hdChpdGVtLnRyaW0oKSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5yYW5nZVZhbHVlcy5sZW5ndGggPT09IDAgfHwgdGhpcy5yYW5nZVZhbHVlcy5sZW5ndGggIT09IHRoaXMucmFuZ2VQZXJjZW50YWdlcy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdGhpcy5lbGVtZW50U3RhcnQgPSB0aGlzLmdldExlZnRQb3NpdGlvbihlbGVtZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50V2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICB0aGlzLmludGVydmFsVHJhY2sgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyLWludGVydmFsXCIpO1xuXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zdGFydC1yYW5nZVwiLCB0aGlzLnJhbmdlVmFsdWVzWzBdKTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWVuZC1yYW5nZVwiLCB0aGlzLnJhbmdlVmFsdWVzW3RoaXMucmFuZ2VWYWx1ZXMubGVuZ3RoIC0gMV0pO1xuXG4gICAgICAgIHRoaXMubWluSGFuZGxlID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbZGF0YS1zbGlkZXItaGFuZGxlPVwibWluXCJdJyk7XG4gICAgICAgIHRoaXMubWF4SGFuZGxlID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbZGF0YS1zbGlkZXItaGFuZGxlPVwibWF4XCJdJyk7XG4gICAgICAgIHRoaXMubWluSW5wdXQgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W2RhdGEtc2xpZGVyLWhhbmRsZT1cIm1pblwiXScpO1xuICAgICAgICB0aGlzLm1heElucHV0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtkYXRhLXNsaWRlci1oYW5kbGU9XCJtYXhcIl0nKTtcblxuICAgICAgICBpZiAoIXRoaXMubWluSGFuZGxlIHx8ICF0aGlzLm1heEhhbmRsZSB8fCAhdGhpcy5taW5JbnB1dCB8fCAhdGhpcy5tYXhJbnB1dCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJNaXNzaW5nIG5lZWRlZCBlbGVtZW50c1wiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0dXBIYW5kbGVycygpO1xuICAgICAgICB0aGlzLmFjdGl2ZUhhbmRsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgc2V0dXBIYW5kbGVycygpIHtcblxuICAgICAgICBbXCJ0b3VjaHN0YXJ0XCIsIFwibW91c2Vkb3duXCJdLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1pbkhhbmRsZS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGUgPT4gdGhpcy5zdGFydFNsaWRlKGUsIHtcbiAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbjogcG9zaXRpb24gPT4gdGhpcy5nZXRNaW5IYW5kbGVQb3NpdGlvbihwb3NpdGlvbiksXG4gICAgICAgICAgICAgICAgbGFiZWw6IHRoaXMubWluSW5wdXRcbiAgICAgICAgICAgIH0pLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIHRoaXMubWF4SGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZSA9PiB0aGlzLnN0YXJ0U2xpZGUoZSwge1xuICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uOiBwb3NpdGlvbiA9PiB0aGlzLmdldE1heEhhbmRsZVBvc2l0aW9uKHBvc2l0aW9uKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogdGhpcy5tYXhJbnB1dFxuICAgICAgICAgICAgfSksIGZhbHNlKVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBlID0+IHRoaXMuaGFuZGxlTW92ZShlKSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGUgPT4gdGhpcy5oYW5kbGVTdG9wKGUpLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hjYW5jZWxcIiwgZSA9PiB0aGlzLmhhbmRsZVN0b3AoZSksIGZhbHNlKTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBlID0+IHRoaXMuaGFuZGxlU3RvcChlKSwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGUgPT4gdGhpcy5oYW5kbGVNb3ZlKGUpLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5taW5JbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBlID0+IHRoaXMuaGFuZGxlVmFsdWVJbnB1dChlLCB7XG4gICAgICAgICAgICBoYW5kbGU6IHRoaXMubWluSGFuZGxlLFxuICAgICAgICAgICAgZ2V0UG9zaXRpb246IHBvc2l0aW9uID0+IHRoaXMuZ2V0TWluSGFuZGxlUG9zaXRpb24ocG9zaXRpb24pXG4gICAgICAgIH0pLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5tYXhJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBlID0+IHRoaXMuaGFuZGxlVmFsdWVJbnB1dChlLCB7XG4gICAgICAgICAgICBoYW5kbGU6IHRoaXMubWF4SGFuZGxlLFxuICAgICAgICAgICAgZ2V0UG9zaXRpb246IHBvc2l0aW9uID0+IHRoaXMuZ2V0TWF4SGFuZGxlUG9zaXRpb24ocG9zaXRpb24pXG4gICAgICAgIH0pLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKCFpc05hTih0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGFydFZhbHVlKSkge1xuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuY2FsY3VsYXRlSGFuZGxlUG9zaXRpb24odGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhcnRWYWx1ZSk7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHBlcmNlbnRhZ2UgLyAxMDAgKiB0aGlzLmVsZW1lbnRXaWR0aDtcbiAgICAgICAgICAgIHRoaXMuc2V0SGFuZGxlUG9zaXRpb24odGhpcy5taW5IYW5kbGUsIHRoaXMubWluSW5wdXQsIHBvc2l0aW9uLCB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGFydFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNOYU4odGhpcy5lbGVtZW50LmRhdGFzZXQuZW5kVmFsdWUpKSB7XG4gICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gdGhpcy5jYWxjdWxhdGVIYW5kbGVQb3NpdGlvbih0aGlzLmVsZW1lbnQuZGF0YXNldC5lbmRWYWx1ZSk7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHBlcmNlbnRhZ2UgLyAxMDAgKiB0aGlzLmVsZW1lbnRXaWR0aDtcbiAgICAgICAgICAgIHRoaXMuc2V0SGFuZGxlUG9zaXRpb24odGhpcy5tYXhIYW5kbGUsIHRoaXMubWF4SW5wdXQsIHBvc2l0aW9uLCB0aGlzLmVsZW1lbnQuZGF0YXNldC5lbmRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRIYW5kbGVPZmZzZXQoZSkge1xuICAgICAgICBjb25zdCBwYWdlWCA9IGUudHlwZSA9PT0gXCJ0b3VjaG1vdmVcIiA/IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggOiBlLnBhZ2VYO1xuICAgICAgICByZXR1cm4gcGFnZVggLSB0aGlzLmVsZW1lbnRTdGFydCAtIHRoaXMuYWN0aXZlSGFuZGxlLm9mZnNldCArICh0aGlzLmFjdGl2ZUhhbmRsZS5lbGVtZW50Lm9mZnNldFdpZHRoIC8gMik7XG4gICAgfVxuXG4gICAgc3RhcnRTbGlkZShlLCBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlSGFuZGxlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogZS50YXJnZXQsXG4gICAgICAgICAgICBsYWJlbDogZGF0YS5sYWJlbCxcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiBkYXRhLmdldFBvc2l0aW9uLFxuICAgICAgICAgICAgb2Zmc2V0OiBlLm9mZnNldFggfHwgMFxuICAgICAgICB9O1xuICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBoYW5kbGVNb3ZlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUhhbmRsZSkge1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5nZXRIYW5kbGVPZmZzZXQoZSk7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuYWN0aXZlSGFuZGxlLmdldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jYWxjdWxhdGVIYW5kbGVWYWx1ZShwb3NpdGlvbik7XG4gICAgICAgICAgICB0aGlzLnNldEhhbmRsZVBvc2l0aW9uKHRoaXMuYWN0aXZlSGFuZGxlLmVsZW1lbnQsIHRoaXMuYWN0aXZlSGFuZGxlLmxhYmVsLCBwb3NpdGlvbiwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlVmFsdWVJbnB1dChlLCBkYXRhKSB7XG4gICAgICAgIGNvbnN0IGlucHV0VmFsdWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgaWYgKGlzTmFOKGlucHV0VmFsdWUpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuY2FsY3VsYXRlSGFuZGxlUG9zaXRpb24oaW5wdXRWYWx1ZSk7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHBlcmNlbnRhZ2UgLyAxMDAgKiB0aGlzLmVsZW1lbnRXaWR0aDtcbiAgICAgICAgcG9zaXRpb24gPSBkYXRhLmdldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmNhbGN1bGF0ZUhhbmRsZVZhbHVlKHBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5zZXRIYW5kbGVQb3NpdGlvbihkYXRhLmhhbmRsZSwgZS50YXJnZXQsIHBvc2l0aW9uLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzZXRIYW5kbGVQb3NpdGlvbihoYW5kbGUsIGxhYmVsLCBwb3NpdGlvbiwgdmFsdWUpIHtcbiAgICAgICAgbGFiZWwudmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICBsYWJlbC5zdHlsZS5sZWZ0ID0gYCR7cG9zaXRpb24gLSBsYWJlbC5vZmZzZXRXaWR0aCAvIDJ9cHhgO1xuICAgICAgICBoYW5kbGUuc3R5bGUubGVmdCA9IGAke3Bvc2l0aW9uIC0gaGFuZGxlLm9mZnNldFdpZHRoIC8gMn1weGA7XG4gICAgICAgIHRoaXMuc2V0QWN0aXZlSW50ZXJ2YWwoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVIYW5kbGVWYWx1ZShwb3NpdGlvbikge1xuICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gcG9zaXRpb24gLyB0aGlzLmVsZW1lbnRXaWR0aCAqIDEwMDtcbiAgICAgICAgY29uc29sZS5sb2coYCR7cG9zaXRpb259cHg6ICR7cGVyY2VudGFnZX0lYCk7XG4gICAgICAgIGNvbnN0IHJhbmdlU2VjdGlvbiA9IHRoaXMuZ2V0UmFuZ2VTZWN0aW9uQnlQZXJjZW50YWdlKHBlcmNlbnRhZ2UpO1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldFNlY3Rpb25WYWx1ZXMocmFuZ2VTZWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgocGVyY2VudGFnZSAtIHZhbHVlcy5zdGFydFBlcmNlbnRhZ2UpICogKHZhbHVlcy52YWx1ZSAqIHZhbHVlcy5yYXRpbykgLyAxMDAgKyB2YWx1ZXMuc3RhcnRWYWx1ZSk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSGFuZGxlUG9zaXRpb24odmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmFuZ2VTZWN0aW9uID0gdGhpcy5nZXRSYW5nZVNlY3Rpb25CeVZhbHVlKHZhbHVlKTtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5nZXRTZWN0aW9uVmFsdWVzKHJhbmdlU2VjdGlvbik7XG4gICAgICAgIHJldHVybiAodmFsdWUgLSB2YWx1ZXMuc3RhcnRWYWx1ZSkgLyAodmFsdWVzLnZhbHVlICogdmFsdWVzLnJhdGlvKSAqIDEwMCArIHZhbHVlcy5zdGFydFBlcmNlbnRhZ2U7XG4gICAgfVxuXG4gICAgZ2V0U2VjdGlvblZhbHVlcyhyYW5nZVNlY3Rpb24pIHtcbiAgICAgICAgY29uc3Qgc2VjdGlvblZhbHVlcyA9IHtcbiAgICAgICAgICAgIHN0YXJ0VmFsdWU6IHRoaXMucmFuZ2VWYWx1ZXNbcmFuZ2VTZWN0aW9uIC0gMV0sXG4gICAgICAgICAgICBlbmRWYWx1ZTogdGhpcy5yYW5nZVZhbHVlc1tyYW5nZVNlY3Rpb25dLFxuICAgICAgICAgICAgc3RhcnRQZXJjZW50YWdlOiB0aGlzLnJhbmdlUGVyY2VudGFnZXNbcmFuZ2VTZWN0aW9uIC0gMV0sXG4gICAgICAgICAgICBlbmRQZXJjZW50YWdlOiB0aGlzLnJhbmdlUGVyY2VudGFnZXNbcmFuZ2VTZWN0aW9uXSxcbiAgICAgICAgfTtcbiAgICAgICAgc2VjdGlvblZhbHVlcy52YWx1ZSA9IHNlY3Rpb25WYWx1ZXMuZW5kVmFsdWUgLSBzZWN0aW9uVmFsdWVzLnN0YXJ0VmFsdWU7XG4gICAgICAgIHNlY3Rpb25WYWx1ZXMucGVyY2VudGFnZSA9IHNlY3Rpb25WYWx1ZXMuZW5kUGVyY2VudGFnZSAtIHNlY3Rpb25WYWx1ZXMuc3RhcnRQZXJjZW50YWdlO1xuICAgICAgICBzZWN0aW9uVmFsdWVzLnJhdGlvID0gMTAwIC8gc2VjdGlvblZhbHVlcy5wZXJjZW50YWdlO1xuXG4gICAgICAgIHJldHVybiBzZWN0aW9uVmFsdWVzO1xuICAgIH1cblxuICAgIGdldFJhbmdlU2VjdGlvbkJ5UGVyY2VudGFnZShwZXJjZW50YWdlKSB7XG4gICAgICAgIGxldCBzZWN0aW9uID0gMTtcbiAgICAgICAgd2hpbGUgKHBlcmNlbnRhZ2UgPiB0aGlzLnJhbmdlUGVyY2VudGFnZXNbc2VjdGlvbl0pIHtcbiAgICAgICAgICAgIHNlY3Rpb24rKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VjdGlvbjtcbiAgICB9XG5cbiAgICBnZXRSYW5nZVNlY3Rpb25CeVZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGxldCBzZWN0aW9uID0gMTtcbiAgICAgICAgd2hpbGUgKHZhbHVlID4gdGhpcy5yYW5nZVZhbHVlc1tzZWN0aW9uXSkge1xuICAgICAgICAgICAgc2VjdGlvbisrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWN0aW9uO1xuICAgIH1cblxuICAgIGdldE1pbkhhbmRsZVBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgaWYgKChwb3NpdGlvbiArIHRoaXMubWluSGFuZGxlLm9mZnNldFdpZHRoIC8gMikgPiB0aGlzLm1heEhhbmRsZS5vZmZzZXRMZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLm1pbkhhbmRsZS5zdHlsZS56SW5kZXggPSA1O1xuICAgICAgICAgICAgdGhpcy5tYXhIYW5kbGUuc3R5bGUuekluZGV4ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zaXRpb24gPiAodGhpcy5tYXhIYW5kbGUub2Zmc2V0TGVmdCArIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoIC8gMikpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXhIYW5kbGUub2Zmc2V0TGVmdCArIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoIC8gMjtcbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgIH1cblxuICAgIGdldE1heEhhbmRsZVBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICAgIGlmICgocG9zaXRpb24gLSB0aGlzLm1heEhhbmRsZS5vZmZzZXRXaWR0aCAvIDIpIDwgKHRoaXMubWluSGFuZGxlLm9mZnNldExlZnQgKyB0aGlzLm1heEhhbmRsZS5vZmZzZXRXaWR0aCkpIHtcbiAgICAgICAgICAgIHRoaXMubWF4SGFuZGxlLnN0eWxlLnpJbmRleCA9IDU7XG4gICAgICAgICAgICB0aGlzLm1pbkhhbmRsZS5zdHlsZS56SW5kZXggPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NpdGlvbiAtIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoIC8gMiA8IHRoaXMubWluSGFuZGxlLm9mZnNldExlZnQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5taW5IYW5kbGUub2Zmc2V0TGVmdCArIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoIC8gMjtcbiAgICAgICAgaWYgKHBvc2l0aW9uID4gdGhpcy5lbGVtZW50V2lkdGgpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50V2lkdGg7XG4gICAgICAgIHJldHVybiBwb3NpdGlvbjtcbiAgICB9XG5cbiAgICBzZXRBY3RpdmVJbnRlcnZhbCgpIHtcbiAgICAgICAgdGhpcy5pbnRlcnZhbFRyYWNrLnN0eWxlLmxlZnQgPSBgJHt0aGlzLm1pbkhhbmRsZS5vZmZzZXRMZWZ0ICsgdGhpcy5tYXhIYW5kbGUub2Zmc2V0V2lkdGggLyAyfXB4YDtcbiAgICAgICAgdGhpcy5pbnRlcnZhbFRyYWNrLnN0eWxlLnJpZ2h0ID0gYCR7dGhpcy5lbGVtZW50V2lkdGggLSB0aGlzLm1heEhhbmRsZS5vZmZzZXRXaWR0aCAvIDJ9cHhgO1xuICAgIH1cblxuICAgIGhhbmRsZVN0b3AoKSB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmVIYW5kbGUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuYWN0aXZlSGFuZGxlLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgdGhpcy5hY3RpdmVIYW5kbGUgPSBudWxsO1xuICAgIH1cblxuICAgIGdldExlZnRQb3NpdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGxldCBsZWZ0ID0gMDtcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICBsZWZ0ICs9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBsZWZ0ICs9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYW5nZVNsaWRlcjtcbiJdfQ==
