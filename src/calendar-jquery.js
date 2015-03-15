/*
 * Created with Sublime Text 2.
 * User: 田想兵
 * Date: 2015-03-15
 * Time: 18:29:43
 * Contact: 55342775@qq.com
 */
(function($) {
	$.fn.Calendar = function(settings) {
		var list = [];
		$(this).each(function(){
			var calendar = new Calendar();
			var options = $.extend({target :$(this)},settings);
			calendar.init(options);
		});
		return list;
	}
})(jQuery);