jQuery Starbox clone
--------------
This is an implementation of rating stars on top of jQuery. It follows the philosophy of the Prototype/Scriptaculous Starbox plugin but is not quite as sophisticated. It does not currently work well on IE 6!

But there are some great things about it: it is quite small, does not produce massive amounts of inline styles and is mostly compatible with existing css for the Prototype Starbox. [Just try it](http://sabberworm.github.com/jStarbox/)!

## Usage
Have an empty element ready. Include the js and css files and you’re good to go:

	$(element).starbox({
		average: 0.42,
		changeable: 'once',
		autoUpdateAverage: true,
		ghosting: true
	});


## Theming

Have your own css file included after the jstarbox.css file and override the following styles:

	/* Image(s) */
	.starbox .stars .star_holder .star {
		background-image: url('../path/to/jstarbox/images/5-small.png'); /* or any other image */
		width: 17px; /* make sure to use your image’s dimensions here */
		height: 17px;
	}
	
	/* Colours */
	.starbox .stars { background: #cccccc; }
	.starbox .rated .stars { background: #dcdcdc; }
	.starbox .rated.hover .stars { background: #cccccc; }
	.starbox .colorbar { background: #1e90ff; }
	.starbox .hover .colorbar { background: #ffcc1c; }
	.starbox .rated .colorbar { background: #64b2ff; }
	.starbox .rated.hover .colorbar { background: #1e90ff; }
	.starbox .ghost { background: #a1a1a1; }

jStarbox will also assign a class “`star-#`” (starting at 0) to each star used so you can use this to assign different images to the individual stars.

## Config

The value always ranges from `0.0` to `1.0`.

There are several configuration options:

### average (float 0…1)
The option “average” sets the initial/fixed value of the jStarbox. It is called “average” because that’s what the original Starbox calls it. It represents the “stuck” value of the Starbox; the one the stars return to when stopped hovering.  
Default: `0.5`

### stars (unsigned integer)
This sets how many stars will be shown.  
Default: `5`

### buttons (unsigned integer | false)
This sets how many clickable areas there will be. It is usually the same as the number of stars or double that (half-star ratings). You can also set this to false to allow any value between 0 and 1 as a rating.  
Default: `5`

### ghosting (boolean)
Whether to show a ghost of “average” value when hovering.  
Default: `false`

### changeable (boolean | string)
Whether the user is allowed to hover over the rating and change it. Can also be set to `"once"` to deny rating after the first time. Note that this will only actually change the value if it’s returned from the starbox-value-changed event handler or if “autoUpdateAverage” is true.  
Default: `true`

### autoUpdateAverage (boolean)
Whether to automatically update the “average” with the new value after the user is done rating without the need for the starbox-value-changed event.  
Default: `false`

## Methods
Methods can be called using `jQuery(element).starbox("methodName", arguments…)`.

### destroy()
Clears the element that was used to create the starbox and removes all used event handlers.

### getValue()
Returns the currently displayed value. Note that this is *not* always the current average: when hovering over the element, the current value can be different. To get the current “average”, use `.starbox("getOption", "average")`.

### setValue(value)
Sets the current value (see above). Can be useful for animation/display/show purposes. Use `.starbox("setOption", "average", value)` to set the current average.

### getOption(name)
Returns an option of the options hash. Can also be used to get the current “stuck” value, the current average.

### setOption(name, value)
Can be used to set options after initialisation. All configuration options can be re-set after initialisation.

### markAsRated()
This will add the rated class so that this starbox will appear as rated. The rated class is added automatically when using autoUpdateAverage.

## Events
Add event handlers using `jQuery(element).bind('event-name', function(event, value) {…})`.

### starbox-value-changed
The “`starbox-value-changed`” event is fired after the user has clicked to rate. The handler is given the rated value as the first parameter after the event. Return a value here to set it as the new average.

This handler is a great choice to make an Ajax call. Note however, that most Ajax calls are asynchronous so you won’t be able to use the result directly to return from the handler. You can, however, set a new average later:

	element.starbox({
		average: 0.33,
		changeable: 'once'
	}).bind('starbox-value-changed', function(event, value) {
		jQuery.getJSON('/my/action', {rating: value}, function(data) {
			if(!data.error) {
				element.starbox('setOption', 'average', data.result);
			}
		});
	});

### starbox-value-moved
Is triggered whenever the user has moved the mouse cursor. This does not always represent a change in the visible value though this behaviour might change in the future.

## Curiousities

### License
jStarbox is freely distributable under the terms of an MIT-style license.

### Rounding
There is no rounding of the initial average. If you want a nice full-star (or half-star) value, round it yourself first (you know how to do that!).

### Images
The philosophy follows that of the original Starbox which means it uses semi-transparent images under whose it displays bars with the same height and an arbitrary length (representing the rating). These bars are relatively easily stylable using background colors (or even images). The only drawback (I can think of) is that Starboxes don’t work on non-unicolor backgrounds (at least not if you don’t exactly know which part of the background they’re going to land on) and require new images for non-white unicolor backgrounds.
