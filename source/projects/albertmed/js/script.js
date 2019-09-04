//counters://

(function ($) {
	$.fn.countTo = function (options) {
		options = options || {};

		return $(this).each(function () {
			// set options for current element
			var settings = $.extend({}, $.fn.countTo.defaults, {
				from:            $(this).data('from'),
				to:              $(this).data('to'),
				speed:           $(this).data('speed'),
				refreshInterval: $(this).data('refresh-interval'),
				decimals:        $(this).data('decimals')
			}, options);

			// how many times to update the value, and how much to increment the value on each update
			var loops = Math.ceil(settings.speed / settings.refreshInterval),
				increment = (settings.to - settings.from) / loops;

			// references & variables that will change with each update
			var self = this,
				$self = $(this),
				loopCount = 0,
				value = settings.from,
				data = $self.data('countTo') || {};

			$self.data('countTo', data);

			// if an existing interval can be found, clear it first
			if (data.interval) {
				clearInterval(data.interval);
			}
			data.interval = setInterval(updateTimer, settings.refreshInterval);

			// initialize the element with the starting value
			render(value);

			function updateTimer() {
				value += increment;
				loopCount++;

				render(value);
				if (typeof(settings.onUpdate) == 'function') {
					settings.onUpdate.call(self, value);
				}

				if (loopCount >= loops) {
					// remove the interval
					$self.removeData('countTo');
					clearInterval(data.interval);
					value = settings.to;

					if (typeof(settings.onComplete) == 'function') {
						settings.onComplete.call(self, value);
					}
				}
			}

			function render(value) {
				var formattedValue = settings.formatter.call(self, value, settings);
				$self.html(formattedValue);
			}
		});
	};

	$.fn.countTo.defaults = {
		from: 0,               // the number the element should start at
		to: 0,                 // the number the element should end at
		speed: 1000,           // how long it should take to count between the target numbers
		refreshInterval: 10,  // how often the element should be updated
		decimals: 0,           // the number of decimal places to show
		formatter: formatter,  // handler for formatting the value before rendering
		onUpdate: null,        // callback method for every time the element is updated
		onComplete: null       // callback method for when the element finishes updating
	};

	function formatter(value, settings) {
		return value.toFixed(settings.decimals);
	}
}(jQuery));

jQuery(function ($) {
  // custom formatting example
  $('.counter-number').data('countToOptions', {
	formatter: function (value, options) {
	  return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
	}
  });

  // start all the timers
  $('.timer').each(count);

  function count(options) {
		var $this = $(this);
		options = $.extend({}, options || {}, $this.data('countToOptions') || {});
		$this.countTo(options);
  }
});

//counters lazyload://

var counters = document.getElementById('counters');

if (counters) {
	function isScrolledIntoView(counters) {
	  var countersTop = counters.getBoundingClientRect().top;
	  var countersBottom = counters.getBoundingClientRect().bottom;
	  var isVisible = (countersTop >= 0) && (countersBottom <= window.innerHeight);

	  return isVisible;
	};

	$(window).on('scroll', function() {
	  if (isScrolledIntoView(counters)) {
	    $('.counter-number').countTo();

	    // Unbind scroll event
	    $(window).off('scroll');
	  }
	});
};

//map://
var mapInteractive = document.querySelector('.yandex-map');
if (mapInteractive) {
  ymaps.ready(function () {
      var myMap = new ymaps.Map('yandex-map-script', {
              center: [67.551809, 133.388456],
              zoom: 17
          }, {
              searchControlProvider: 'yandex#search'
          }),

          MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
              '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
          ),

          myPlacemarkWithContent = new ymaps.Placemark([67.551809, 133.388456], {
              hintContent: 'Клиника «АльбертМед»',
              balloonContent: 'Клиника «АльбертМед»',
          }, {
              iconLayout: 'default#imageWithContent',
              iconImageSize: [42, 48],
              iconImageOffset: [-12, -48],
              iconContentOffset: [15, 15],
              iconContentLayout: MyIconContentLayout
          });

      myMap.geoObjects
          .add(myPlacemarkWithContent);
  });
};

//chained selects://

;(function($, window, document, undefined) {
  'use strict';

  $.fn.chained = function(parentSelector) {
    return this.each(function() {

      /* Save this to child because this changes when scope changes. */
      var child   = this;
      var backup = $(child).clone();

      /* Handles maximum two parents now. */
      $(parentSelector).each(function() {
      	$(this).bind('change', function() {
          updateChildren();
        });

        /* Force IE to see something selected on first page load, */
        /* unless something is already selected */
        if (!$('option:selected', this).length) {
          $('option', this).first().attr('selected', 'selected');
        }

        /* Force updating the children. */
        updateChildren();
      });

      function updateChildren() {
        var triggerChange = true;
        var currentlySelectedValue = $('option:selected', child).val();

        $(child).html(backup.html());

        /* If multiple parents build value like foo+bar. */
        var selected = '';
        $(parentSelector).each(function() {
          var selectedValue = $('option:selected', this).val();
          if (selectedValue) {
            if (selected.length > 0) {
              selected += '+';
            }
            selected += selectedValue;
          }
        });

        /* Also check for first parent without subclassing. */
        /* TODO: This should be dynamic and check for each parent */
        /*       without subclassing. */
        var first;
        if ($.isArray(parentSelector)) {
          first = $(parentSelector[0]).first();
        } else {
          first = $(parentSelector).first();
        }
        var selectedFirst = $('option:selected', first).val();

        $('option', child).each(function() {
        /* Always leave the default value in place. */
          if ($(this).val() === '') {
              return;
          }
          var matches = [];
          var data = $(this).data('chained');
          if (data) {
              matches = data.split(' ');
          }
          if ((matches.indexOf(selected) > -1) || (matches.indexOf(selectedFirst) > -1)) {
            if ($(this).val() === currentlySelectedValue) {
              $(this).prop('selected', true);
              triggerChange = false;
            }
          } else {
            $(this).remove();
          }
        });

        /* If we have only the default value disable select. */
        if (1 === $('option', child).length && $(child).val() === '') {
          $(child).prop('disabled', true);
        } else {
          $(child).prop('disabled', false);
        }
        if (triggerChange) {
          $(child).trigger('change');
        }
      }
    });
  };

  $('#doctor').chained('#department');
	$('#doctor-inner').chained('#department-inner');

})(window.jQuery || window.Zepto, window, document);

//input masks://

jQuery(function($){
	$(".form-phone").mask('+7 (999) 999-99-99');
  $(".form-date").mask('99.99.9999');
	$.mask.definitions['H'] = "[1-2]";
	$.mask.definitions['h'] = "[0-9]";
	$.mask.definitions['M'] = "[0-5]";
	$.mask.definitions['m'] = "[0-9]";
	$(".form-time").mask('Hh:Mm');
});


//
var form = $('.appointment-form');
var modal = $('#modalAppointment');

form.submit(function(event) {
  event.preventDefault();
	modal.modal('hide');
  $('.alert-success').fadeIn(400);
	setTimeout(function () {
			$('.alert-success').fadeOut(800);
	}, 2800)
});
