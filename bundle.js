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
                var position = Math.ceil(this.getHandleOffset(e));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2luZGV4LmpzIiwic2NyaXB0cy9yYW5nZS1zbGlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7OztJQUVxQixLO0FBQ2pCLHFCQUFjO0FBQUE7O0FBQ1YsYUFBSyxjQUFMLEdBQXNCLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQXRCO0FBQ0EsWUFBSSxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsR0FBNkIsQ0FBakMsRUFBb0M7QUFDaEMsaUJBQUssY0FBTCxHQUFzQixNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsS0FBSyxjQUFoQyxDQUF0QjtBQUNBLGlCQUFLLGtCQUFMO0FBQ0g7QUFDSjs7Ozs2Q0FFb0I7QUFDakIsaUJBQUssY0FBTCxDQUFvQixPQUFwQixDQUE0QixVQUFVLFNBQVYsRUFBcUI7QUFDN0Msb0JBQUksZ0JBQWdCLFVBQVUsWUFBVixDQUF1QixnQkFBdkIsQ0FBcEI7QUFDQSxvQkFBSSxtQkFBbUIsVUFBVSxZQUFWLENBQXVCLHdCQUF2QixDQUF2QjtBQUNBLG9CQUFJLENBQUMsQ0FBQyxnQkFBTixFQUF3QjtBQUNwQix3QkFBSTtBQUNBLDJDQUFtQixLQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUFuQjtBQUNILHFCQUZELENBR0EsT0FBTSxFQUFOLEVBQVU7QUFDTixnQ0FBUSxHQUFSLENBQVkscUJBQVosRUFBbUMsZ0JBQW5DLEVBQXFELG9CQUFyRDtBQUNIO0FBQ0o7QUFDRCx3QkFBUSxhQUFSO0FBQ0kseUJBQUssYUFBTDtBQUNJLGtEQUFnQixTQUFoQixFQUEyQixnQkFBM0I7QUFDQTtBQUhSO0FBS0MsYUFoQkw7QUFpQkg7Ozs7OztrQkEzQmdCLEs7OztBQThCckIsSUFBSSxLQUFKOzs7Ozs7Ozs7Ozs7O0lDaENNLFc7QUFFRix5QkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FB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QUE4QixDQUE5QjtBQUNBLHFCQUFLLFNBQUwsQ0FBZSxLQUFmLENBQXFCLE1BQXJCLEdBQThCLENBQTlCO0FBQ0g7QUFDRCxnQkFBSSxXQUFXLEtBQUssU0FBTCxDQUFlLFdBQWYsR0FBNkIsQ0FBeEMsR0FBNEMsS0FBSyxTQUFMLENBQWUsVUFBL0QsRUFDSSxPQUFPLEtBQUssU0FBTCxDQUFlLFVBQWYsR0FBNEIsS0FBSyxTQUFMLENBQWUsV0FBZixHQUE2QixDQUFoRTtBQUNKLGdCQUFJLFdBQVcsS0FBSyxZQUFwQixFQUNJLE9BQU8sS0FBSyxZQUFaO0FBQ0osbUJBQU8sUUFBUDtBQUNIOzs7NENBRW1CO0FBQ2hCLGlCQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBeUIsSUFBekIsR0FBbUMsS0FBSyxTQUFMLENBQWUsVUFBZixHQUE0QixLQUFLLFNBQUwsQ0FBZSxXQUFmLEdBQTZCLENBQTVGO0FBQ0EsaUJBQUssYUFBTCxDQUFtQixLQUFuQixDQUF5QixLQUF6QixHQUFvQyxLQUFLLFlBQUwsR0FBb0IsS0FBSyxTQUFMLENBQWUsVUFBdkU7QUFDSDs7O3FDQUVZO0FBQ1QsZ0JBQUksQ0FBQyxLQUFLLFlBQVYsRUFDSTtBQUNKLGlCQUFLLFlBQUwsQ0FBa0IsT0FBbEIsQ0FBMEIsU0FBMUIsQ0FBb0MsTUFBcEMsQ0FBMkMsUUFBM0M7QUFDQSxpQkFBSyxZQUFMLEdBQW9CLElBQXBCO0FBQ0g7Ozt3Q0FFZSxPLEVBQVM7QUFDckIsZ0JBQUksT0FBTyxDQUFYO0FBQ0EsbUJBQU8sUUFBUSxZQUFmLEVBQTZCO0FBQ3pCLHdCQUFRLFFBQVEsVUFBaEI7QUFDQSwwQkFBVSxRQUFRLFlBQWxCO0FBQ0g7QUFDRCxvQkFBUSxRQUFRLFVBQWhCO0FBQ0EsbUJBQU8sSUFBUDtBQUNIOzs7Ozs7a0JBR1UsVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUmFuZ2VTbGlkZXIgZnJvbSAnLi9yYW5nZS1zbGlkZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRleCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGF0YUNvbXBvbmVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtY29tcG9uZW50XVwiKTtcbiAgICAgICAgaWYgKHRoaXMuZGF0YUNvbXBvbmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhQ29tcG9uZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuZGF0YUNvbXBvbmVudHMpO1xuICAgICAgICAgICAgdGhpcy5sb2FkRGF0YUNvbXBvbmVudHMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvYWREYXRhQ29tcG9uZW50cygpIHtcbiAgICAgICAgdGhpcy5kYXRhQ29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICAgICAgICAgIHZhciBjb21wb25lbnROYW1lID0gY29tcG9uZW50LmdldEF0dHJpYnV0ZShcImRhdGEtY29tcG9uZW50XCIpO1xuICAgICAgICAgICAgdmFyIGNvbXBvbmVudE9wdGlvbnMgPSBjb21wb25lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb21wb25lbnQtb3B0aW9uc1wiKTtcbiAgICAgICAgICAgIGlmICghIWNvbXBvbmVudE9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRPcHRpb25zID0gSlNPTi5wYXJzZShjb21wb25lbnRPcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2goZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb21wb25lbnQgb3B0aW9uczogXCIsIGNvbXBvbmVudE9wdGlvbnMsIFwiIGlzIG5vdCB2YWxpZCBqc29uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAoY29tcG9uZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJSYW5nZVNsaWRlclwiOlxuICAgICAgICAgICAgICAgICAgICBuZXcgUmFuZ2VTbGlkZXIoY29tcG9uZW50LCBjb21wb25lbnRPcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfTtcbn1cblxubmV3IEluZGV4KCk7IiwiY2xhc3MgUmFuZ2VTbGlkZXIge1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLnJhbmdlVmFsdWVzID0gW107XG4gICAgICAgIHRoaXMucmFuZ2VQZXJjZW50YWdlcyA9IFtdO1xuXG4gICAgICAgIGVsZW1lbnQuZGF0YXNldC5zbGlkZXJWYWx1ZXMuc3BsaXQoXCIsXCIpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKHBhcnNlRmxvYXQoaXRlbS50cmltKCkpKSlcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlVmFsdWVzLnB1c2gocGFyc2VGbG9hdChpdGVtLnRyaW0oKSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50LmRhdGFzZXQuc2xpZGVyUGVyY2VudGFnZXMuc3BsaXQoXCIsXCIpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKHBhcnNlRmxvYXQoaXRlbS50cmltKCkpKSlcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlUGVyY2VudGFnZXMucHVzaChwYXJzZUZsb2F0KGl0ZW0udHJpbSgpKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLnJhbmdlVmFsdWVzLmxlbmd0aCA9PT0gMCB8fCB0aGlzLnJhbmdlVmFsdWVzLmxlbmd0aCAhPT0gdGhpcy5yYW5nZVBlcmNlbnRhZ2VzLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzLmVsZW1lbnRTdGFydCA9IHRoaXMuZ2V0TGVmdFBvc2l0aW9uKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLmVsZW1lbnRXaWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgIHRoaXMuaW50ZXJ2YWxUcmFjayA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXItaW50ZXJ2YWxcIik7XG5cbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXN0YXJ0LXJhbmdlXCIsIHRoaXMucmFuZ2VWYWx1ZXNbMF0pO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtZW5kLXJhbmdlXCIsIHRoaXMucmFuZ2VWYWx1ZXNbdGhpcy5yYW5nZVZhbHVlcy5sZW5ndGggLSAxXSk7XG5cbiAgICAgICAgdGhpcy5taW5IYW5kbGUgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RpdltkYXRhLXNsaWRlci1oYW5kbGU9XCJtaW5cIl0nKTtcbiAgICAgICAgdGhpcy5tYXhIYW5kbGUgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RpdltkYXRhLXNsaWRlci1oYW5kbGU9XCJtYXhcIl0nKTtcbiAgICAgICAgdGhpcy5taW5JbnB1dCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbZGF0YS1zbGlkZXItaGFuZGxlPVwibWluXCJdJyk7XG4gICAgICAgIHRoaXMubWF4SW5wdXQgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W2RhdGEtc2xpZGVyLWhhbmRsZT1cIm1heFwiXScpO1xuXG4gICAgICAgIGlmICghdGhpcy5taW5IYW5kbGUgfHwgIXRoaXMubWF4SGFuZGxlIHx8ICF0aGlzLm1pbklucHV0IHx8ICF0aGlzLm1heElucHV0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1pc3NpbmcgbmVlZGVkIGVsZW1lbnRzXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXR1cEhhbmRsZXJzKCk7XG4gICAgICAgIHRoaXMuYWN0aXZlSGFuZGxlID0gbnVsbDtcbiAgICB9XG5cbiAgICBzZXR1cEhhbmRsZXJzKCkge1xuXG4gICAgICAgIFtcInRvdWNoc3RhcnRcIiwgXCJtb3VzZWRvd25cIl0uZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgIHRoaXMubWluSGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZSA9PiB0aGlzLnN0YXJ0U2xpZGUoZSwge1xuICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uOiBwb3NpdGlvbiA9PiB0aGlzLmdldE1pbkhhbmRsZVBvc2l0aW9uKHBvc2l0aW9uKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogdGhpcy5taW5JbnB1dFxuICAgICAgICAgICAgfSksIGZhbHNlKTtcblxuICAgICAgICAgICAgdGhpcy5tYXhIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBlID0+IHRoaXMuc3RhcnRTbGlkZShlLCB7XG4gICAgICAgICAgICAgICAgZ2V0UG9zaXRpb246IHBvc2l0aW9uID0+IHRoaXMuZ2V0TWF4SGFuZGxlUG9zaXRpb24ocG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIGxhYmVsOiB0aGlzLm1heElucHV0XG4gICAgICAgICAgICB9KSwgZmFsc2UpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGUgPT4gdGhpcy5oYW5kbGVNb3ZlKGUpLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgZSA9PiB0aGlzLmhhbmRsZVN0b3AoZSksIGZhbHNlKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCBlID0+IHRoaXMuaGFuZGxlU3RvcChlKSwgZmFsc2UpO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGUgPT4gdGhpcy5oYW5kbGVTdG9wKGUpLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZSA9PiB0aGlzLmhhbmRsZU1vdmUoZSksIGZhbHNlKTtcblxuICAgICAgICB0aGlzLm1pbklucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIGUgPT4gdGhpcy5oYW5kbGVWYWx1ZUlucHV0KGUsIHtcbiAgICAgICAgICAgIGhhbmRsZTogdGhpcy5taW5IYW5kbGUsXG4gICAgICAgICAgICBnZXRQb3NpdGlvbjogcG9zaXRpb24gPT4gdGhpcy5nZXRNaW5IYW5kbGVQb3NpdGlvbihwb3NpdGlvbilcbiAgICAgICAgfSksIGZhbHNlKTtcblxuICAgICAgICB0aGlzLm1heElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIGUgPT4gdGhpcy5oYW5kbGVWYWx1ZUlucHV0KGUsIHtcbiAgICAgICAgICAgIGhhbmRsZTogdGhpcy5tYXhIYW5kbGUsXG4gICAgICAgICAgICBnZXRQb3NpdGlvbjogcG9zaXRpb24gPT4gdGhpcy5nZXRNYXhIYW5kbGVQb3NpdGlvbihwb3NpdGlvbilcbiAgICAgICAgfSksIGZhbHNlKTtcblxuICAgICAgICBpZiAoIWlzTmFOKHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0YXJ0VmFsdWUpKSB7XG4gICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gdGhpcy5jYWxjdWxhdGVIYW5kbGVQb3NpdGlvbih0aGlzLmVsZW1lbnQuZGF0YXNldC5zdGFydFZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gcGVyY2VudGFnZSAvIDEwMCAqIHRoaXMuZWxlbWVudFdpZHRoO1xuICAgICAgICAgICAgdGhpcy5zZXRIYW5kbGVQb3NpdGlvbih0aGlzLm1pbkhhbmRsZSwgdGhpcy5taW5JbnB1dCwgcG9zaXRpb24sIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0YXJ0VmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc05hTih0aGlzLmVsZW1lbnQuZGF0YXNldC5lbmRWYWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSB0aGlzLmNhbGN1bGF0ZUhhbmRsZVBvc2l0aW9uKHRoaXMuZWxlbWVudC5kYXRhc2V0LmVuZFZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gcGVyY2VudGFnZSAvIDEwMCAqIHRoaXMuZWxlbWVudFdpZHRoO1xuICAgICAgICAgICAgdGhpcy5zZXRIYW5kbGVQb3NpdGlvbih0aGlzLm1heEhhbmRsZSwgdGhpcy5tYXhJbnB1dCwgcG9zaXRpb24sIHRoaXMuZWxlbWVudC5kYXRhc2V0LmVuZFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEhhbmRsZU9mZnNldChlKSB7XG4gICAgICAgIGNvbnN0IHBhZ2VYID0gZS50eXBlID09PSBcInRvdWNobW92ZVwiID8gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWCA6IGUucGFnZVg7XG4gICAgICAgIHJldHVybiBwYWdlWCAtIHRoaXMuZWxlbWVudFN0YXJ0IC0gdGhpcy5hY3RpdmVIYW5kbGUub2Zmc2V0ICsgKHRoaXMuYWN0aXZlSGFuZGxlLmVsZW1lbnQub2Zmc2V0V2lkdGggLyAyKTtcbiAgICB9XG5cbiAgICBzdGFydFNsaWRlKGUsIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVIYW5kbGUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiBlLnRhcmdldCxcbiAgICAgICAgICAgIGxhYmVsOiBkYXRhLmxhYmVsLFxuICAgICAgICAgICAgZ2V0UG9zaXRpb246IGRhdGEuZ2V0UG9zaXRpb24sXG4gICAgICAgICAgICBvZmZzZXQ6IGUub2Zmc2V0WCB8fCAwXG4gICAgICAgIH07XG4gICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIilcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGhhbmRsZU1vdmUoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlSGFuZGxlKSB7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSBNYXRoLmNlaWwodGhpcy5nZXRIYW5kbGVPZmZzZXQoZSkpO1xuICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLmFjdGl2ZUhhbmRsZS5nZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuY2FsY3VsYXRlSGFuZGxlVmFsdWUocG9zaXRpb24pO1xuICAgICAgICAgICAgdGhpcy5zZXRIYW5kbGVQb3NpdGlvbih0aGlzLmFjdGl2ZUhhbmRsZS5lbGVtZW50LCB0aGlzLmFjdGl2ZUhhbmRsZS5sYWJlbCwgcG9zaXRpb24sIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZVZhbHVlSW5wdXQoZSwgZGF0YSkge1xuICAgICAgICBjb25zdCBpbnB1dFZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIGlmIChpc05hTihpbnB1dFZhbHVlKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSB0aGlzLmNhbGN1bGF0ZUhhbmRsZVBvc2l0aW9uKGlucHV0VmFsdWUpO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSBNYXRoLmNlaWwocGVyY2VudGFnZSAvIDEwMCAqIHRoaXMuZWxlbWVudFdpZHRoKTtcbiAgICAgICAgcG9zaXRpb24gPSBkYXRhLmdldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmNhbGN1bGF0ZUhhbmRsZVZhbHVlKHBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5zZXRIYW5kbGVQb3NpdGlvbihkYXRhLmhhbmRsZSwgZS50YXJnZXQsIHBvc2l0aW9uLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzZXRIYW5kbGVQb3NpdGlvbihoYW5kbGUsIGxhYmVsLCBwb3NpdGlvbiwgdmFsdWUpIHtcbiAgICAgICAgbGFiZWwudmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICBsYWJlbC5zdHlsZS5sZWZ0ID0gYCR7cG9zaXRpb24gLSBsYWJlbC5vZmZzZXRXaWR0aCAvIDJ9cHhgO1xuICAgICAgICBoYW5kbGUuc3R5bGUubGVmdCA9IGAke3Bvc2l0aW9uIC0gaGFuZGxlLm9mZnNldFdpZHRoIC8gMn1weGA7XG4gICAgICAgIHRoaXMuc2V0QWN0aXZlSW50ZXJ2YWwoKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVIYW5kbGVWYWx1ZShwb3NpdGlvbikge1xuICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gcG9zaXRpb24gLyB0aGlzLmVsZW1lbnRXaWR0aCAqIDEwMDtcbiAgICAgICAgY29uc29sZS5sb2coYCR7cG9zaXRpb259cHg6ICR7cGVyY2VudGFnZX0lYCk7XG4gICAgICAgIGNvbnN0IHJhbmdlU2VjdGlvbiA9IHRoaXMuZ2V0UmFuZ2VTZWN0aW9uQnlQZXJjZW50YWdlKHBlcmNlbnRhZ2UpO1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldFNlY3Rpb25WYWx1ZXMocmFuZ2VTZWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgocGVyY2VudGFnZSAtIHZhbHVlcy5zdGFydFBlcmNlbnRhZ2UpICogKHZhbHVlcy52YWx1ZSAqIHZhbHVlcy5yYXRpbykgLyAxMDAgKyB2YWx1ZXMuc3RhcnRWYWx1ZSk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSGFuZGxlUG9zaXRpb24odmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmFuZ2VTZWN0aW9uID0gdGhpcy5nZXRSYW5nZVNlY3Rpb25CeVZhbHVlKHZhbHVlKTtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5nZXRTZWN0aW9uVmFsdWVzKHJhbmdlU2VjdGlvbik7XG4gICAgICAgIHJldHVybiAodmFsdWUgLSB2YWx1ZXMuc3RhcnRWYWx1ZSkgLyAodmFsdWVzLnZhbHVlICogdmFsdWVzLnJhdGlvKSAqIDEwMCArIHZhbHVlcy5zdGFydFBlcmNlbnRhZ2U7XG4gICAgfVxuXG4gICAgZ2V0U2VjdGlvblZhbHVlcyhyYW5nZVNlY3Rpb24pIHtcbiAgICAgICAgY29uc3Qgc2VjdGlvblZhbHVlcyA9IHtcbiAgICAgICAgICAgIHN0YXJ0VmFsdWU6IHRoaXMucmFuZ2VWYWx1ZXNbcmFuZ2VTZWN0aW9uIC0gMV0sXG4gICAgICAgICAgICBlbmRWYWx1ZTogdGhpcy5yYW5nZVZhbHVlc1tyYW5nZVNlY3Rpb25dLFxuICAgICAgICAgICAgc3RhcnRQZXJjZW50YWdlOiB0aGlzLnJhbmdlUGVyY2VudGFnZXNbcmFuZ2VTZWN0aW9uIC0gMV0sXG4gICAgICAgICAgICBlbmRQZXJjZW50YWdlOiB0aGlzLnJhbmdlUGVyY2VudGFnZXNbcmFuZ2VTZWN0aW9uXSxcbiAgICAgICAgfTtcbiAgICAgICAgc2VjdGlvblZhbHVlcy52YWx1ZSA9IHNlY3Rpb25WYWx1ZXMuZW5kVmFsdWUgLSBzZWN0aW9uVmFsdWVzLnN0YXJ0VmFsdWU7XG4gICAgICAgIHNlY3Rpb25WYWx1ZXMucGVyY2VudGFnZSA9IHNlY3Rpb25WYWx1ZXMuZW5kUGVyY2VudGFnZSAtIHNlY3Rpb25WYWx1ZXMuc3RhcnRQZXJjZW50YWdlO1xuICAgICAgICBzZWN0aW9uVmFsdWVzLnJhdGlvID0gMTAwIC8gc2VjdGlvblZhbHVlcy5wZXJjZW50YWdlO1xuXG4gICAgICAgIHJldHVybiBzZWN0aW9uVmFsdWVzO1xuICAgIH1cblxuICAgIGdldFJhbmdlU2VjdGlvbkJ5UGVyY2VudGFnZShwZXJjZW50YWdlKSB7XG4gICAgICAgIGxldCBzZWN0aW9uID0gMTtcbiAgICAgICAgd2hpbGUgKHBlcmNlbnRhZ2UgPiB0aGlzLnJhbmdlUGVyY2VudGFnZXNbc2VjdGlvbl0pIHtcbiAgICAgICAgICAgIHNlY3Rpb24rKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VjdGlvbjtcbiAgICB9XG5cbiAgICBnZXRSYW5nZVNlY3Rpb25CeVZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGxldCBzZWN0aW9uID0gMTtcbiAgICAgICAgd2hpbGUgKHZhbHVlID4gdGhpcy5yYW5nZVZhbHVlc1tzZWN0aW9uXSkge1xuICAgICAgICAgICAgc2VjdGlvbisrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWN0aW9uO1xuICAgIH1cblxuICAgIGdldE1pbkhhbmRsZVBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgaWYgKChwb3NpdGlvbiArIHRoaXMubWluSGFuZGxlLm9mZnNldFdpZHRoIC8gMikgPiB0aGlzLm1heEhhbmRsZS5vZmZzZXRMZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLm1pbkhhbmRsZS5zdHlsZS56SW5kZXggPSA1O1xuICAgICAgICAgICAgdGhpcy5tYXhIYW5kbGUuc3R5bGUuekluZGV4ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zaXRpb24gPiAodGhpcy5tYXhIYW5kbGUub2Zmc2V0TGVmdCArIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoIC8gMikpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXhIYW5kbGUub2Zmc2V0TGVmdCArIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoIC8gMjtcbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgIH1cblxuICAgIGdldE1heEhhbmRsZVBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICAgIGlmICgocG9zaXRpb24gLSB0aGlzLm1heEhhbmRsZS5vZmZzZXRXaWR0aCAvIDIpIDwgKHRoaXMubWluSGFuZGxlLm9mZnNldExlZnQgKyB0aGlzLm1heEhhbmRsZS5vZmZzZXRXaWR0aCkpIHtcbiAgICAgICAgICAgIHRoaXMubWF4SGFuZGxlLnN0eWxlLnpJbmRleCA9IDU7XG4gICAgICAgICAgICB0aGlzLm1pbkhhbmRsZS5zdHlsZS56SW5kZXggPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NpdGlvbiAtIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoIC8gMiA8IHRoaXMubWluSGFuZGxlLm9mZnNldExlZnQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5taW5IYW5kbGUub2Zmc2V0TGVmdCArIHRoaXMubWF4SGFuZGxlLm9mZnNldFdpZHRoIC8gMjtcbiAgICAgICAgaWYgKHBvc2l0aW9uID4gdGhpcy5lbGVtZW50V2lkdGgpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50V2lkdGg7XG4gICAgICAgIHJldHVybiBwb3NpdGlvbjtcbiAgICB9XG5cbiAgICBzZXRBY3RpdmVJbnRlcnZhbCgpIHtcbiAgICAgICAgdGhpcy5pbnRlcnZhbFRyYWNrLnN0eWxlLmxlZnQgPSBgJHt0aGlzLm1pbkhhbmRsZS5vZmZzZXRMZWZ0ICsgdGhpcy5tYXhIYW5kbGUub2Zmc2V0V2lkdGggLyAyfXB4YDtcbiAgICAgICAgdGhpcy5pbnRlcnZhbFRyYWNrLnN0eWxlLnJpZ2h0ID0gYCR7dGhpcy5lbGVtZW50V2lkdGggLSB0aGlzLm1heEhhbmRsZS5vZmZzZXRMZWZ0fXB4YDtcbiAgICB9XG5cbiAgICBoYW5kbGVTdG9wKCkge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlSGFuZGxlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLmFjdGl2ZUhhbmRsZS5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICAgIHRoaXMuYWN0aXZlSGFuZGxlID0gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRMZWZ0UG9zaXRpb24oZWxlbWVudCkge1xuICAgICAgICBsZXQgbGVmdCA9IDA7XG4gICAgICAgIHdoaWxlIChlbGVtZW50Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgbGVmdCArPSBlbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgbGVmdCArPSBlbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFuZ2VTbGlkZXI7XG4iXX0=
