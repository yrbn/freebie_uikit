
/* SLIDER 1 */

var slider1 = function () {
    var rng1 = document.querySelector('#my-slider-1'),
        value = rng1.value,
        sliderValue = document.querySelector('.js-slider-1__value');

        sliderValue.style.left = (value * 0.945) + '%';
        sliderValue.innerHTML = rng1.value;
}


/* SLIDER 2 */

var RangeSlider = function(id) { 
  var self = this,
      startX = 0, 
      x = 0;

  // retrieve touch button
  var slider     = document.getElementById(id),
      touchLeft  = slider.querySelector('.js-slider2__left-thumb'),
      touchRight = slider.querySelector('.js-slider2__right-thumb'),
      lineSpan   = slider.querySelector('.js-slider2__line span');
      
  
  var min   = parseInt(slider.getAttribute('se-min')),
      max   = parseInt(slider.getAttribute('se-max'));
  
  var step  = 0.0;
  
  if (slider.getAttribute('se-step')) {
    step  = Math.abs(parseInt(slider.getAttribute('se-step')));
  }

  self.slider = slider;
  self.reset = function() {
    touchLeft.style.left = '0px';
    touchRight.style.left = (slider.offsetWidth - touchLeft.offsetWidth) + 'px';
    lineSpan.style.marginLeft = '7px';
    lineSpan.style.width = (slider.offsetWidth - touchLeft.offsetWidth - 14) + 'px';
    startX = 0;
    x = 0;
    slider.setAttribute('se-min-value', min);
    slider.setAttribute('se-max-value', max);
  };
  
  // initial reset
  self.reset();
  
  var normalizeFact = 12;
  var maxX = slider.offsetWidth - touchRight.offsetWidth;
  var selectedTouch = null;
  var initialValue = (lineSpan.offsetWidth - normalizeFact);

  // setup touch/click events
  function onStart(event) {
    
    // Prevent default dragging of selected content
    event.preventDefault();
    var eventTouch = event;

    if (event.touches) {
      eventTouch = event.touches[0];
    }
    
    if(this === touchLeft) {
      x = touchLeft.offsetLeft;
    } else {
      x = touchRight.offsetLeft;
    }

    startX = eventTouch.pageX - x;
    selectedTouch = this;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onStop);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onStop);
    
  }
  
  function onMove(event) {
    var eventTouch = event;

    if (event.touches) {
      eventTouch = event.touches[0];
    }

    x = eventTouch.pageX - startX;
    
    if (selectedTouch === touchLeft) {
      if(x > (touchRight.offsetLeft - selectedTouch.offsetWidth + 10)) {
        x = (touchRight.offsetLeft - selectedTouch.offsetWidth + 10)
      } else if(x < 0) {
        x = 0;
      }
      
      selectedTouch.style.left = x + 'px';
    } else if (selectedTouch === touchRight) {
      if(x < (touchLeft.offsetLeft + touchLeft.offsetWidth - 10)) {
        x = (touchLeft.offsetLeft + touchLeft.offsetWidth - 10)
      } else if(x > maxX) {
        x = maxX;
      }
      selectedTouch.style.left = x + 'px';
    }
    
    // update line span
    lineSpan.style.marginLeft = touchLeft.offsetLeft + 7 + 'px';
    lineSpan.style.width = (touchRight.offsetLeft - touchLeft.offsetLeft - 14) + 'px';
    
    // write new value
    calculateValue();
    
    // call on change
    if(slider.getAttribute('on-change')) {
      var fn = new Function('min, max', slider.getAttribute('on-change'));
      fn(slider.getAttribute('se-min-value'), slider.getAttribute('se-max-value'));
    }
    
    if(self.onChange) {
      self.onChange(slider.getAttribute('se-min-value'), slider.getAttribute('se-max-value'));
    }
    
  }
  
  function onStop(event) {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onStop);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onStop);
    
    selectedTouch = null;

    // write new value
    calculateValue();
    
    // call did changed
    if(slider.getAttribute('did-changed')) {
      var fn = new Function('min, max', slider.getAttribute('did-changed'));
      fn(slider.getAttribute('se-min-value'), slider.getAttribute('se-max-value'));
    }
    
    if(self.didChanged) {
      self.didChanged(slider.getAttribute('se-min-value'), slider.getAttribute('se-max-value'));
    }
  }
  
  function calculateValue() {
    var newValue = (lineSpan.offsetWidth - normalizeFact) / initialValue;
    var minValue = lineSpan.offsetLeft / initialValue;
    var maxValue = minValue + newValue;

    var minValue = minValue * (max - min) + min - 2;
    var maxValue = maxValue * (max - min) + min - 2;
    
    if (step !== 0.0) {
      var multi = Math.floor((minValue / step));
      minValue = step * multi;
      
      multi = Math.floor((maxValue / step));
      maxValue = step * multi;
    }
    
    slider.setAttribute('se-min-value', minValue);
    slider.setAttribute('se-max-value', maxValue);
  }
  
  // link events
  touchLeft.addEventListener('mousedown', onStart);
  touchRight.addEventListener('mousedown', onStart);
  touchLeft.addEventListener('touchstart', onStart);
  touchRight.addEventListener('touchstart', onStart);
  
};

var newRangeSlider2 = new RangeSlider('my-slider-2');







