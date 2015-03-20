/*
 * Created with Sublime Text 2.
 * User: 田想兵
 * Date: 2015-03-09
 * Time: 17:02:02
 * Contact: 55342775@qq.com
 */
function Calendar() {
	this.monthArr = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
	this.dayArr = ['日', '一', '二', '三', '四', '五', '六'];
	var rnd = Math.random().toString().replace('.', '');
	this.id = 'calendar_' + rnd;
	this.calendarContainer;
	this.settings = {};
	this.isShow = false;
	this.autohide = true;
	this.toolbarTpl = '<div class="ui-calendar-toolbar clearfix"><a class="js-calendar-submit">确定</a><a class="js-clear">清空</a><a class="ui-calendar-close">关闭</a></div>';
	this.dateArr = [];
	this.maxDays = 9999;
};
Calendar.prototype = {
	separator: '-',
	defaultDate: new Date(),
	setRange: function(range) {
		this.range = $.extend([null, null], range);
	},
	init: function(settings) {
		$('body').append('<div class="ui-calendar clearfix" id="' + this.id + '"><div class="ui-calendar-pannel clearfix" data-role="pannel"><span class="ui-calendar-control" data-role="prev-year">&lt;&lt;</span><span class="ui-calendar-control" data-role="prev-month">&lt;</span><span class="ui-calendar-control month" data-role="current-month"></span><span class="ui-calendar-control year" data-role="current-year"></span><span class="ui-calendar-control" data-role="next-month">&gt;</span><span class="ui-calendar-control" data-role="next-year">&gt;&gt;</span></div><div class="calendar-header clearfix"></div><div class="c_days clearfix"></div></div>');
		this.calendarContainer = $('#' + this.id);
		var _this = this;
		this.settings = $.extend({}, this.settings, settings);
		this.maxDays = this.settings.maxdays || this.maxDays;
		if (this.settings.target && $(this.settings.target).size()) {
			if ($(this.settings.target)[0].nodeType === 1) {
				this.settings.focusDate = this.settings.focusDate || $(this.settings.target).val();
			} else {
				this.settings.focusDate = this.settings.focusDate || $(this.settings.target).prev().val() || '';
			}
		}
		if (this.settings.focusDate && !this.settings.multiple) {
			var focusDateArr = this.settings.focusDate.split(this.separator);
			this.defaultDate = new Date(focusDateArr[0], parseInt(focusDateArr[1]) - 1, focusDateArr[2]);
		}
		if (this.settings.focusDate && this.settings.multiple) {
			var arr = this.settings.focusDate.split(',');
			for (var i = arr.length - 1; i >= 0; i--) {
				var item = arr[i];
				var focusDateArr = item.split(this.separator);
				this.dateArr.push(new Date(focusDateArr[0], parseInt(focusDateArr[1]) - 1, focusDateArr[2]));
			};
			this.defaultDate = this.dateArr[0];
			if (!_this._dateInArr(_this.defaultDate, _this.dateArr)) {
				_this.dateArr.push(_this.date);
			}
		}
		if (this.settings.multiple) {
			this.settings.toolbar = true;
		}
		if (this.settings.toolbar) {
			this.autohide = false;
		}
		var zIndex = this.settings.zIndex || 1;
		this.calendarContainer.css('zIndex', zIndex);
		this.date = this.defaultDate;
		this.setRange(this.settings.range);
		this.showToolbar();
		this.formatDate();
		this.renderHeader();
		this.bindEvent();
		if (this.settings.target) {
			this.hide();
		} else {
			this.autohide = false;
			this.show();
		}
	},
	showToolbar: function() {
		if (this.settings.toolbar) {
			this.calendarContainer.append(this.toolbarTpl);
		}
	},
	show: function() {
		this.calendarContainer.show();
		this.isShow = true;
		this.setPosition();
		this.settings.show && this.settings.show(this.calendarContainer);
	},
	hide: function() {
		this.calendarContainer.hide();
		this.isShow = false;
		this.settings.hide && this.settings.hide(this.calendarContainer);
	},
	setPosition: function() {
		var x = 0,
			y = 0;
		if (this.settings.target && $(this.settings.target).size()) {
			if ($(this.settings.target)[0].nodeType === 1) {
				y = $(this.settings.target).offset().top + $(this.settings.target).outerHeight();
				x = $(this.settings.target).offset().left;
			} else {
				y = $(this.settings.target).prev().offset().top + $(this.settings.target).prev().outerHeight();
				x = $(this.settings.target).prev().offset().left;
			}
			this.calendarContainer.css({
				top: y,
				left: x
			});
		}
	},
	bindEvent: function() {
		var _this = this;
		$('.ui-calendar-control[data-role]', _this.calendarContainer).click(function() {
			_this.go[$(this).data('role')].call(_this);
			return false;
		})
		$(_this.calendarContainer).click(function() {
			return false;
		});
		$('.c_days', _this.calendarContainer).delegate('li', 'click', function() {
			_this.settings.beforeSelect && _this.settings.beforeSelect(_this.date, _this.calendarContainer);
			if ($(this).hasClass('disabled')) {
				return false;
			};
			var value = $(this).data('value');
			var focusDateArr = value.split(_this.separator);
			_this.defaultDate = new Date(focusDateArr[0], parseInt(focusDateArr[1]) - 1, focusDateArr[2]);
			_this.date = _this.defaultDate;
			if (_this.settings.multiple) {
				if (!$(this).hasClass('focus')) {
					if (_this.maxDays <= _this.dateArr.length) {
						//alert('添加已达上限 ' + _this.maxDays + ' 天');
						_this.settings.overdays && _this.settings.overdays(_this.maxDays,_this.dateArr, _this.calendarContainer);
						return false;
					}
					_this.dateArr.push(_this.defaultDate);
				} else {
					_this._removeDate(_this.defaultDate, _this.dateArr);
				}
			} else {
				_this.dateArr = [_this.date];
			}
			_this.formatDate();
			_this.renderHeader();
			_this.settings.selected && _this.settings.selected(_this.date, _this.calendarContainer);
			if (_this.settings.target && $(_this.settings.target).size() && $(_this.settings.target)[0].nodeType === 1 && _this.autohide) {
				$(_this.settings.target).val(value);
				_this.hide();
			}
			return false;
		});
		$('.ui-calendar-toolbar', _this.calendarContainer).delegate('a', 'click', function() {
			if ($(this).hasClass('js-calendar-submit')) {
				_this.settings.selected && _this.settings.selected(_this.dateArr, _this.calendarContainer);
				var arr = _this._toString(_this.dateArr);
				value = arr.join(',');
				$(_this.settings.target).val(value);
				_this.hide();
			}
			if($(this).hasClass('ui-calendar-close')){
				_this.hide();
			}
			if($(this).hasClass('js-clear')){
				_this.dateArr =[];
				$(_this.settings.target).val('');
				_this.formatDate();
			}
		});
		if (_this.settings.target) {
			$(_this.settings.target).bind('click', function() {
				$(document).trigger('click');
				_this.show();
				return false;
			});
			$(document).click(function() {
				_this.isShow && _this.hide()
			})
		}
	},
	go: {
		'next-month': function() {
			this.month += 1;
			this._getDate();
			this.formatDate();
			this.renderHeader();
		},
		'prev-month': function() {
			this.month -= 1;
			this.changeDate();
		},
		'next-year': function() {
			this.year += 1;
			this.changeDate();
		},
		'prev-year': function() {
			this.year -= 1;
			this.changeDate();
		}
	},
	changeDate: function() {
		this._getDate();
		this.formatDate();
		this.renderHeader();
	},
	renderHeader: function() {
		$('[data-role="current-month"]', this.calendarContainer).html(this.monthArr[this.month])
		$('[data-role="current-year"]', this.calendarContainer).html(this.year);
		var daylist = '';
		for (var i = 0, l = this.dayArr.length; i < l; i++) {
			daylist += '<b>' + this.dayArr[i] + '</b>';
		};
		$('.calendar-header', this.calendarContainer).html(daylist);
	},
	_getDate: function() {
		this.date = new Date(this.year, this.month, this.day);
	},
	formatDate: function() {
		var date = this.date;
		this.year = date.getFullYear();
		this.month = date.getMonth();
		this.day = date.getDate();
		var ndate = new Date(this.year, this.month + 1, 0);
		var dayNum = ndate.getDate();
		var list = '<ul>';
		var firstDay = (new Date(this.year, this.month, 1)).getDay();
		var preDate = new Date(this.year, this.month, 0);
		var preDateNum = preDate.getDate();
		var nextDate = new Date(this.year, this.month + 2, 0);
		if (firstDay > 0) {
			list += this._getDay(preDateNum - firstDay + 1, preDateNum, "preday", preDate);
		}
		list += this._getDay(1, dayNum, '', this.date);
		var lastDay = (new Date(this.year, this.month, dayNum)).getDay();
		list += this._getDay(1, 6 - lastDay, "nextday", nextDate);
		list += '</ul>';
		$('#' + this.id).find(".c_days").html(list);
	},
	_toString: function(dateArr) {
		var arr = [];
		var len = dateArr.length;
		for (var i = 0; i < len; i++) {
			var item = dateArr[i];
			if (typeof item === "string") {
				dateArr[i] = new Date(item);
			};
			for (var j = 0; j < i; j++) {
				if (item.getTime() < dateArr[j]) {
					var tmp = dateArr[i];
					dateArr[i] = dateArr[j];
					dateArr[j] = tmp;
				}
			}
		};
		for (var i = 0, l = dateArr.length; i < l; i++) {
			var d = dateArr[i];
			var year = d.getFullYear();
			var month = this._getTowNum(d.getMonth() + 1);
			var day = this._getTowNum(d.getDate());
			arr.push(year + this.separator + month + this.separator + day);
		}
		return arr;
	},
	_getDay: function(startNum, dayNum, cls, date) {
		var list = '';
		var start = this.range[0],
			end = this.range[1];
		if (start) {
			start = Date.parse(start);
		};
		if (end) {
			end = Date.parse(end);
		}
		for (var i = startNum; i <= dayNum; i++) {
			var className = cls || "";
			var datavalue = date.getFullYear() + this.separator + this._getTowNum(date.getMonth() + 1) + this.separator;
			datavalue += this._getTowNum(i);
			var d = new Date(date.getFullYear(), date.getMonth(), i);
			var time = d.getTime();
			//多选
			//console.log(this.dateArr)
			if (this.settings.multiple) {
				if (this._dateInArr(d, this.dateArr)) {
					className += ' focus';
				}
			} else
			if (time == this.defaultDate.getTime()) {
				className += ' focus';
			}
			if ((start && time < start) || (end && time > end)) {
				className += " disabled";
			}
			list += '<li class="' + className + '" data-value="' + datavalue + '">' + i + '</li>';
		};
		return list;
	},
	_dateInArr: function(date, arr) {
		for (var i = arr.length - 1; i >= 0; i--) {
			var item = arr[i];
			var idate = item;
			if (typeof item === "string") {
				var focusDateArr = item.split(this.separator);
				idate = new Date(focusDateArr[0], parseInt(focusDateArr[1]) - 1, focusDateArr[2]);
			}
			if (date.getTime() == idate.getTime()) {
				return true;
				break;
			}
		};
	},
	_removeDate: function(date, arr) {
		var newArr = [];
		for (var i = arr.length - 1; i >= 0; i--) {
			var item = arr[i];
			var idate = item;
			if (typeof item === "string") {
				var focusDateArr = item.split(this.separator);
				idate = new Date(focusDateArr[0], parseInt(focusDateArr[1]) - 1, focusDateArr[2]);
			}
			if (date.getTime() == idate.getTime()) {
				continue;
			}
			newArr.push(idate);
		};
		this.dateArr = newArr;
	},
	_getTowNum: function(n) {
		return ('0' + n.toString()).substr(-2);
	}
};