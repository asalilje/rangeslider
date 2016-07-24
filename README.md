# rangeslider
A slider component for setting a range of numbers

A UI component as an alternative to using input type=range. This component is possible to style any which way, marks the active range, provides input fields to make it possible to input the wanted number instead of using the range slider. Values can bet set linear or by specifying values and the percentages where the value is reached.

The range slider is configured using data attributes.  

<h3>Linear slider</h3>
<ul>
<li>data-slider-values="0,100": values of the range, in this case the range starts on 0 and ends on 100.</li>
<li>data-slider-percentages="0,100": percentages representing the values. In this case the value 0 is at 0% of the range, the value 100 is at 100%.</li>
<li>data-start-value="10": the initial value of the start handle</li>
<li>data-end-value="90": the initial value of the end handle</li>
</ul>
<h3>Non linear slider</h3>
To make the sliders values non linear, provide additional values and percentages:
data-slider-values="0,10,100" and data-slider-percentages="0,50,100" means the values 0 - 10 will use 50% of the range and the values 10 - 100 will use the remaining 50%.
