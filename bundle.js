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
            e.preventDefault();

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
                console.log("mouse position", position);
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
            console.log(position, percentage);
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
            this.intervalTrack.style.left = this.minHandle.offsetLeft + "px";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2luZGV4LmpzIiwic2NyaXB0cy9yYW5nZS1zbGlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7OztJQUVxQixLO0FBQ2pCLHFCQUFjO0FBQUE7O0FBQ1YsYUFBSyxjQUFMLEdBQXNCLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQXRCO0FBQ0EsWUFBSSxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsR0FBNkIsQ0FBakMsRUFBb0M7QUFDaEMsaUJBQUssY0FBTCxHQUFzQixNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsS0FBSyxjQUFoQyxDQUF0QjtBQUNBLGlCQUFLLGtCQUFMO0FBQ0g7QUFDSjs7Ozs2Q0FFb0I7QUFDakIsaUJBQUssY0FBTCxDQUFvQixPQUFwQixDQUE0QixVQUFVLFNBQVYsRUFBcUI7QUFDN0Msb0JBQUksZ0JBQWdCLFVBQVUsWUFBVixDQUF1QixnQkFBdkIsQ0FBcEI7QUFDQSxvQkFBSSxtQkFBbUIsVUFBVSxZQUFWLENBQXVCLHdCQUF2QixDQUF2QjtBQUNBLG9CQUFJLENBQUMsQ0FBQyxnQkFBTixFQUF3QjtBQUNwQix3QkFBSTtBQUNBLDJDQUFtQixLQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUFuQjtBQUNILHFCQUZELENBR0EsT0FBTSxFQUFOLEVBQVU7QUFDTixnQ0FBUSxHQUFSLENBQVkscUJBQVosRUFBbUMsZ0JBQW5DLEVBQXFELG9CQUFyRDtBQUNIO0FBQ0o7QUFDRCx3QkFBUSxhQUFSO0FBQ0kseUJBQUssYUFBTDtBQUNJLGtEQUFnQixTQUFoQixFQUEyQixnQkFBM0I7QUFDQTtBQUhSO0FBS0MsYUFoQkw7QUFpQkg7Ozs7OztrQkEzQmdCLEs7OztBQThCckIsSUFBSSxLQUFKOzs7Ozs7Ozs7Ozs7O0lDaENNLFc7QUFFRix5QkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBQ2pCLGFBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxhQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxhQUFLLGdCQUFMLEdBQXdCLEVBQXhCOztBQUVBLGdCQUFRLE9BQVIsQ0FBZ0IsWUFBaEIsQ0FBNkIsS0FBN0IsQ0FBbUMsR0FBbkMsRUFBd0MsT0FBeEMsQ0FBZ0QsZ0JBQVE7QUFDcEQsZ0JBQUksQ0FBQyxNQUFNLFdBQVcsS0FBSyxJQUFMLEVBQVgsQ0FBTixDQUFMLEVBQ0ksTUFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLFdBQVcsS0FBSyxJQUFMLEVBQVgsQ0FBdEI7QUFDUCxTQUhEOztBQUtBLGdCQUFRLE9BQVIsQ0FBZ0IsaUJBQWhCLENBQWtDLEtBQWxDLENBQXdDLEdBQXhDLEVBQTZDLE9BQTdDLENBQXFELGdCQUFRO0FBQ3pELGdCQUFJLENBQUMsTUFBTSxXQUFXLEtBQUssSUFBTCxFQUFYLENBQU4sQ0FBTCxFQUNJLE1BQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsV0FBVyxLQUFLLElBQUwsRUFBWCxDQUEzQjtBQUNQLFNBSEQ7O0FBS0EsWUFBSSxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsS0FBNEIsQ0FBNUIsSUFBaUMsS0FBSyxXQUFMLENBQWlCLE1BQWpCLEtBQTRCLEtBQUssZ0JBQUwsQ0FBc0IsTUFBdkYsRUFDSTs7QUFFSixhQUFLLFlBQUwsR0FBb0IsS0FBSyxlQUFMLENBQXFCLE9BQXJCLENBQXBCO0FBQ0EsYUFBSyxZQUFMLEdBQW9CLFFBQVEsV0FBNUI7QUFDQSxhQUFLLGFBQUwsR0FBcUIsUUFBUSxhQUFSLENBQXNCLGtCQUF0QixDQUFyQjs7QUFFQSxnQkFBUSxZQUFSLENBQXFCLGtCQUFyQixFQUF5QyxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBekM7QUFDQSxnQkFBUSxZQUFSLENBQXFCLGdCQUFyQixFQUF1QyxLQUFLLFdBQUwsQ0FBaUIsS0FBSyxXQUFMLENBQWlCLE1BQWpCLEdBQTBCLENBQTNDLENBQXZDOztBQUVBLGFBQUssU0FBTCxHQUFpQixRQUFRLGFBQVIsQ0FBc0IsK0JBQXRCLENBQWpCO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLFFBQVEsYUFBUixDQUFzQiwrQkFBdEIsQ0FBakI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsUUFBUSxhQUFSLENBQXNCLGlDQUF0QixDQUFoQjtBQUNBLGFBQUssUUFBTCxHQUFnQixRQUFRLGFBQVIsQ0FBc0IsaUNBQXRCLENBQWhCOztBQUVBLFlBQUksQ0FBQyxLQUFLLFNBQU4sSUFBbUIsQ0FBQyxLQUFLLFNBQXpCLElBQXNDLENBQUMsS0FBSyxRQUE1QyxJQUF3RCxDQUFDLEtBQUssUUFBbEUsRUFBNEU7QUFDeEUsb0JBQVEsR0FBUixDQUFZLHlCQUFaO0FBQ0E7QUFDSDs7QUFFRCxhQUFLLGFBQUw7QUFDQSxhQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDSDs7Ozt3Q0FFZTtBQUFBOztBQUVaLGFBQUMsWUFBRCxFQUFlLFdBQWYsRUFBNEIsT0FBNUIsQ0FBb0MsZ0JBQVE7QUFDeEMsdUJBQUssU0FBTCxDQUFlLGdCQUFmLENBQWdDLElBQWhDLEVBQXNDO0FBQUEsMkJBQUssT0FBSyxVQUFMLENBQWdCLENBQWhCLEVBQW1CO0FBQzFELHFDQUFhO0FBQUEsbUNBQVksT0FBSyxvQkFBTCxDQUEwQixRQUExQixDQUFaO0FBQUEseUJBRDZDO0FBRTFELCtCQUFPLE9BQUs7QUFGOEMscUJBQW5CLENBQUw7QUFBQSxpQkFBdEMsRUFHSSxLQUhKOztBQUtBLHVCQUFLLFNBQUwsQ0FBZSxnQkFBZixDQUFnQyxJQUFoQyxFQUFzQztBQUFBLDJCQUFLLE9BQUssVUFBTCxDQUFnQixDQUFoQixFQUFtQjtBQUMxRCxxQ0FBYTtBQUFBLG1DQUFZLE9BQUssb0JBQUwsQ0FBMEIsUUFBMUIsQ0FBWjtBQUFBLHlCQUQ2QztBQUUxRCwrQkFBTyxPQUFLO0FBRjhDLHFCQUFuQixDQUFMO0FBQUEsaUJBQXRDLEVBR0ksS0FISjtBQUlILGFBVkQ7O0FBWUEsaUJBQUssT0FBTCxDQUFhLGdCQUFiLENBQThCLFdBQTlCLEVBQTJDO0FBQUEsdUJBQUssT0FBSyxVQUFMLENBQWdCLENBQWhCLENBQUw7QUFBQSxhQUEzQyxFQUFvRSxLQUFwRTtBQUNBLGlCQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUE4QixVQUE5QixFQUEwQztBQUFBLHVCQUFLLE9BQUssVUFBTCxDQUFnQixDQUFoQixDQUFMO0FBQUEsYUFBMUMsRUFBbUUsS0FBbkU7QUFDQSxpQkFBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBOEIsYUFBOUIsRUFBNkM7QUFBQSx1QkFBSyxPQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBTDtBQUFBLGFBQTdDLEVBQXNFLEtBQXRFOztBQUVBLHFCQUFTLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDO0FBQUEsdUJBQUssT0FBSyxVQUFMLENBQWdCLENBQWhCLENBQUw7QUFBQSxhQUFyQyxFQUE4RCxLQUE5RDtBQUNBLHFCQUFTLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDO0FBQUEsdUJBQUssT0FBSyxVQUFMLENBQWdCLENBQWhCLENBQUw7QUFBQSxhQUF2QyxFQUFnRSxLQUFoRTs7QUFFQSxpQkFBSyxRQUFMLENBQWMsZ0JBQWQsQ0FBK0IsTUFBL0IsRUFBdUM7QUFBQSx1QkFBSyxPQUFLLGdCQUFMLENBQXNCLENBQXRCLEVBQXlCO0FBQ2pFLDRCQUFRLE9BQUssU0FEb0Q7QUFFakUsaUNBQWE7QUFBQSwrQkFBWSxPQUFLLG9CQUFMLENBQTBCLFFBQTFCLENBQVo7QUFBQTtBQUZvRCxpQkFBekIsQ0FBTDtBQUFBLGFBQXZDLEVBR0ksS0FISjs7QUFLQSxpQkFBSyxRQUFMLENBQWMsZ0JBQWQsQ0FBK0IsTUFBL0IsRUFBdUM7QUFBQSx1QkFBSyxPQUFLLGdCQUFMLENBQXNCLENBQXRCLEVBQXlCO0FBQ2pFLDRCQUFRLE9BQUssU0FEb0Q7QUFFakUsaUNBQWE7QUFBQSwrQkFBWSxPQUFLLG9CQUFMLENBQTBCLFFBQTFCLENBQVo7QUFBQTtBQUZvRCxpQkFBekIsQ0FBTDtBQUFBLGFBQXZDLEVBR0ksS0FISjs7QUFLQSxnQkFBSSxDQUFDLE1BQU0sS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixVQUEzQixDQUFMLEVBQTZDO0FBQ3pDLG9CQUFNLGFBQWEsS0FBSyx1QkFBTCxDQUE2QixLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFVBQWxELENBQW5CO0FBQ0Esb0JBQU0sV0FBVyxhQUFhLEdBQWIsR0FBbUIsS0FBSyxZQUF6QztBQUNBLHFCQUFLLGlCQUFMLENBQXVCLEtBQUssU0FBNUIsRUFBdUMsS0FBSyxRQUE1QyxFQUFzRCxRQUF0RCxFQUFnRSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFVBQXJGO0FBQ0g7O0FBRUQsZ0JBQUksQ0FBQyxNQUFNLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsUUFBM0IsQ0FBTCxFQUEyQztBQUN2QyxvQkFBTSxjQUFhLEtBQUssdUJBQUwsQ0FBNkIsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixRQUFsRCxDQUFuQjtBQUNBLG9CQUFNLFlBQVcsY0FBYSxHQUFiLEdBQW1CLEtBQUssWUFBekM7QUFDQSxxQkFBSyxpQkFBTCxDQUF1QixLQUFLLFNBQTVCLEVBQXVDLEtBQUssUUFBNUMsRUFBc0QsU0FBdEQsRUFBZ0UsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixRQUFyRjtBQUNIO0FBQ0o7Ozt3Q0FFZSxDLEVBQUc7QUFDZixnQkFBTSxRQUFRLEVBQUUsSUFBRixLQUFXLFdBQVgsR0FBeUIsRUFBRSxjQUFGLENBQWlCLENBQWpCLEVBQW9CLEtBQTdDLEdBQXFELEVBQUUsS0FBckU7QUFDQSxtQkFBTyxRQUFRLEtBQUssWUFBYixHQUE0QixLQUFLLFlBQUwsQ0FBa0IsTUFBOUMsR0FBd0QsS0FBSyxZQUFMLENBQWtCLE9BQWxCLENBQTBCLFdBQTFCLEdBQXdDLENBQXZHO0FBQ0g7OzttQ0FFVSxDLEVBQUcsSSxFQUFNO0FBQ2hCLGNBQUUsY0FBRjs7QUFFQSxpQkFBSyxZQUFMLEdBQW9CO0FBQ2hCLHlCQUFTLEVBQUUsTUFESztBQUVoQix1QkFBTyxLQUFLLEtBRkk7QUFHaEIsNkJBQWEsS0FBSyxXQUhGO0FBSWhCLHdCQUFRLEVBQUUsT0FBRixJQUFhO0FBSkwsYUFBcEI7QUFNQSxjQUFFLE1BQUYsQ0FBUyxTQUFULENBQW1CLEdBQW5CLENBQXVCLFFBQXZCO0FBQ0EsbUJBQU8sS0FBUDtBQUNIOzs7bUNBRVUsQyxFQUFHO0FBQ1YsY0FBRSxjQUFGOztBQUVBLGdCQUFJLEtBQUssWUFBVCxFQUF1QjtBQUNuQixvQkFBSSxXQUFXLEtBQUssZUFBTCxDQUFxQixDQUFyQixDQUFmO0FBQ0Esd0JBQVEsR0FBUixDQUFZLGdCQUFaLEVBQThCLFFBQTlCO0FBQ0EsMkJBQVcsS0FBSyxZQUFMLENBQWtCLFdBQWxCLENBQThCLFFBQTlCLENBQVg7QUFDQSxvQkFBTSxRQUFRLEtBQUssb0JBQUwsQ0FBMEIsUUFBMUIsQ0FBZDtBQUNBLHFCQUFLLGlCQUFMLENBQXVCLEtBQUssWUFBTCxDQUFrQixPQUF6QyxFQUFrRCxLQUFLLFlBQUwsQ0FBa0IsS0FBcEUsRUFBMkUsUUFBM0UsRUFBcUYsS0FBckY7QUFDQSx1QkFBTyxLQUFQO0FBQ0g7QUFDSjs7O3lDQUVnQixDLEVBQUcsSSxFQUFNO0FBQ3RCLGdCQUFNLGFBQWEsRUFBRSxNQUFGLENBQVMsS0FBNUI7QUFDQSxnQkFBSSxNQUFNLFVBQU4sQ0FBSixFQUF1Qjs7QUFFdkIsZ0JBQU0sYUFBYSxLQUFLLHVCQUFMLENBQTZCLFVBQTdCLENBQW5CO0FBQ0EsZ0JBQUksV0FBVyxhQUFhLEdBQWIsR0FBbUIsS0FBSyxZQUF2QztBQUNBLHVCQUFXLEtBQUssV0FBTCxDQUFpQixRQUFqQixDQUFYO0FBQ0EsZ0JBQU0sUUFBUSxLQUFLLG9CQUFMLENBQTBCLFFBQTFCLENBQWQ7QUFDQSxpQkFBSyxpQkFBTCxDQUF1QixLQUFLLE1BQTVCLEVBQW9DLEVBQUUsTUFBdEMsRUFBOEMsUUFBOUMsRUFBd0QsS0FBeEQ7QUFDQSxtQkFBTyxLQUFQO0FBQ0g7OzswQ0FFaUIsTSxFQUFRLEssRUFBTyxRLEVBQVUsSyxFQUFPO0FBQzlDLGtCQUFNLEtBQU4sR0FBYyxNQUFNLFFBQU4sRUFBZDtBQUNBLGtCQUFNLEtBQU4sQ0FBWSxJQUFaLEdBQXNCLFdBQVcsTUFBTSxXQUFOLEdBQW9CLENBQXJEO0FBQ0EsbUJBQU8sS0FBUCxDQUFhLElBQWIsR0FBdUIsV0FBVyxPQUFPLFdBQVAsR0FBcUIsQ0FBdkQ7QUFDQSxpQkFBSyxpQkFBTDtBQUNIOzs7NkNBRW9CLFEsRUFBVTtBQUMzQixnQkFBTSxhQUFhLFdBQVcsS0FBSyxZQUFoQixHQUErQixHQUFsRDtBQUNBLG9CQUFRLEdBQVIsQ0FBWSxRQUFaLEVBQXNCLFVBQXRCO0FBQ0EsZ0JBQU0sZUFBZSxLQUFLLDJCQUFMLENBQWlDLFVBQWpDLENBQXJCO0FBQ0EsZ0JBQU0sU0FBUyxLQUFLLGdCQUFMLENBQXNCLFlBQXRCLENBQWY7QUFDQSxtQkFBTyxLQUFLLElBQUwsQ0FBVSxDQUFDLGFBQWEsT0FBTyxlQUFyQixLQUF5QyxPQUFPLEtBQVAsR0FBZSxPQUFPLEtBQS9ELElBQXdFLEdBQXhFLEdBQThFLE9BQU8sVUFBL0YsQ0FBUDtBQUNIOzs7Z0RBRXVCLEssRUFBTztBQUMzQixnQkFBTSxlQUFlLEtBQUssc0JBQUwsQ0FBNEIsS0FBNUIsQ0FBckI7QUFDQSxnQkFBTSxTQUFTLEtBQUssZ0JBQUwsQ0FBc0IsWUFBdEIsQ0FBZjtBQUNBLG1CQUFPLENBQUMsUUFBUSxPQUFPLFVBQWhCLEtBQStCLE9BQU8sS0FBUCxHQUFlLE9BQU8sS0FBckQsSUFBOEQsR0FBOUQsR0FBb0UsT0FBTyxlQUFsRjtBQUNIOzs7eUNBRWdCLFksRUFBYztBQUMzQixnQkFBTSxnQkFBZ0I7QUFDbEIsNEJBQVksS0FBSyxXQUFMLENBQWlCLGVBQWUsQ0FBaEMsQ0FETTtBQUVsQiwwQkFBVSxLQUFLLFdBQUwsQ0FBaUIsWUFBakIsQ0FGUTtBQUdsQixpQ0FBaUIsS0FBSyxnQkFBTCxDQUFzQixlQUFlLENBQXJDLENBSEM7QUFJbEIsK0JBQWUsS0FBSyxnQkFBTCxDQUFzQixZQUF0QjtBQUpHLGFBQXRCO0FBTUEsMEJBQWMsS0FBZCxHQUFzQixjQUFjLFFBQWQsR0FBeUIsY0FBYyxVQUE3RDtBQUNBLDBCQUFjLFVBQWQsR0FBMkIsY0FBYyxhQUFkLEdBQThCLGNBQWMsZUFBdkU7QUFDQSwwQkFBYyxLQUFkLEdBQXNCLE1BQU0sY0FBYyxVQUExQzs7QUFFQSxtQkFBTyxhQUFQO0FBQ0g7OztvREFFMkIsVSxFQUFZO0FBQ3BDLGdCQUFJLFVBQVUsQ0FBZDtBQUNBLG1CQUFPLGFBQWEsS0FBSyxnQkFBTCxDQUFzQixPQUF0QixDQUFwQixFQUFvRDtBQUNoRDtBQUNIO0FBQ0QsbUJBQU8sT0FBUDtBQUNIOzs7K0NBRXNCLEssRUFBTztBQUMxQixnQkFBSSxVQUFVLENBQWQ7QUFDQSxtQkFBTyxRQUFRLEtBQUssV0FBTCxDQUFpQixPQUFqQixDQUFmLEVBQTBDO0FBQ3RDO0FBQ0g7QUFDRCxtQkFBTyxPQUFQO0FBQ0g7Ozs2Q0FFb0IsUSxFQUFVO0FBQzNCLGdCQUFJLFdBQVcsQ0FBZixFQUNJLE9BQU8sQ0FBUDtBQUNKLGdCQUFLLFdBQVcsS0FBSyxTQUFMLENBQWUsV0FBZixHQUE2QixDQUF6QyxHQUE4QyxLQUFLLFNBQUwsQ0FBZSxVQUFqRSxFQUE2RTtBQUN6RSxxQkFBSyxTQUFMLENBQWUsS0FBZixDQUFxQixNQUFyQixHQUE4QixDQUE5QjtBQUNBLHFCQUFLLFNBQUwsQ0FBZSxLQUFmLENBQXFCLE1BQXJCLEdBQThCLENBQTlCO0FBQ0g7QUFDRCxnQkFBSSxXQUFZLEtBQUssU0FBTCxDQUFlLFVBQWYsR0FBNEIsS0FBSyxTQUFMLENBQWUsV0FBZixHQUE2QixDQUF6RSxFQUNJLE9BQU8sS0FBSyxTQUFMLENBQWUsVUFBZixHQUE0QixLQUFLLFNBQUwsQ0FBZSxXQUFmLEdBQTZCLENBQWhFO0FBQ0osbUJBQU8sUUFBUDtBQUNIOzs7NkNBRW9CLFEsRUFBVTtBQUMzQixnQkFBSyxXQUFXLEtBQUssU0FBTCxDQUFlLFdBQWYsR0FBNkIsQ0FBekMsR0FBK0MsS0FBSyxTQUFMLENBQWUsVUFBZixHQUE0QixLQUFLLFNBQUwsQ0FBZSxXQUE5RixFQUE0RztBQUN4RyxxQkFBSyxTQUFMLENBQWUsS0FBZixDQUFxQixNQUFyQixHQUE4QixDQUE5QjtBQUNBLHFCQUFLLFNBQUwsQ0FBZSxLQUFmLENBQXFCLE1BQXJCLEdBQThCLENBQTlCO0FBQ0g7QUFDRCxnQkFBSSxXQUFXLEtBQUssU0FBTCxDQUFlLFdBQWYsR0FBNkIsQ0FBeEMsR0FBNEMsS0FBSyxTQUFMLENBQWUsVUFBL0QsRUFDSSxPQUFPLEtBQUssU0FBTCxDQUFlLFVBQWYsR0FBNEIsS0FBSyxTQUFMLENBQWUsV0FBZixHQUE2QixDQUFoRTtBQUNKLGdCQUFJLFdBQVcsS0FBSyxZQUFwQixFQUNJLE9BQU8sS0FBSyxZQUFaO0FBQ0osbUJBQU8sUUFBUDtBQUNIOzs7NENBRW1CO0FBQ2hCLGlCQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBeUIsSUFBekIsR0FBbUMsS0FBSyxTQUFMLENBQWUsVUFBbEQ7QUFDQSxpQkFBSyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLEtBQXpCLEdBQW9DLEtBQUssWUFBTCxHQUFvQixLQUFLLFNBQUwsQ0FBZSxVQUF2RTtBQUNIOzs7cUNBRVk7QUFDVCxnQkFBSSxDQUFDLEtBQUssWUFBVixFQUNJO0FBQ0osaUJBQUssWUFBTCxDQUFrQixPQUFsQixDQUEwQixTQUExQixDQUFvQyxNQUFwQyxDQUEyQyxRQUEzQztBQUNBLGlCQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDSDs7O3dDQUVlLE8sRUFBUztBQUNyQixnQkFBSSxPQUFPLENBQVg7QUFDQSxtQkFBTyxRQUFRLFlBQWYsRUFBNkI7QUFDekIsd0JBQVEsUUFBUSxVQUFoQjtBQUNBLDBCQUFVLFFBQVEsWUFBbEI7QUFDSDtBQUNELG9CQUFRLFFBQVEsVUFBaEI7QUFDQSxtQkFBTyxJQUFQO0FBQ0g7Ozs7OztrQkFJVSxXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBSYW5nZVNsaWRlciBmcm9tICcuL3JhbmdlLXNsaWRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGV4IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kYXRhQ29tcG9uZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnRdXCIpO1xuICAgICAgICBpZiAodGhpcy5kYXRhQ29tcG9uZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFDb21wb25lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5kYXRhQ29tcG9uZW50cyk7XG4gICAgICAgICAgICB0aGlzLmxvYWREYXRhQ29tcG9uZW50cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZERhdGFDb21wb25lbnRzKCkge1xuICAgICAgICB0aGlzLmRhdGFDb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICAgICAgICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb21wb25lbnRcIik7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50T3B0aW9ucyA9IGNvbXBvbmVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbXBvbmVudC1vcHRpb25zXCIpO1xuICAgICAgICAgICAgaWYgKCEhY29tcG9uZW50T3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudE9wdGlvbnMgPSBKU09OLnBhcnNlKGNvbXBvbmVudE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaChleCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbXBvbmVudCBvcHRpb25zOiBcIiwgY29tcG9uZW50T3B0aW9ucywgXCIgaXMgbm90IHZhbGlkIGpzb25cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoIChjb21wb25lbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIlJhbmdlU2xpZGVyXCI6XG4gICAgICAgICAgICAgICAgICAgIG5ldyBSYW5nZVNsaWRlcihjb21wb25lbnQsIGNvbXBvbmVudE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xufVxuXG5uZXcgSW5kZXgoKTsiLCJjbGFzcyBSYW5nZVNsaWRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMucmFuZ2VWYWx1ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5yYW5nZVBlcmNlbnRhZ2VzID0gW107XG5cbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LnNsaWRlclZhbHVlcy5zcGxpdChcIixcIikuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmICghaXNOYU4ocGFyc2VGbG9hdChpdGVtLnRyaW0oKSkpKVxuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VWYWx1ZXMucHVzaChwYXJzZUZsb2F0KGl0ZW0udHJpbSgpKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQuZGF0YXNldC5zbGlkZXJQZXJjZW50YWdlcy5zcGxpdChcIixcIikuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmICghaXNOYU4ocGFyc2VGbG9hdChpdGVtLnRyaW0oKSkpKVxuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VQZXJjZW50YWdlcy5wdXNoKHBhcnNlRmxvYXQoaXRlbS50cmltKCkpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMucmFuZ2VWYWx1ZXMubGVuZ3RoID09PSAwIHx8IHRoaXMucmFuZ2VWYWx1ZXMubGVuZ3RoICE9PSB0aGlzLnJhbmdlUGVyY2VudGFnZXMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudFN0YXJ0ID0gdGhpcy5nZXRMZWZ0UG9zaXRpb24oZWxlbWVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgdGhpcy5pbnRlcnZhbFRyYWNrID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlci1pbnRlcnZhbFwiKTtcblxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc3RhcnQtcmFuZ2VcIiwgdGhpcy5yYW5nZVZhbHVlc1swXSk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1lbmQtcmFuZ2VcIiwgdGhpcy5yYW5nZVZhbHVlc1t0aGlzLnJhbmdlVmFsdWVzLmxlbmd0aCAtIDFdKTtcblxuICAgICAgICB0aGlzLm1pbkhhbmRsZSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2W2RhdGEtc2xpZGVyLWhhbmRsZT1cIm1pblwiXScpO1xuICAgICAgICB0aGlzLm1heEhhbmRsZSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2W2RhdGEtc2xpZGVyLWhhbmRsZT1cIm1heFwiXScpO1xuICAgICAgICB0aGlzLm1pbklucHV0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtkYXRhLXNsaWRlci1oYW5kbGU9XCJtaW5cIl0nKTtcbiAgICAgICAgdGhpcy5tYXhJbnB1dCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbZGF0YS1zbGlkZXItaGFuZGxlPVwibWF4XCJdJyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLm1pbkhhbmRsZSB8fCAhdGhpcy5tYXhIYW5kbGUgfHwgIXRoaXMubWluSW5wdXQgfHwgIXRoaXMubWF4SW5wdXQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTWlzc2luZyBuZWVkZWQgZWxlbWVudHNcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldHVwSGFuZGxlcnMoKTtcbiAgICAgICAgdGhpcy5hY3RpdmVIYW5kbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHNldHVwSGFuZGxlcnMoKSB7XG5cbiAgICAgICAgW1widG91Y2hzdGFydFwiLCBcIm1vdXNlZG93blwiXS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5taW5IYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBlID0+IHRoaXMuc3RhcnRTbGlkZShlLCB7XG4gICAgICAgICAgICAgICAgZ2V0UG9zaXRpb246IHBvc2l0aW9uID0+IHRoaXMuZ2V0TWluSGFuZGxlUG9zaXRpb24ocG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIGxhYmVsOiB0aGlzLm1pbklucHV0XG4gICAgICAgICAgICB9KSwgZmFsc2UpO1xuXG4gICAgICAgICAgICB0aGlzLm1heEhhbmRsZS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGUgPT4gdGhpcy5zdGFydFNsaWRlKGUsIHtcbiAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbjogcG9zaXRpb24gPT4gdGhpcy5nZXRNYXhIYW5kbGVQb3NpdGlvbihwb3NpdGlvbiksXG4gICAgICAgICAgICAgICAgbGFiZWw6IHRoaXMubWF4SW5wdXRcbiAgICAgICAgICAgIH0pLCBmYWxzZSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgZSA9PiB0aGlzLmhhbmRsZU1vdmUoZSksIGZhbHNlKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBlID0+IHRoaXMuaGFuZGxlU3RvcChlKSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsIGUgPT4gdGhpcy5oYW5kbGVTdG9wKGUpLCBmYWxzZSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZSA9PiB0aGlzLmhhbmRsZVN0b3AoZSksIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlID0+IHRoaXMuaGFuZGxlTW92ZShlKSwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMubWluSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgZSA9PiB0aGlzLmhhbmRsZVZhbHVlSW5wdXQoZSwge1xuICAgICAgICAgICAgaGFuZGxlOiB0aGlzLm1pbkhhbmRsZSxcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiBwb3NpdGlvbiA9PiB0aGlzLmdldE1pbkhhbmRsZVBvc2l0aW9uKHBvc2l0aW9uKVxuICAgICAgICB9KSwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMubWF4SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgZSA9PiB0aGlzLmhhbmRsZVZhbHVlSW5wdXQoZSwge1xuICAgICAgICAgICAgaGFuZGxlOiB0aGlzLm1heEhhbmRsZSxcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiBwb3NpdGlvbiA9PiB0aGlzLmdldE1heEhhbmRsZVBvc2l0aW9uKHBvc2l0aW9uKVxuICAgICAgICB9KSwgZmFsc2UpO1xuXG4gICAgICAgIGlmICghaXNOYU4odGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhcnRWYWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSB0aGlzLmNhbGN1bGF0ZUhhbmRsZVBvc2l0aW9uKHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0YXJ0VmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBwZXJjZW50YWdlIC8gMTAwICogdGhpcy5lbGVtZW50V2lkdGg7XG4gICAgICAgICAgICB0aGlzLnNldEhhbmRsZVBvc2l0aW9uKHRoaXMubWluSGFuZGxlLCB0aGlzLm1pbklucHV0LCBwb3NpdGlvbiwgdGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhcnRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzTmFOKHRoaXMuZWxlbWVudC5kYXRhc2V0LmVuZFZhbHVlKSkge1xuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuY2FsY3VsYXRlSGFuZGxlUG9zaXRpb24odGhpcy5lbGVtZW50LmRhdGFzZXQuZW5kVmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBwZXJjZW50YWdlIC8gMTAwICogdGhpcy5lbGVtZW50V2lkdGg7XG4gICAgICAgICAgICB0aGlzLnNldEhhbmRsZVBvc2l0aW9uKHRoaXMubWF4SGFuZGxlLCB0aGlzLm1heElucHV0LCBwb3NpdGlvbiwgdGhpcy5lbGVtZW50LmRhdGFzZXQuZW5kVmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGFuZGxlT2Zmc2V0KGUpIHtcbiAgICAgICAgY29uc3QgcGFnZVggPSBlLnR5cGUgPT09IFwidG91Y2htb3ZlXCIgPyBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYIDogZS5wYWdlWDtcbiAgICAgICAgcmV0dXJuIHBhZ2VYIC0gdGhpcy5lbGVtZW50U3RhcnQgLSB0aGlzLmFjdGl2ZUhhbmRsZS5vZmZzZXQgKyAodGhpcy5hY3RpdmVIYW5kbGUuZWxlbWVudC5vZmZzZXRXaWR0aCAvIDIpO1xuICAgIH1cblxuICAgIHN0YXJ0U2xpZGUoZSwgZGF0YSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy5hY3RpdmVIYW5kbGUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiBlLnRhcmdldCxcbiAgICAgICAgICAgIGxhYmVsOiBkYXRhLmxhYmVsLFxuICAgICAgICAgICAgZ2V0UG9zaXRpb246IGRhdGEuZ2V0UG9zaXRpb24sXG4gICAgICAgICAgICBvZmZzZXQ6IGUub2Zmc2V0WCB8fCAwXG4gICAgICAgIH07XG4gICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIilcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGhhbmRsZU1vdmUoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlSGFuZGxlKSB7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmdldEhhbmRsZU9mZnNldChlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibW91c2UgcG9zaXRpb25cIiwgcG9zaXRpb24pO1xuICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLmFjdGl2ZUhhbmRsZS5nZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuY2FsY3VsYXRlSGFuZGxlVmFsdWUocG9zaXRpb24pO1xuICAgICAgICAgICAgdGhpcy5zZXRIYW5kbGVQb3NpdGlvbih0aGlzLmFjdGl2ZUhhbmRsZS5lbGVtZW50LCB0aGlzLmFjdGl2ZUhhbmRsZS5sYWJlbCwgcG9zaXRpb24sIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZVZhbHVlSW5wdXQoZSwgZGF0YSkge1xuICAgICAgICBjb25zdCBpbnB1dFZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIGlmIChpc05hTihpbnB1dFZhbHVlKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSB0aGlzLmNhbGN1bGF0ZUhhbmRsZVBvc2l0aW9uKGlucHV0VmFsdWUpO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSBwZXJjZW50YWdlIC8gMTAwICogdGhpcy5lbGVtZW50V2lkdGg7XG4gICAgICAgIHBvc2l0aW9uID0gZGF0YS5nZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jYWxjdWxhdGVIYW5kbGVWYWx1ZShwb3NpdGlvbik7XG4gICAgICAgIHRoaXMuc2V0SGFuZGxlUG9zaXRpb24oZGF0YS5oYW5kbGUsIGUudGFyZ2V0LCBwb3NpdGlvbiwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc2V0SGFuZGxlUG9zaXRpb24oaGFuZGxlLCBsYWJlbCwgcG9zaXRpb24sIHZhbHVlKSB7XG4gICAgICAgIGxhYmVsLnZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgbGFiZWwuc3R5bGUubGVmdCA9IGAke3Bvc2l0aW9uIC0gbGFiZWwub2Zmc2V0V2lkdGggLyAyfXB4YDtcbiAgICAgICAgaGFuZGxlLnN0eWxlLmxlZnQgPSBgJHtwb3NpdGlvbiAtIGhhbmRsZS5vZmZzZXRXaWR0aCAvIDJ9cHhgO1xuICAgICAgICB0aGlzLnNldEFjdGl2ZUludGVydmFsKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSGFuZGxlVmFsdWUocG9zaXRpb24pIHtcbiAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IHBvc2l0aW9uIC8gdGhpcy5lbGVtZW50V2lkdGggKiAxMDA7XG4gICAgICAgIGNvbnNvbGUubG9nKHBvc2l0aW9uLCBwZXJjZW50YWdlKTtcbiAgICAgICAgY29uc3QgcmFuZ2VTZWN0aW9uID0gdGhpcy5nZXRSYW5nZVNlY3Rpb25CeVBlcmNlbnRhZ2UocGVyY2VudGFnZSk7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0U2VjdGlvblZhbHVlcyhyYW5nZVNlY3Rpb24pO1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChwZXJjZW50YWdlIC0gdmFsdWVzLnN0YXJ0UGVyY2VudGFnZSkgKiAodmFsdWVzLnZhbHVlICogdmFsdWVzLnJhdGlvKSAvIDEwMCArIHZhbHVlcy5zdGFydFZhbHVlKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVIYW5kbGVQb3NpdGlvbih2YWx1ZSkge1xuICAgICAgICBjb25zdCByYW5nZVNlY3Rpb24gPSB0aGlzLmdldFJhbmdlU2VjdGlvbkJ5VmFsdWUodmFsdWUpO1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldFNlY3Rpb25WYWx1ZXMocmFuZ2VTZWN0aW9uKTtcbiAgICAgICAgcmV0dXJuICh2YWx1ZSAtIHZhbHVlcy5zdGFydFZhbHVlKSAvICh2YWx1ZXMudmFsdWUgKiB2YWx1ZXMucmF0aW8pICogMTAwICsgdmFsdWVzLnN0YXJ0UGVyY2VudGFnZTtcbiAgICB9XG5cbiAgICBnZXRTZWN0aW9uVmFsdWVzKHJhbmdlU2VjdGlvbikge1xuICAgICAgICBjb25zdCBzZWN0aW9uVmFsdWVzID0ge1xuICAgICAgICAgICAgc3RhcnRWYWx1ZTogdGhpcy5yYW5nZVZhbHVlc1tyYW5nZVNlY3Rpb24gLSAxXSxcbiAgICAgICAgICAgIGVuZFZhbHVlOiB0aGlzLnJhbmdlVmFsdWVzW3JhbmdlU2VjdGlvbl0sXG4gICAgICAgICAgICBzdGFydFBlcmNlbnRhZ2U6IHRoaXMucmFuZ2VQZXJjZW50YWdlc1tyYW5nZVNlY3Rpb24gLSAxXSxcbiAgICAgICAgICAgIGVuZFBlcmNlbnRhZ2U6IHRoaXMucmFuZ2VQZXJjZW50YWdlc1tyYW5nZVNlY3Rpb25dLFxuICAgICAgICB9O1xuICAgICAgICBzZWN0aW9uVmFsdWVzLnZhbHVlID0gc2VjdGlvblZhbHVlcy5lbmRWYWx1ZSAtIHNlY3Rpb25WYWx1ZXMuc3RhcnRWYWx1ZTtcbiAgICAgICAgc2VjdGlvblZhbHVlcy5wZXJjZW50YWdlID0gc2VjdGlvblZhbHVlcy5lbmRQZXJjZW50YWdlIC0gc2VjdGlvblZhbHVlcy5zdGFydFBlcmNlbnRhZ2U7XG4gICAgICAgIHNlY3Rpb25WYWx1ZXMucmF0aW8gPSAxMDAgLyBzZWN0aW9uVmFsdWVzLnBlcmNlbnRhZ2U7XG5cbiAgICAgICAgcmV0dXJuIHNlY3Rpb25WYWx1ZXM7XG4gICAgfVxuXG4gICAgZ2V0UmFuZ2VTZWN0aW9uQnlQZXJjZW50YWdlKHBlcmNlbnRhZ2UpIHtcbiAgICAgICAgbGV0IHNlY3Rpb24gPSAxO1xuICAgICAgICB3aGlsZSAocGVyY2VudGFnZSA+IHRoaXMucmFuZ2VQZXJjZW50YWdlc1tzZWN0aW9uXSkge1xuICAgICAgICAgICAgc2VjdGlvbisrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWN0aW9uO1xuICAgIH1cblxuICAgIGdldFJhbmdlU2VjdGlvbkJ5VmFsdWUodmFsdWUpIHtcbiAgICAgICAgbGV0IHNlY3Rpb24gPSAxO1xuICAgICAgICB3aGlsZSAodmFsdWUgPiB0aGlzLnJhbmdlVmFsdWVzW3NlY3Rpb25dKSB7XG4gICAgICAgICAgICBzZWN0aW9uKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlY3Rpb247XG4gICAgfVxuXG4gICAgZ2V0TWluSGFuZGxlUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICBpZiAoKHBvc2l0aW9uICsgdGhpcy5taW5IYW5kbGUub2Zmc2V0V2lkdGggLyAyKSA+IHRoaXMubWF4SGFuZGxlLm9mZnNldExlZnQpIHtcbiAgICAgICAgICAgIHRoaXMubWluSGFuZGxlLnN0eWxlLnpJbmRleCA9IDU7XG4gICAgICAgICAgICB0aGlzLm1heEhhbmRsZS5zdHlsZS56SW5kZXggPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NpdGlvbiA+ICh0aGlzLm1heEhhbmRsZS5vZmZzZXRMZWZ0ICsgdGhpcy5tYXhIYW5kbGUub2Zmc2V0V2lkdGggLyAyKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1heEhhbmRsZS5vZmZzZXRMZWZ0ICsgdGhpcy5tYXhIYW5kbGUub2Zmc2V0V2lkdGggLyAyO1xuICAgICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgfVxuXG4gICAgZ2V0TWF4SGFuZGxlUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICAgICAgaWYgKChwb3NpdGlvbiAtIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoIC8gMikgPCAodGhpcy5taW5IYW5kbGUub2Zmc2V0TGVmdCArIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoKSkge1xuICAgICAgICAgICAgdGhpcy5tYXhIYW5kbGUuc3R5bGUuekluZGV4ID0gNTtcbiAgICAgICAgICAgIHRoaXMubWluSGFuZGxlLnN0eWxlLnpJbmRleCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvc2l0aW9uIC0gdGhpcy5tYXhIYW5kbGUub2Zmc2V0V2lkdGggLyAyIDwgdGhpcy5taW5IYW5kbGUub2Zmc2V0TGVmdClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1pbkhhbmRsZS5vZmZzZXRMZWZ0ICsgdGhpcy5tYXhIYW5kbGUub2Zmc2V0V2lkdGggLyAyO1xuICAgICAgICBpZiAocG9zaXRpb24gPiB0aGlzLmVsZW1lbnRXaWR0aClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRXaWR0aDtcbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgIH1cblxuICAgIHNldEFjdGl2ZUludGVydmFsKCkge1xuICAgICAgICB0aGlzLmludGVydmFsVHJhY2suc3R5bGUubGVmdCA9IGAke3RoaXMubWluSGFuZGxlLm9mZnNldExlZnR9cHhgO1xuICAgICAgICB0aGlzLmludGVydmFsVHJhY2suc3R5bGUucmlnaHQgPSBgJHt0aGlzLmVsZW1lbnRXaWR0aCAtIHRoaXMubWF4SGFuZGxlLm9mZnNldExlZnR9cHhgO1xuICAgIH1cblxuICAgIGhhbmRsZVN0b3AoKSB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmVIYW5kbGUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuYWN0aXZlSGFuZGxlLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgdGhpcy5hY3RpdmVIYW5kbGUgPSBudWxsO1xuICAgIH1cblxuICAgIGdldExlZnRQb3NpdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGxldCBsZWZ0ID0gMDtcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICBsZWZ0ICs9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBsZWZ0ICs9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFJhbmdlU2xpZGVyO1xuIl19
