(function() {
	var dataKey = 'jstarbox-data';
	var eventNamespace = '.jstarbox';
	var methods = {
		destroy: function() {
			this.removeData(dataKey);
			this.unbind(eventNamespace).find('*').unbind(eventNamespace);
			this.removeClass('starbox');
			this.empty();
		},
		
		setValue: function(val) {
			var data = this.data(dataKey);
			var size = arguments[1] || data.positioner.width();
			var include_ghost = arguments[2];
			if(include_ghost) {
				data.ghost.css({width: ""+(val*size)+"px"});
			}
			data.colorbar.css({width: ""+(val*size)+"px"});
			data.opts.currentValue = val;
		},
		
		setOption: function(option, value) {
			var data = this.data(dataKey);
			// FIXME: deny option changes for unchangeable options
			data.opts[option] = value;
			
			if(option === 'stars') {
				data.methods.update_stars();
			} else if(option === 'average') {
				this.starbox('setValue', value, null, true);
			}
		}
	};
	jQuery.fn.extend({
		starbox: function(options) {
			if(options.constructor === String && methods[options]) {
				methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
				return this;
			}
			options = jQuery.extend({
				stars: 5,
				buttons: 5,
				average: 0.5,
				ghosting: false,
				changeable: true,
				autoUpdateValue: false
			}, options);
			this.each(function(count) {
				var element = jQuery(this);
				
				var opts = jQuery.extend({}, options);
				var data = {
					opts: opts,
					methods: {}
				};
				element.data(dataKey, data);
				
				var positioner = data.positioner = jQuery('<div/>').addClass('positioner');
				
				var stars = data.stars = jQuery('<div/>').addClass('stars').appendTo(positioner);
				var ghost = data.ghost = jQuery('<div/>').addClass('ghost').hide().appendTo(stars);
				var colorbar = data.colorbar = jQuery('<div/>').addClass('colorbar').appendTo(stars);
				var star_holder = data.star_holder = jQuery('<div/>').addClass('star_holder').appendTo(stars);
				
				element.empty().addClass('starbox').append(positioner);
				data.methods.update_stars = function() {
					star_holder.empty();
					for(var i=0;i<opts.stars;i++) {
						var star = jQuery('<div/>').addClass('star').addClass('star-'+i).appendTo(star_holder);
					}
				};
				data.methods.update_stars();

				positioner.bind('mousemove'+eventNamespace, function(event) {
					if(!opts.changeable) return;
					if(opts.ghosting) {
						ghost.show();
					}
					var size = positioner.width();
					var val = event.layerX/size;
					if(opts.buttons) {
						val *= opts.buttons;
						val = Math.floor(val);
						val += 1;
						val /= opts.buttons;
					}
					positioner.addClass('hover');
					methods.setValue.call(element, val, size);
					element.starbox('setValue', val, size);
				});
				
				positioner.bind('mouseleave'+eventNamespace, function(event) {
					if(!opts.changeable) return;
					ghost.hide();
					positioner.removeClass('hover');
					methods.setValue.call(element, opts.average);
				});
				// Set initial value
				methods.setOption.call(element, 'average', opts.average);
				
				positioner.bind('click'+eventNamespace, function(event) {
					if(!opts.changeable) return;
					if(opts.autoUpdateValue) {
						positioner.addClass('rated');
						methods.setOption.call(element, 'average', opts.currentValue);
					}
					var new_average = element.triggerHandler('jstarbox-value-changed', opts.currentValue);
					if(!isNaN(parseFloat(new_average)) && isFinite(new_average)) {
						methods.setOption.call(element, 'average', new_average);
					}
				});
				
			});
			return this;
		}
	});
})();