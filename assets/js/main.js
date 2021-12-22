(function($) {
	var $window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Breakpoints.
	breakpoints({
		xlarge : [ '1281px', '1680px' ],
		large  : [ '981px', '1280px' ],
		medium : [ '737px', '980px' ],
		small  : [ '481px', '736px' ],
		xsmall : [ null, '480px' ]
	});

	// Hack: Enable IE flexbox workarounds.
	if (browser.name == 'ie') $body.addClass('is-ie');

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Forms.

	// Hack: Activate non-input submits.
	$('form').on('click', '.submit', function(event) {
		// Stop propagation, default.
		event.stopPropagation();
		event.preventDefault();

		// Submit form.
		$(this).parents('form').submit();
	});

	// Sidebar.
	if ($sidebar.length > 0) {
		var $sidebar_a = $sidebar.find('a');

		var previousSubsection;
		var previousSection = $('[href="#intro"]');

		$sidebar_a
			.addClass('scrolly')
			.on('click', function() {
				var $this = $(this);

				// External link? Bail.
				if ($this.attr('href').charAt(0) != '#') return;

				// Deactivate all links.
				if ($this.closest('.subsection').length === 0) {
					$sidebar_a.removeClass('active');
					previousSection = $this;
				} else {
					if (previousSubsection) {
						previousSubsection.removeClass('active');
					}
					const currentSection = $this.closest("ul").prev();
					if (currentSection !== previousSection) { // check if we are in the same section, if not redisplay active
						previousSection.removeClass("active");
						currentSection.addClass("active");
					}
					previousSection = currentSection;
					previousSubsection = $this;
				}
				// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
				$this.addClass('active').addClass('active-locked');
			})
			.each(function() {
				var $this = $(this),
					id = $this.attr('href'),
					$section = $(id);

				// No section for this link? Bail.
				if ($section.length < 1) return;

				// Scrollex.
				$section.scrollex({
					mode       : 'middle',
					top        : '-20vh',
					bottom     : '-20vh',
					initialize : function() {
						// Deactivate section.
						$section.addClass('inactive');
					},
					enter      : function() {
						// Activate section.
						$section.removeClass('inactive');

						// No locked links? Deactivate all links and activate this section's one.
						
						if ($sidebar_a.filter('.active-locked').length == 0) {
							previousSection = $this;
							if ($this.closest('.subsection').length === 0) { // Check that we're not in a subsection
								// we either scrolled into a new section or scrolled out of a subsection into just the sction
								$sidebar_a.removeClass('active');
							} else {
								previousSection = $this.closest("ul").prev();
								if (previousSubsection) {
									previousSubsection.removeClass('active');
								}
								previousSubsection = $this;
							}
							$this.addClass('active');
							
						} else // if ($this.hasClass('active-locked'))
							// Otherwise, if this section's link is the one that's locked, unlock it.
							$this.removeClass('active-locked');
					}
				});
			});
	}

	// Scrolly.
	$('.scrolly').scrolly({
		speed  : 1000,
		offset : function() {
			// If <=large, >small, and sidebar is present, use its height as the offset.
			if (breakpoints.active('<=large') && !breakpoints.active('<=small') && $sidebar.length > 0)
				return $sidebar.height();

			return 0;
		}
	});

	// Spotlights.
	$('.spotlights > section')
		.scrollex({
			mode       : 'middle',
			top        : '-10vh',
			bottom     : '-10vh',
			initialize : function() {
				// Deactivate section.
				$(this).addClass('inactive');
			},
			enter      : function() {
				// Activate section.
				$(this).removeClass('inactive');
			}
		})
		.each(function() {
			var $this = $(this),
				$image = $this.find('.image'),
				$img = $image.find('img'),
				x;

			// Assign image.
			// $image.css('background-image', 'url(' + $img.attr('src') + ')');

			// Set background position.
			if ((x = $img.data('position'))) $image.css('background-position', x);

			// Hide <img>.
			$img.hide();
		});

	// Features.
	$('.features').scrollex({
		mode       : 'middle',
		top        : '-20vh',
		bottom     : '-20vh',
		initialize : function() {
			// Deactivate section.
			$(this).addClass('inactive');
		},
		enter      : function() {
			// Activate section.
			$(this).removeClass('inactive');
		}
	});
})(jQuery);
