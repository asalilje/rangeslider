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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2luZGV4LmpzIiwic2NyaXB0cy9yYW5nZS1zbGlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7OztJQUVxQixLO0FBQ2pCLHFCQUFjO0FBQUE7O0FBQ1YsYUFBSyxjQUFMLEdBQXNCLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQXRCO0FBQ0EsWUFBSSxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsR0FBNkIsQ0FBakMsRUFBb0M7QUFDaEMsaUJBQUssY0FBTCxHQUFzQixNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsS0FBSyxjQUFoQyxDQUF0QjtBQUNBLGlCQUFLLGtCQUFMO0FBQ0g7QUFDSjs7Ozs2Q0FFb0I7QUFDakIsaUJBQUssY0FBTCxDQUFvQixPQUFwQixDQUE0QixVQUFVLFNBQVYsRUFBcUI7QUFDN0Msb0JBQUksZ0JBQWdCLFVBQVUsWUFBVixDQUF1QixnQkFBdkIsQ0FBcEI7QUFDQSxvQkFBSSxtQkFBbUIsVUFBVSxZQUFWLENBQXVCLHdCQUF2QixDQUF2QjtBQUNBLG9CQUFJLENBQUMsQ0FBQyxnQkFBTixFQUF3QjtBQUNwQix3QkFBSTtBQUNBLDJDQUFtQixLQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUFuQjtBQUNILHFCQUZELENBR0EsT0FBTSxFQUFOLEVBQVU7QUFDTixnQ0FBUSxHQUFSLENBQVkscUJBQVosRUFBbUMsZ0JBQW5DLEVBQXFELG9CQUFyRDtBQUNIO0FBQ0o7QUFDRCx3QkFBUSxhQUFSO0FBQ0kseUJBQUssYUFBTDtBQUNJLGtEQUFnQixTQUFoQixFQUEyQixnQkFBM0I7QUFDQTtBQUhSO0FBS0MsYUFoQkw7QUFpQkg7Ozs7OztrQkEzQmdCLEs7OztBQThCckIsSUFBSSxLQUFKOzs7Ozs7Ozs7Ozs7O0lDaENNLFc7QUFFRix5QkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBQ2pCLGFBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxhQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxhQUFLLGdCQUFMLEdBQXdCLEVBQXhCOztBQUVBLGdCQUFRLE9BQVIsQ0FBZ0IsWUFBaEIsQ0FBNkIsS0FBN0IsQ0FBbUMsR0FBbkMsRUFBd0MsT0FBeEMsQ0FBZ0QsZ0JBQVE7QUFDcEQsZ0JBQUksQ0FBQyxNQUFNLFdBQVcsS0FBSyxJQUFMLEVBQVgsQ0FBTixDQUFMLEVBQ0ksTUFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLFdBQVcsS0FBSyxJQUFMLEVBQVgsQ0FBdEI7QUFDUCxTQUhEOztBQUtBLGdCQUFRLE9BQVIsQ0FBZ0IsaUJBQWhCLENBQWtDLEtBQWxDLENBQXdDLEdBQXhDLEVBQTZDLE9BQTdDLENBQXFELGdCQUFRO0FBQ3pELGdCQUFJLENBQUMsTUFBTSxXQUFXLEtBQUssSUFBTCxFQUFYLENBQU4sQ0FBTCxFQUNJLE1BQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsV0FBVyxLQUFLLElBQUwsRUFBWCxDQUEzQjtBQUNQLFNBSEQ7O0FBS0EsWUFBSSxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsS0FBNEIsQ0FBNUIsSUFBaUMsS0FBSyxXQUFMLENBQWlCLE1BQWpCLEtBQTRCLEtBQUssZ0JBQUwsQ0FBc0IsTUFBdkYsRUFDSTs7QUFFSixhQUFLLFlBQUwsR0FBb0IsS0FBSyxlQUFMLENBQXFCLE9BQXJCLENBQXBCO0FBQ0EsYUFBSyxZQUFMLEdBQW9CLFFBQVEsV0FBNUI7QUFDQSxhQUFLLGFBQUwsR0FBcUIsUUFBUSxhQUFSLENBQXNCLGtCQUF0QixDQUFyQjs7QUFFQSxnQkFBUSxZQUFSLENBQXFCLGtCQUFyQixFQUF5QyxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBekM7QUFDQSxnQkFBUSxZQUFSLENBQXFCLGdCQUFyQixFQUF1QyxLQUFLLFdBQUwsQ0FBaUIsS0FBSyxXQUFMLENBQWlCLE1BQWpCLEdBQTBCLENBQTNDLENBQXZDOztBQUVBLGFBQUssU0FBTCxHQUFpQixRQUFRLGFBQVIsQ0FBc0IsK0JBQXRCLENBQWpCO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLFFBQVEsYUFBUixDQUFzQiwrQkFBdEIsQ0FBakI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsUUFBUSxhQUFSLENBQXNCLGlDQUF0QixDQUFoQjtBQUNBLGFBQUssUUFBTCxHQUFnQixRQUFRLGFBQVIsQ0FBc0IsaUNBQXRCLENBQWhCOztBQUVBLFlBQUksQ0FBQyxLQUFLLFNBQU4sSUFBbUIsQ0FBQyxLQUFLLFNBQXpCLElBQXNDLENBQUMsS0FBSyxRQUE1QyxJQUF3RCxDQUFDLEtBQUssUUFBbEUsRUFBNEU7QUFDeEUsb0JBQVEsR0FBUixDQUFZLHlCQUFaO0FBQ0E7QUFDSDs7QUFFRCxhQUFLLGFBQUw7QUFDQSxhQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDSDs7Ozt3Q0FFZTtBQUFBOztBQUVaLGFBQUMsWUFBRCxFQUFlLFdBQWYsRUFBNEIsT0FBNUIsQ0FBb0MsZ0JBQVE7QUFDeEMsdUJBQUssU0FBTCxDQUFlLGdCQUFmLENBQWdDLElBQWhDLEVBQXNDO0FBQUEsMkJBQUssT0FBSyxVQUFMLENBQWdCLENBQWhCLEVBQW1CO0FBQzFELHFDQUFhO0FBQUEsbUNBQVksT0FBSyxvQkFBTCxDQUEwQixRQUExQixDQUFaO0FBQUEseUJBRDZDO0FBRTFELCtCQUFPLE9BQUs7QUFGOEMscUJBQW5CLENBQUw7QUFBQSxpQkFBdEMsRUFHSSxLQUhKOztBQUtBLHVCQUFLLFNBQUwsQ0FBZSxnQkFBZixDQUFnQyxJQUFoQyxFQUFzQztBQUFBLDJCQUFLLE9BQUssVUFBTCxDQUFnQixDQUFoQixFQUFtQjtBQUMxRCxxQ0FBYTtBQUFBLG1DQUFZLE9BQUssb0JBQUwsQ0FBMEIsUUFBMUIsQ0FBWjtBQUFBLHlCQUQ2QztBQUUxRCwrQkFBTyxPQUFLO0FBRjhDLHFCQUFuQixDQUFMO0FBQUEsaUJBQXRDLEVBR0ksS0FISjtBQUlILGFBVkQ7O0FBWUEsaUJBQUssT0FBTCxDQUFhLGdCQUFiLENBQThCLFdBQTlCLEVBQTJDO0FBQUEsdUJBQUssT0FBSyxVQUFMLENBQWdCLENBQWhCLENBQUw7QUFBQSxhQUEzQyxFQUFvRSxLQUFwRTtBQUNBLGlCQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUE4QixVQUE5QixFQUEwQztBQUFBLHVCQUFLLE9BQUssVUFBTCxDQUFnQixDQUFoQixDQUFMO0FBQUEsYUFBMUMsRUFBbUUsS0FBbkU7QUFDQSxpQkFBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBOEIsYUFBOUIsRUFBNkM7QUFBQSx1QkFBSyxPQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBTDtBQUFBLGFBQTdDLEVBQXNFLEtBQXRFOztBQUVBLHFCQUFTLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDO0FBQUEsdUJBQUssT0FBSyxVQUFMLENBQWdCLENBQWhCLENBQUw7QUFBQSxhQUFyQyxFQUE4RCxLQUE5RDtBQUNBLHFCQUFTLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDO0FBQUEsdUJBQUssT0FBSyxVQUFMLENBQWdCLENBQWhCLENBQUw7QUFBQSxhQUF2QyxFQUFnRSxLQUFoRTs7QUFFQSxpQkFBSyxRQUFMLENBQWMsZ0JBQWQsQ0FBK0IsTUFBL0IsRUFBdUM7QUFBQSx1QkFBSyxPQUFLLGdCQUFMLENBQXNCLENBQXRCLEVBQXlCO0FBQ2pFLDRCQUFRLE9BQUssU0FEb0Q7QUFFakUsaUNBQWE7QUFBQSwrQkFBWSxPQUFLLG9CQUFMLENBQTBCLFFBQTFCLENBQVo7QUFBQTtBQUZvRCxpQkFBekIsQ0FBTDtBQUFBLGFBQXZDLEVBR0ksS0FISjs7QUFLQSxpQkFBSyxRQUFMLENBQWMsZ0JBQWQsQ0FBK0IsTUFBL0IsRUFBdUM7QUFBQSx1QkFBSyxPQUFLLGdCQUFMLENBQXNCLENBQXRCLEVBQXlCO0FBQ2pFLDRCQUFRLE9BQUssU0FEb0Q7QUFFakUsaUNBQWE7QUFBQSwrQkFBWSxPQUFLLG9CQUFMLENBQTBCLFFBQTFCLENBQVo7QUFBQTtBQUZvRCxpQkFBekIsQ0FBTDtBQUFBLGFBQXZDLEVBR0ksS0FISjs7QUFLQSxnQkFBSSxDQUFDLE1BQU0sS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixVQUEzQixDQUFMLEVBQTZDO0FBQ3pDLG9CQUFNLGFBQWEsS0FBSyx1QkFBTCxDQUE2QixLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFVBQWxELENBQW5CO0FBQ0Esb0JBQU0sV0FBVyxhQUFhLEdBQWIsR0FBbUIsS0FBSyxZQUF6QztBQUNBLHFCQUFLLGlCQUFMLENBQXVCLEtBQUssU0FBNUIsRUFBdUMsS0FBSyxRQUE1QyxFQUFzRCxRQUF0RCxFQUFnRSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFVBQXJGO0FBQ0g7O0FBRUQsZ0JBQUksQ0FBQyxNQUFNLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsUUFBM0IsQ0FBTCxFQUEyQztBQUN2QyxvQkFBTSxjQUFhLEtBQUssdUJBQUwsQ0FBNkIsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixRQUFsRCxDQUFuQjtBQUNBLG9CQUFNLFlBQVcsY0FBYSxHQUFiLEdBQW1CLEtBQUssWUFBekM7QUFDQSxxQkFBSyxpQkFBTCxDQUF1QixLQUFLLFNBQTVCLEVBQXVDLEtBQUssUUFBNUMsRUFBc0QsU0FBdEQsRUFBZ0UsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixRQUFyRjtBQUNIO0FBQ0o7Ozt3Q0FFZSxDLEVBQUc7QUFDZixnQkFBTSxRQUFRLEVBQUUsSUFBRixLQUFXLFdBQVgsR0FBeUIsRUFBRSxjQUFGLENBQWlCLENBQWpCLEVBQW9CLEtBQTdDLEdBQXFELEVBQUUsS0FBckU7QUFDQSxtQkFBTyxRQUFRLEtBQUssWUFBYixHQUE0QixLQUFLLFlBQUwsQ0FBa0IsTUFBOUMsR0FBd0QsS0FBSyxZQUFMLENBQWtCLE9BQWxCLENBQTBCLFdBQTFCLEdBQXdDLENBQXZHO0FBQ0g7OzttQ0FFVSxDLEVBQUcsSSxFQUFNO0FBQ2hCLGlCQUFLLFlBQUwsR0FBb0I7QUFDaEIseUJBQVMsRUFBRSxNQURLO0FBRWhCLHVCQUFPLEtBQUssS0FGSTtBQUdoQiw2QkFBYSxLQUFLLFdBSEY7QUFJaEIsd0JBQVEsRUFBRSxPQUFGLElBQWE7QUFKTCxhQUFwQjtBQU1BLGNBQUUsTUFBRixDQUFTLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsUUFBdkI7QUFDQSxtQkFBTyxLQUFQO0FBQ0g7OzttQ0FFVSxDLEVBQUc7QUFDVixjQUFFLGNBQUY7O0FBRUEsZ0JBQUksS0FBSyxZQUFULEVBQXVCO0FBQ25CLG9CQUFJLFdBQVcsS0FBSyxlQUFMLENBQXFCLENBQXJCLENBQWY7QUFDQSwyQkFBVyxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsQ0FBOEIsUUFBOUIsQ0FBWDtBQUNBLG9CQUFNLFFBQVEsS0FBSyxvQkFBTCxDQUEwQixRQUExQixDQUFkO0FBQ0EscUJBQUssaUJBQUwsQ0FBdUIsS0FBSyxZQUFMLENBQWtCLE9BQXpDLEVBQWtELEtBQUssWUFBTCxDQUFrQixLQUFwRSxFQUEyRSxRQUEzRSxFQUFxRixLQUFyRjtBQUNBLHVCQUFPLEtBQVA7QUFDSDtBQUNKOzs7eUNBRWdCLEMsRUFBRyxJLEVBQU07QUFDdEIsZ0JBQU0sYUFBYSxFQUFFLE1BQUYsQ0FBUyxLQUE1QjtBQUNBLGdCQUFJLE1BQU0sVUFBTixDQUFKLEVBQXVCOztBQUV2QixnQkFBTSxhQUFhLEtBQUssdUJBQUwsQ0FBNkIsVUFBN0IsQ0FBbkI7QUFDQSxnQkFBSSxXQUFXLGFBQWEsR0FBYixHQUFtQixLQUFLLFlBQXZDO0FBQ0EsdUJBQVcsS0FBSyxXQUFMLENBQWlCLFFBQWpCLENBQVg7QUFDQSxnQkFBTSxRQUFRLEtBQUssb0JBQUwsQ0FBMEIsUUFBMUIsQ0FBZDtBQUNBLGlCQUFLLGlCQUFMLENBQXVCLEtBQUssTUFBNUIsRUFBb0MsRUFBRSxNQUF0QyxFQUE4QyxRQUE5QyxFQUF3RCxLQUF4RDtBQUNBLG1CQUFPLEtBQVA7QUFDSDs7OzBDQUVpQixNLEVBQVEsSyxFQUFPLFEsRUFBVSxLLEVBQU87QUFDOUMsa0JBQU0sS0FBTixHQUFjLE1BQU0sUUFBTixFQUFkO0FBQ0Esa0JBQU0sS0FBTixDQUFZLElBQVosR0FBc0IsV0FBVyxNQUFNLFdBQU4sR0FBb0IsQ0FBckQ7QUFDQSxtQkFBTyxLQUFQLENBQWEsSUFBYixHQUF1QixXQUFXLE9BQU8sV0FBUCxHQUFxQixDQUF2RDtBQUNBLGlCQUFLLGlCQUFMO0FBQ0g7Ozs2Q0FFb0IsUSxFQUFVO0FBQzNCLGdCQUFNLGFBQWEsV0FBVyxLQUFLLFlBQWhCLEdBQStCLEdBQWxEO0FBQ0Esb0JBQVEsR0FBUixDQUFlLFFBQWYsWUFBOEIsVUFBOUI7QUFDQSxnQkFBTSxlQUFlLEtBQUssMkJBQUwsQ0FBaUMsVUFBakMsQ0FBckI7QUFDQSxnQkFBTSxTQUFTLEtBQUssZ0JBQUwsQ0FBc0IsWUFBdEIsQ0FBZjtBQUNBLG1CQUFPLEtBQUssSUFBTCxDQUFVLENBQUMsYUFBYSxPQUFPLGVBQXJCLEtBQXlDLE9BQU8sS0FBUCxHQUFlLE9BQU8sS0FBL0QsSUFBd0UsR0FBeEUsR0FBOEUsT0FBTyxVQUEvRixDQUFQO0FBQ0g7OztnREFFdUIsSyxFQUFPO0FBQzNCLGdCQUFNLGVBQWUsS0FBSyxzQkFBTCxDQUE0QixLQUE1QixDQUFyQjtBQUNBLGdCQUFNLFNBQVMsS0FBSyxnQkFBTCxDQUFzQixZQUF0QixDQUFmO0FBQ0EsbUJBQU8sQ0FBQyxRQUFRLE9BQU8sVUFBaEIsS0FBK0IsT0FBTyxLQUFQLEdBQWUsT0FBTyxLQUFyRCxJQUE4RCxHQUE5RCxHQUFvRSxPQUFPLGVBQWxGO0FBQ0g7Ozt5Q0FFZ0IsWSxFQUFjO0FBQzNCLGdCQUFNLGdCQUFnQjtBQUNsQiw0QkFBWSxLQUFLLFdBQUwsQ0FBaUIsZUFBZSxDQUFoQyxDQURNO0FBRWxCLDBCQUFVLEtBQUssV0FBTCxDQUFpQixZQUFqQixDQUZRO0FBR2xCLGlDQUFpQixLQUFLLGdCQUFMLENBQXNCLGVBQWUsQ0FBckMsQ0FIQztBQUlsQiwrQkFBZSxLQUFLLGdCQUFMLENBQXNCLFlBQXRCO0FBSkcsYUFBdEI7QUFNQSwwQkFBYyxLQUFkLEdBQXNCLGNBQWMsUUFBZCxHQUF5QixjQUFjLFVBQTdEO0FBQ0EsMEJBQWMsVUFBZCxHQUEyQixjQUFjLGFBQWQsR0FBOEIsY0FBYyxlQUF2RTtBQUNBLDBCQUFjLEtBQWQsR0FBc0IsTUFBTSxjQUFjLFVBQTFDOztBQUVBLG1CQUFPLGFBQVA7QUFDSDs7O29EQUUyQixVLEVBQVk7QUFDcEMsZ0JBQUksVUFBVSxDQUFkO0FBQ0EsbUJBQU8sYUFBYSxLQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQXBCLEVBQW9EO0FBQ2hEO0FBQ0g7QUFDRCxtQkFBTyxPQUFQO0FBQ0g7OzsrQ0FFc0IsSyxFQUFPO0FBQzFCLGdCQUFJLFVBQVUsQ0FBZDtBQUNBLG1CQUFPLFFBQVEsS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQWYsRUFBMEM7QUFDdEM7QUFDSDtBQUNELG1CQUFPLE9BQVA7QUFDSDs7OzZDQUVvQixRLEVBQVU7QUFDM0IsZ0JBQUksV0FBVyxDQUFmLEVBQ0ksT0FBTyxDQUFQO0FBQ0osZ0JBQUssV0FBVyxLQUFLLFNBQUwsQ0FBZSxXQUFmLEdBQTZCLENBQXpDLEdBQThDLEtBQUssU0FBTCxDQUFlLFVBQWpFLEVBQTZFO0FBQ3pFLHFCQUFLLFNBQUwsQ0FBZSxLQUFmLENBQXFCLE1BQXJCLEdBQThCLENBQTlCO0FBQ0EscUJBQUssU0FBTCxDQUFlLEtBQWYsQ0FBcUIsTUFBckIsR0FBOEIsQ0FBOUI7QUFDSDtBQUNELGdCQUFJLFdBQVksS0FBSyxTQUFMLENBQWUsVUFBZixHQUE0QixLQUFLLFNBQUwsQ0FBZSxXQUFmLEdBQTZCLENBQXpFLEVBQ0ksT0FBTyxLQUFLLFNBQUwsQ0FBZSxVQUFmLEdBQTRCLEtBQUssU0FBTCxDQUFlLFdBQWYsR0FBNkIsQ0FBaEU7QUFDSixtQkFBTyxRQUFQO0FBQ0g7Ozs2Q0FFb0IsUSxFQUFVO0FBQzNCLGdCQUFLLFdBQVcsS0FBSyxTQUFMLENBQWUsV0FBZixHQUE2QixDQUF6QyxHQUErQyxLQUFLLFNBQUwsQ0FBZSxVQUFmLEdBQTRCLEtBQUssU0FBTCxDQUFlLFdBQTlGLEVBQTRHO0FBQ3hHLHFCQUFLLFNBQUwsQ0FBZSxLQUFmLENBQXFCLE1BQXJCLEdBQThCLENBQTlCO0FBQ0EscUJBQUssU0FBTCxDQUFlLEtBQWYsQ0FBcUIsTUFBckIsR0FBOEIsQ0FBOUI7QUFDSDtBQUNELGdCQUFJLFdBQVcsS0FBSyxTQUFMLENBQWUsV0FBZixHQUE2QixDQUF4QyxHQUE0QyxLQUFLLFNBQUwsQ0FBZSxVQUEvRCxFQUNJLE9BQU8sS0FBSyxTQUFMLENBQWUsVUFBZixHQUE0QixLQUFLLFNBQUwsQ0FBZSxXQUFmLEdBQTZCLENBQWhFO0FBQ0osZ0JBQUksV0FBVyxLQUFLLFlBQXBCLEVBQ0ksT0FBTyxLQUFLLFlBQVo7QUFDSixtQkFBTyxRQUFQO0FBQ0g7Ozs0Q0FFbUI7QUFDaEIsaUJBQUssYUFBTCxDQUFtQixLQUFuQixDQUF5QixJQUF6QixHQUFtQyxLQUFLLFNBQUwsQ0FBZSxVQUFmLEdBQTRCLEtBQUssU0FBTCxDQUFlLFdBQWYsR0FBNkIsQ0FBNUY7QUFDQSxpQkFBSyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLEtBQXpCLEdBQW9DLEtBQUssWUFBTCxHQUFvQixLQUFLLFNBQUwsQ0FBZSxVQUF2RTtBQUNIOzs7cUNBRVk7QUFDVCxnQkFBSSxDQUFDLEtBQUssWUFBVixFQUNJO0FBQ0osaUJBQUssWUFBTCxDQUFrQixPQUFsQixDQUEwQixTQUExQixDQUFvQyxNQUFwQyxDQUEyQyxRQUEzQztBQUNBLGlCQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDSDs7O3dDQUVlLE8sRUFBUztBQUNyQixnQkFBSSxPQUFPLENBQVg7QUFDQSxtQkFBTyxRQUFRLFlBQWYsRUFBNkI7QUFDekIsd0JBQVEsUUFBUSxVQUFoQjtBQUNBLDBCQUFVLFFBQVEsWUFBbEI7QUFDSDtBQUNELG9CQUFRLFFBQVEsVUFBaEI7QUFDQSxtQkFBTyxJQUFQO0FBQ0g7Ozs7OztrQkFHVSxXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBSYW5nZVNsaWRlciBmcm9tICcuL3JhbmdlLXNsaWRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGV4IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kYXRhQ29tcG9uZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnRdXCIpO1xuICAgICAgICBpZiAodGhpcy5kYXRhQ29tcG9uZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFDb21wb25lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5kYXRhQ29tcG9uZW50cyk7XG4gICAgICAgICAgICB0aGlzLmxvYWREYXRhQ29tcG9uZW50cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZERhdGFDb21wb25lbnRzKCkge1xuICAgICAgICB0aGlzLmRhdGFDb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICAgICAgICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb21wb25lbnRcIik7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50T3B0aW9ucyA9IGNvbXBvbmVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbXBvbmVudC1vcHRpb25zXCIpO1xuICAgICAgICAgICAgaWYgKCEhY29tcG9uZW50T3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudE9wdGlvbnMgPSBKU09OLnBhcnNlKGNvbXBvbmVudE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaChleCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbXBvbmVudCBvcHRpb25zOiBcIiwgY29tcG9uZW50T3B0aW9ucywgXCIgaXMgbm90IHZhbGlkIGpzb25cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoIChjb21wb25lbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIlJhbmdlU2xpZGVyXCI6XG4gICAgICAgICAgICAgICAgICAgIG5ldyBSYW5nZVNsaWRlcihjb21wb25lbnQsIGNvbXBvbmVudE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xufVxuXG5uZXcgSW5kZXgoKTsiLCJjbGFzcyBSYW5nZVNsaWRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMucmFuZ2VWYWx1ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5yYW5nZVBlcmNlbnRhZ2VzID0gW107XG5cbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LnNsaWRlclZhbHVlcy5zcGxpdChcIixcIikuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmICghaXNOYU4ocGFyc2VGbG9hdChpdGVtLnRyaW0oKSkpKVxuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VWYWx1ZXMucHVzaChwYXJzZUZsb2F0KGl0ZW0udHJpbSgpKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQuZGF0YXNldC5zbGlkZXJQZXJjZW50YWdlcy5zcGxpdChcIixcIikuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmICghaXNOYU4ocGFyc2VGbG9hdChpdGVtLnRyaW0oKSkpKVxuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VQZXJjZW50YWdlcy5wdXNoKHBhcnNlRmxvYXQoaXRlbS50cmltKCkpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMucmFuZ2VWYWx1ZXMubGVuZ3RoID09PSAwIHx8IHRoaXMucmFuZ2VWYWx1ZXMubGVuZ3RoICE9PSB0aGlzLnJhbmdlUGVyY2VudGFnZXMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudFN0YXJ0ID0gdGhpcy5nZXRMZWZ0UG9zaXRpb24oZWxlbWVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgdGhpcy5pbnRlcnZhbFRyYWNrID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlci1pbnRlcnZhbFwiKTtcblxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc3RhcnQtcmFuZ2VcIiwgdGhpcy5yYW5nZVZhbHVlc1swXSk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1lbmQtcmFuZ2VcIiwgdGhpcy5yYW5nZVZhbHVlc1t0aGlzLnJhbmdlVmFsdWVzLmxlbmd0aCAtIDFdKTtcblxuICAgICAgICB0aGlzLm1pbkhhbmRsZSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2W2RhdGEtc2xpZGVyLWhhbmRsZT1cIm1pblwiXScpO1xuICAgICAgICB0aGlzLm1heEhhbmRsZSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2W2RhdGEtc2xpZGVyLWhhbmRsZT1cIm1heFwiXScpO1xuICAgICAgICB0aGlzLm1pbklucHV0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtkYXRhLXNsaWRlci1oYW5kbGU9XCJtaW5cIl0nKTtcbiAgICAgICAgdGhpcy5tYXhJbnB1dCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbZGF0YS1zbGlkZXItaGFuZGxlPVwibWF4XCJdJyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLm1pbkhhbmRsZSB8fCAhdGhpcy5tYXhIYW5kbGUgfHwgIXRoaXMubWluSW5wdXQgfHwgIXRoaXMubWF4SW5wdXQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTWlzc2luZyBuZWVkZWQgZWxlbWVudHNcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldHVwSGFuZGxlcnMoKTtcbiAgICAgICAgdGhpcy5hY3RpdmVIYW5kbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHNldHVwSGFuZGxlcnMoKSB7XG5cbiAgICAgICAgW1widG91Y2hzdGFydFwiLCBcIm1vdXNlZG93blwiXS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5taW5IYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBlID0+IHRoaXMuc3RhcnRTbGlkZShlLCB7XG4gICAgICAgICAgICAgICAgZ2V0UG9zaXRpb246IHBvc2l0aW9uID0+IHRoaXMuZ2V0TWluSGFuZGxlUG9zaXRpb24ocG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIGxhYmVsOiB0aGlzLm1pbklucHV0XG4gICAgICAgICAgICB9KSwgZmFsc2UpO1xuXG4gICAgICAgICAgICB0aGlzLm1heEhhbmRsZS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGUgPT4gdGhpcy5zdGFydFNsaWRlKGUsIHtcbiAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbjogcG9zaXRpb24gPT4gdGhpcy5nZXRNYXhIYW5kbGVQb3NpdGlvbihwb3NpdGlvbiksXG4gICAgICAgICAgICAgICAgbGFiZWw6IHRoaXMubWF4SW5wdXRcbiAgICAgICAgICAgIH0pLCBmYWxzZSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgZSA9PiB0aGlzLmhhbmRsZU1vdmUoZSksIGZhbHNlKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBlID0+IHRoaXMuaGFuZGxlU3RvcChlKSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsIGUgPT4gdGhpcy5oYW5kbGVTdG9wKGUpLCBmYWxzZSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZSA9PiB0aGlzLmhhbmRsZVN0b3AoZSksIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlID0+IHRoaXMuaGFuZGxlTW92ZShlKSwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMubWluSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgZSA9PiB0aGlzLmhhbmRsZVZhbHVlSW5wdXQoZSwge1xuICAgICAgICAgICAgaGFuZGxlOiB0aGlzLm1pbkhhbmRsZSxcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiBwb3NpdGlvbiA9PiB0aGlzLmdldE1pbkhhbmRsZVBvc2l0aW9uKHBvc2l0aW9uKVxuICAgICAgICB9KSwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMubWF4SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgZSA9PiB0aGlzLmhhbmRsZVZhbHVlSW5wdXQoZSwge1xuICAgICAgICAgICAgaGFuZGxlOiB0aGlzLm1heEhhbmRsZSxcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiBwb3NpdGlvbiA9PiB0aGlzLmdldE1heEhhbmRsZVBvc2l0aW9uKHBvc2l0aW9uKVxuICAgICAgICB9KSwgZmFsc2UpO1xuXG4gICAgICAgIGlmICghaXNOYU4odGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhcnRWYWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSB0aGlzLmNhbGN1bGF0ZUhhbmRsZVBvc2l0aW9uKHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0YXJ0VmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBwZXJjZW50YWdlIC8gMTAwICogdGhpcy5lbGVtZW50V2lkdGg7XG4gICAgICAgICAgICB0aGlzLnNldEhhbmRsZVBvc2l0aW9uKHRoaXMubWluSGFuZGxlLCB0aGlzLm1pbklucHV0LCBwb3NpdGlvbiwgdGhpcy5lbGVtZW50LmRhdGFzZXQuc3RhcnRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzTmFOKHRoaXMuZWxlbWVudC5kYXRhc2V0LmVuZFZhbHVlKSkge1xuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IHRoaXMuY2FsY3VsYXRlSGFuZGxlUG9zaXRpb24odGhpcy5lbGVtZW50LmRhdGFzZXQuZW5kVmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBwZXJjZW50YWdlIC8gMTAwICogdGhpcy5lbGVtZW50V2lkdGg7XG4gICAgICAgICAgICB0aGlzLnNldEhhbmRsZVBvc2l0aW9uKHRoaXMubWF4SGFuZGxlLCB0aGlzLm1heElucHV0LCBwb3NpdGlvbiwgdGhpcy5lbGVtZW50LmRhdGFzZXQuZW5kVmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGFuZGxlT2Zmc2V0KGUpIHtcbiAgICAgICAgY29uc3QgcGFnZVggPSBlLnR5cGUgPT09IFwidG91Y2htb3ZlXCIgPyBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYIDogZS5wYWdlWDtcbiAgICAgICAgcmV0dXJuIHBhZ2VYIC0gdGhpcy5lbGVtZW50U3RhcnQgLSB0aGlzLmFjdGl2ZUhhbmRsZS5vZmZzZXQgKyAodGhpcy5hY3RpdmVIYW5kbGUuZWxlbWVudC5vZmZzZXRXaWR0aCAvIDIpO1xuICAgIH1cblxuICAgIHN0YXJ0U2xpZGUoZSwgZGF0YSkge1xuICAgICAgICB0aGlzLmFjdGl2ZUhhbmRsZSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IGUudGFyZ2V0LFxuICAgICAgICAgICAgbGFiZWw6IGRhdGEubGFiZWwsXG4gICAgICAgICAgICBnZXRQb3NpdGlvbjogZGF0YS5nZXRQb3NpdGlvbixcbiAgICAgICAgICAgIG9mZnNldDogZS5vZmZzZXRYIHx8IDBcbiAgICAgICAgfTtcbiAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaGFuZGxlTW92ZShlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAodGhpcy5hY3RpdmVIYW5kbGUpIHtcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuZ2V0SGFuZGxlT2Zmc2V0KGUpO1xuICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLmFjdGl2ZUhhbmRsZS5nZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuY2FsY3VsYXRlSGFuZGxlVmFsdWUocG9zaXRpb24pO1xuICAgICAgICAgICAgdGhpcy5zZXRIYW5kbGVQb3NpdGlvbih0aGlzLmFjdGl2ZUhhbmRsZS5lbGVtZW50LCB0aGlzLmFjdGl2ZUhhbmRsZS5sYWJlbCwgcG9zaXRpb24sIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZVZhbHVlSW5wdXQoZSwgZGF0YSkge1xuICAgICAgICBjb25zdCBpbnB1dFZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIGlmIChpc05hTihpbnB1dFZhbHVlKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSB0aGlzLmNhbGN1bGF0ZUhhbmRsZVBvc2l0aW9uKGlucHV0VmFsdWUpO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSBwZXJjZW50YWdlIC8gMTAwICogdGhpcy5lbGVtZW50V2lkdGg7XG4gICAgICAgIHBvc2l0aW9uID0gZGF0YS5nZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jYWxjdWxhdGVIYW5kbGVWYWx1ZShwb3NpdGlvbik7XG4gICAgICAgIHRoaXMuc2V0SGFuZGxlUG9zaXRpb24oZGF0YS5oYW5kbGUsIGUudGFyZ2V0LCBwb3NpdGlvbiwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc2V0SGFuZGxlUG9zaXRpb24oaGFuZGxlLCBsYWJlbCwgcG9zaXRpb24sIHZhbHVlKSB7XG4gICAgICAgIGxhYmVsLnZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgbGFiZWwuc3R5bGUubGVmdCA9IGAke3Bvc2l0aW9uIC0gbGFiZWwub2Zmc2V0V2lkdGggLyAyfXB4YDtcbiAgICAgICAgaGFuZGxlLnN0eWxlLmxlZnQgPSBgJHtwb3NpdGlvbiAtIGhhbmRsZS5vZmZzZXRXaWR0aCAvIDJ9cHhgO1xuICAgICAgICB0aGlzLnNldEFjdGl2ZUludGVydmFsKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSGFuZGxlVmFsdWUocG9zaXRpb24pIHtcbiAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IHBvc2l0aW9uIC8gdGhpcy5lbGVtZW50V2lkdGggKiAxMDA7XG4gICAgICAgIGNvbnNvbGUubG9nKGAke3Bvc2l0aW9ufXB4OiAke3BlcmNlbnRhZ2V9JWApO1xuICAgICAgICBjb25zdCByYW5nZVNlY3Rpb24gPSB0aGlzLmdldFJhbmdlU2VjdGlvbkJ5UGVyY2VudGFnZShwZXJjZW50YWdlKTtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5nZXRTZWN0aW9uVmFsdWVzKHJhbmdlU2VjdGlvbik7XG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwoKHBlcmNlbnRhZ2UgLSB2YWx1ZXMuc3RhcnRQZXJjZW50YWdlKSAqICh2YWx1ZXMudmFsdWUgKiB2YWx1ZXMucmF0aW8pIC8gMTAwICsgdmFsdWVzLnN0YXJ0VmFsdWUpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUhhbmRsZVBvc2l0aW9uKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHJhbmdlU2VjdGlvbiA9IHRoaXMuZ2V0UmFuZ2VTZWN0aW9uQnlWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0U2VjdGlvblZhbHVlcyhyYW5nZVNlY3Rpb24pO1xuICAgICAgICByZXR1cm4gKHZhbHVlIC0gdmFsdWVzLnN0YXJ0VmFsdWUpIC8gKHZhbHVlcy52YWx1ZSAqIHZhbHVlcy5yYXRpbykgKiAxMDAgKyB2YWx1ZXMuc3RhcnRQZXJjZW50YWdlO1xuICAgIH1cblxuICAgIGdldFNlY3Rpb25WYWx1ZXMocmFuZ2VTZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNlY3Rpb25WYWx1ZXMgPSB7XG4gICAgICAgICAgICBzdGFydFZhbHVlOiB0aGlzLnJhbmdlVmFsdWVzW3JhbmdlU2VjdGlvbiAtIDFdLFxuICAgICAgICAgICAgZW5kVmFsdWU6IHRoaXMucmFuZ2VWYWx1ZXNbcmFuZ2VTZWN0aW9uXSxcbiAgICAgICAgICAgIHN0YXJ0UGVyY2VudGFnZTogdGhpcy5yYW5nZVBlcmNlbnRhZ2VzW3JhbmdlU2VjdGlvbiAtIDFdLFxuICAgICAgICAgICAgZW5kUGVyY2VudGFnZTogdGhpcy5yYW5nZVBlcmNlbnRhZ2VzW3JhbmdlU2VjdGlvbl0sXG4gICAgICAgIH07XG4gICAgICAgIHNlY3Rpb25WYWx1ZXMudmFsdWUgPSBzZWN0aW9uVmFsdWVzLmVuZFZhbHVlIC0gc2VjdGlvblZhbHVlcy5zdGFydFZhbHVlO1xuICAgICAgICBzZWN0aW9uVmFsdWVzLnBlcmNlbnRhZ2UgPSBzZWN0aW9uVmFsdWVzLmVuZFBlcmNlbnRhZ2UgLSBzZWN0aW9uVmFsdWVzLnN0YXJ0UGVyY2VudGFnZTtcbiAgICAgICAgc2VjdGlvblZhbHVlcy5yYXRpbyA9IDEwMCAvIHNlY3Rpb25WYWx1ZXMucGVyY2VudGFnZTtcblxuICAgICAgICByZXR1cm4gc2VjdGlvblZhbHVlcztcbiAgICB9XG5cbiAgICBnZXRSYW5nZVNlY3Rpb25CeVBlcmNlbnRhZ2UocGVyY2VudGFnZSkge1xuICAgICAgICBsZXQgc2VjdGlvbiA9IDE7XG4gICAgICAgIHdoaWxlIChwZXJjZW50YWdlID4gdGhpcy5yYW5nZVBlcmNlbnRhZ2VzW3NlY3Rpb25dKSB7XG4gICAgICAgICAgICBzZWN0aW9uKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlY3Rpb247XG4gICAgfVxuXG4gICAgZ2V0UmFuZ2VTZWN0aW9uQnlWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBsZXQgc2VjdGlvbiA9IDE7XG4gICAgICAgIHdoaWxlICh2YWx1ZSA+IHRoaXMucmFuZ2VWYWx1ZXNbc2VjdGlvbl0pIHtcbiAgICAgICAgICAgIHNlY3Rpb24rKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VjdGlvbjtcbiAgICB9XG5cbiAgICBnZXRNaW5IYW5kbGVQb3NpdGlvbihwb3NpdGlvbikge1xuICAgICAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIGlmICgocG9zaXRpb24gKyB0aGlzLm1pbkhhbmRsZS5vZmZzZXRXaWR0aCAvIDIpID4gdGhpcy5tYXhIYW5kbGUub2Zmc2V0TGVmdCkge1xuICAgICAgICAgICAgdGhpcy5taW5IYW5kbGUuc3R5bGUuekluZGV4ID0gNTtcbiAgICAgICAgICAgIHRoaXMubWF4SGFuZGxlLnN0eWxlLnpJbmRleCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvc2l0aW9uID4gKHRoaXMubWF4SGFuZGxlLm9mZnNldExlZnQgKyB0aGlzLm1heEhhbmRsZS5vZmZzZXRXaWR0aCAvIDIpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF4SGFuZGxlLm9mZnNldExlZnQgKyB0aGlzLm1heEhhbmRsZS5vZmZzZXRXaWR0aCAvIDI7XG4gICAgICAgIHJldHVybiBwb3NpdGlvbjtcbiAgICB9XG5cbiAgICBnZXRNYXhIYW5kbGVQb3NpdGlvbihwb3NpdGlvbikge1xuICAgICAgICBpZiAoKHBvc2l0aW9uIC0gdGhpcy5tYXhIYW5kbGUub2Zmc2V0V2lkdGggLyAyKSA8ICh0aGlzLm1pbkhhbmRsZS5vZmZzZXRMZWZ0ICsgdGhpcy5tYXhIYW5kbGUub2Zmc2V0V2lkdGgpKSB7XG4gICAgICAgICAgICB0aGlzLm1heEhhbmRsZS5zdHlsZS56SW5kZXggPSA1O1xuICAgICAgICAgICAgdGhpcy5taW5IYW5kbGUuc3R5bGUuekluZGV4ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zaXRpb24gLSB0aGlzLm1heEhhbmRsZS5vZmZzZXRXaWR0aCAvIDIgPCB0aGlzLm1pbkhhbmRsZS5vZmZzZXRMZWZ0KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWluSGFuZGxlLm9mZnNldExlZnQgKyB0aGlzLm1heEhhbmRsZS5vZmZzZXRXaWR0aCAvIDI7XG4gICAgICAgIGlmIChwb3NpdGlvbiA+IHRoaXMuZWxlbWVudFdpZHRoKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFdpZHRoO1xuICAgICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgfVxuXG4gICAgc2V0QWN0aXZlSW50ZXJ2YWwoKSB7XG4gICAgICAgIHRoaXMuaW50ZXJ2YWxUcmFjay5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5taW5IYW5kbGUub2Zmc2V0TGVmdCArIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoIC8gMn1weGA7XG4gICAgICAgIHRoaXMuaW50ZXJ2YWxUcmFjay5zdHlsZS5yaWdodCA9IGAke3RoaXMuZWxlbWVudFdpZHRoIC0gdGhpcy5tYXhIYW5kbGUub2Zmc2V0TGVmdH1weGA7XG4gICAgfVxuXG4gICAgaGFuZGxlU3RvcCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZUhhbmRsZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5hY3RpdmVIYW5kbGUuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgICAgICB0aGlzLmFjdGl2ZUhhbmRsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0TGVmdFBvc2l0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGxlZnQgPSAwO1xuICAgICAgICB3aGlsZSAoZWxlbWVudC5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgICAgIGxlZnQgKz0gZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIGxlZnQgKz0gZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgICAgICByZXR1cm4gbGVmdDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhbmdlU2xpZGVyO1xuIl19
