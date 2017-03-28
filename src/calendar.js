/*
 * Created with vs code.
 * github: https://github.com/tianxiangbing/calendar   记得加星星
 * demo地址: http://www.lovewebgames.com/jsmodule/index.html
 * User: 田想兵
 * Date: 2015-03-09
 * Time: 17:02:02
 * Contact: 55342775@qq.com
 * Desc: 确保代码最新及时修复bug，请去github上下载最新源码 https://github.com/tianxiangbing/calendar
 */
;
(function (root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$'], factory);
	} else if (typeof exports === 'object') { //umd
		module.exports = factory();
	} else {
		root.Calendar = factory(window.Zepto || window.jQuery || $);
	}
})(this, function ($) {
	$.fn.Calendar = function (settings) {
		var list = [];
		$(this).each(function () {
			var calendar = new Calendar();
			var options = $.extend({
				target: $(this)
			}, settings);
			calendar.init(options);
			list.push(calendar);
		});
		return list;
	};
	var Calendar = function () {
		this.monthArr = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
		this.dayArr = ['日', '一', '二', '三', '四', '五', '六'];
		var rnd = Math.random().toString().replace('.', '');
		this.id = 'calendar_' + rnd;
		this.calendarContainer;
		this.settings = {};
		this.isShow = false;
		this.autohide = true;
		this.toolbarTpl = '<div class="ui-calendar-toolbar clearfix"><a class="js-calendar-submit">确定</a><a class="js-clear">清空</a><a class="ui-calendar-today">现在</a><a class="ui-calendar-close">关闭</a></div>';
		this.timeTpl = '<div class="ui-calendar-time clearfix"><select class="js-calendar-hours">时</select>:<select class="js-calendar-minutes">分</select><s>:</s><select class="js-calendar-second">秒</select></div>';
		this.dateArr = [];
		this.maxDays = 9999;
	};
	Calendar.prototype = {
		separator: '-',
		defaultDate: new Date(),
		setRange: function (range) {
			this.range = $.extend([null, null], range);
		},
		getDefaultDate: function () {
			var _this = this;
			if (this.settings.target && $(this.settings.target).size()) {
				if ($(this.settings.target)[0].nodeType === 1) {
					this.settings.focusDate = $(this.settings.target).val() || this.settings.focusDate || '';
				} else {
					this.settings.focusDate = $(this.settings.target).prev().val() || this.settings.focusDate || '';
				}
				if (this.settings.onlyYM && $(this.settings.target).val()) {
					this.settings.focusDate = $(this.settings.target).val() + this.separator + "01";
				}
			}
			if (this.settings.focusDate && !this.settings.multiple) {
				var focusDateArr = this.settings.focusDate.split(' ')[0].split(this.separator);
				var t = this.settings.focusDate.split(' ')[1] || "00:00:00";
				this.defaultDate = new Date(focusDateArr[0], parseInt(focusDateArr[1]) - 1, focusDateArr[2], t.split(':')[0], t.split(':')[1], t.split(':')[2]);
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
		},
		init: function (settings) {
			$('body').append('<div class="ui-calendar clearfix" id="' + this.id + '"><div class="ui-calendar-pannel clearfix" data-role="pannel"><span class="ui-calendar-control" data-role="prev-year">&lt;&lt;</span><span class="ui-calendar-control" data-role="prev-month">&lt;</span><span class="ui-calendar-control month" data-role="current-month"></span><span class="ui-calendar-control year" data-role="current-year"></span><span class="ui-calendar-control" data-role="next-month">&gt;</span><span class="ui-calendar-control" data-role="next-year">&gt;&gt;</span></div><div class="calendar-header clearfix"></div><div class="c_days clearfix"></div></div>');
			this.calendarContainer = $('#' + this.id);
			var _this = this;
			this.settings = $.extend({}, this.settings, settings);
			this.maxDays = this.settings.maxdays || this.maxDays;
			this.mutilSeparator = this.settings.mutilSeparator || ",";
			$(this.settings.target).attr('readonly', 'readonly');
			this.getDefaultDate();
			if (this.settings.multiple) {
				this.settings.toolbar = true;
			}
			var zIndex = this.settings.zIndex || 1;
			this.calendarContainer.css('zIndex', zIndex);
			this.date = this.defaultDate;
			this.setRange(this.settings.range);
			if (this.settings.time) {
				this.settings.toolbar = true;
				this.autohide = false;
				this.showTime();
				this.showToolbar();
			}
			if (this.settings.toolbar) {
				this.autohide = false;
				this.showToolbar();
			}
			// this.formatDate();
			// this.renderHeader();
			this.bindEvent();
			if (this.settings.target) {
				this.hide();
			} else {
				this.autohide = false;
				this.show();
			}
		},
		showToolbar: function () {
			if (this.settings.toolbar && $('.ui-calendar-toolbar', this.calendarContainer).size() == 0) {
				this.calendarContainer.append(this.toolbarTpl);
			}
		},
		showTime: function () {
			if (this.calendarContainer.find('.ui-calendar-time').size() == 0) {
				this.calendarContainer.append(this.timeTpl);
			}
			var _this = this;
			$('.js-calendar-minutes', this.calendarContainer).html('');
			$('.js-calendar-second', this.calendarContainer).html('');
			for (var i = 0, l = 60; i < l; i++) {
				if (i < 24) {
					$('.js-calendar-hours', this.calendarContainer).append('<option>' + _this._getTowNum(i) + '</option>');
				}
				$('.js-calendar-minutes', this.calendarContainer).append('<option>' + _this._getTowNum(i) + '</option>');
				$('.js-calendar-second', this.calendarContainer).append('<option>' + _this._getTowNum(i) + '</option>');
			}
			var value = this.date;
			var t = _this._getTowNum(value.getHours()) + ":" + _this._getTowNum(value.getMinutes()) + ":" + _this._getTowNum(value.getSeconds());
			$('.js-calendar-hours', this.calendarContainer).val(_this._getTowNum(value.getHours()));
			$('.js-calendar-minutes', this.calendarContainer).val(_this._getTowNum(value.getMinutes()));
			$('.js-calendar-second', this.calendarContainer).val(_this._getTowNum(value.getSeconds()));
			if (_this.settings.onlyHm) {
				$('.js-calendar-second', this.calendarContainer).hide().val('00').prev().hide();
			}
		},
		show: function () {
			this.getDefaultDate();
			this.calendarContainer.show();
			this.date = this.defaultDate;
			this.formatDate();
			this.renderHeader();
			this.isShow = true;
			this.setPosition();
			this.settings.show && this.settings.show(this.calendarContainer);
			var _this = this;
			this.timer = setInterval(function () {
				_this.setPosition.call(_this);
			}, 500);
			if (this.settings.time) {
				this.settings.toolbar = true;
				this.autohide = false;
				this.showTime();
			}
			if (this.settings.onlyYM) {
				this.settings.toolbar = false;
				$('[data-role="current-month"]', this.calendarContainer).trigger('click');
				$('.ui-month-list', this.calendarContainer).show();
				$('.c_days', this.calendarContainer).hide();
			}
		},
		hide: function () {
			this.calendarContainer.hide();
			this.isShow = false;
			this.settings.hide && this.settings.hide(this.calendarContainer);
			clearInterval(this.timer);
		},
		setPosition: function () {
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
				var st = $(window).scrollTop();
				var winY = $(window).height();
				if (y + this.calendarContainer.outerHeight() > st + winY) {
					var tmp = y - this.calendarContainer.outerHeight() - $(this.settings.target).outerHeight();
					if (tmp > 0) {
						y = tmp;
					}
				}
				this.calendarContainer.css({
					top: y,
					left: x
				});
			}
		},
		setDate: function (value) {
			var _this = this,
				v;
			if (typeof value === "object") {
				_this.defaultDate = value;
				v = value.getFullYear() + _this.separator + _this._getTowNum((value.getMonth() + 1)) + _this.separator + _this._getTowNum(value.getDate());
				if (_this.settings.time) {
					v += " " + _this._getTowNum(value.getHours()) + ":" + _this._getTowNum(value.getMinutes()) + ":" + _this._getTowNum(value.getSeconds());
				}
			} else {
				var a = value.split(' ');
				var d = a[0];
				var t = a[1] || "00:00:00";
				var focusDateArr = d.split(_this.separator);
				_this.defaultDate = new Date(focusDateArr[0], parseInt(focusDateArr[1]) - 1, focusDateArr[2], t.split(':')[0], t.split(':')[1], t.split(':')[2]);
				v = value;
			}
			_this.date = _this.defaultDate;
			return v;
		},
		bindEvent: function () {
			var _this = this;
			$('.ui-calendar-control[data-role]', _this.calendarContainer).click(function () {
				_this.go[$(this).data('role')].call(_this);
				return false;
			})
			$(_this.calendarContainer).click(function () {
				return false;
			});
			$('.c_days', _this.calendarContainer).delegate('li', 'click', function () {
				_this.settings.beforeSelect && _this.settings.beforeSelect(_this.date, _this.calendarContainer);
				if ($(this).hasClass('disabled')) {
					return false;
				};
				var value = $(this).data('value');
				_this.setDate(value);
				if (_this.settings.multiple) {
					if (!$(this).hasClass('focus')) {
						if (_this.maxDays <= _this.dateArr.length) {
							//alert('添加已达上限 ' + _this.maxDays + ' 天');
							_this.settings.overdays && _this.settings.overdays(_this.maxDays, _this.dateArr, _this.calendarContainer);
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
				_this.settings.selected && _this.settings.selected.call(_this, _this.date, _this.calendarContainer);
				if (_this.settings.target && $(_this.settings.target).size() && $(_this.settings.target)[0].nodeType === 1 && _this.autohide) {
					$(_this.settings.target).val(value);
					_this.hide();
					_this.settings.afterSelected && _this.settings.afterSelected.call(_this, $(_this.settings.target), _this.date, _this.calendarContainer);
				}
				return false;
			});
			$('.ui-calendar-toolbar', _this.calendarContainer).delegate('a', 'click', function () {
				if ($(this).hasClass('js-calendar-submit')) { //点确定
					_this.settings.selected && _this.settings.selected.call(_this, _this.dateArr, _this.calendarContainer);
					if (_this.dateArr.length === 0) {
						_this.dateArr.push($('.focus', _this.calendarContainer).data('value'));
					}
					var arr = _this._toString(_this.dateArr);
					value = arr.join(_this.mutilSeparator);
					if (_this.settings.time) {
						value += " " + $('.js-calendar-hours', _this.calendarContainer).val() + ":" + $('.js-calendar-minutes', _this.calendarContainer).val() + ":" + $('.js-calendar-second', _this.calendarContainer).val()
					}
					$(_this.settings.target).val(value);
					_this.hide();
				}
				if ($(this).hasClass('ui-calendar-close')) {
					_this.hide();
				}
				if ($(this).hasClass('ui-calendar-today')) { //点现在
					var now = new Date();
					var value = _this.setDate(now);
					_this.date = now;
					_this.hide();
					$(_this.settings.target).val(value);
				}
				if ($(this).hasClass('js-clear')) {
					_this.dateArr = [];
					_this.date = null;
					$(_this.settings.target).val('');
					_this.formatDate();
				}
				var value = $(_this.settings.target).val();
				var currentValue = new Date(value)
				if (_this.settings.time && currentValue) {
					//时间时，判断
					var start = _this.range[0],
						startDate,
						end = _this.range[1],
						endDate;
					if (start) {
						start = +new Date(Date.parse(start));
					};
					if (end) {
						end = +new Date(Date.parse(end));
					}
					if ((currentValue < start && start) || (currentValue > end && end)) {
						_this.date = null;
						$(_this.settings.target).val('');
						alert('所选日期超出限定范围内');
					}
				}
				_this.settings.afterSelected && _this.settings.afterSelected.call(_this, $(_this.settings.target), _this.date, _this.calendarContainer);
			});
			if (_this.settings.target) {
				$(_this.settings.target).bind('click', function () {
					if ($(this).hasClass('disabled') || $(this).filter('[disabled="true"]').size() > 0) {
						return;
					}
					$(document).trigger('click');
					_this.show();
					return false;
				});
				$(document).click(function () {
					_this.isShow && _this.hide()
				})
			}
			$(document).keydown(function (e) {
				if (e.keyCode === 27) {
					_this.hide();
				}
			});
		},
		actionFlow: function (obj, action) {
			if (obj.siblings('.ui-calendar-flow').length) {
				obj.siblings('.ui-calendar-flow').hide(300, function () {
					obj[action](300);
				});
			} else {
				obj[action](300);
			}
		},
		go: {
			'next-month': function () {
				this.month += 1;
				this.day = 1;
				this._getDate();
				this.formatDate();
				this.renderHeader();
				this.settings.goCallback.call(this, 'next-month', this.date);
			},
			'prev-month': function () {
				this.month -= 1;
				this.day = 1;
				this.changeDate();
				this.settings.goCallback.call(this, 'prev-month', this.date);
			},
			'next-year': function () {
				this.day = 1;
				this.year += 1;
				this.changeDate();
				this.settings.goCallback.call(this, 'next-year', this.date);
			},
			'prev-year': function () {
				this.day = 1;
				this.year -= 1;
				this.changeDate();
				this.settings.goCallback.call(this, 'prev-year', this.date);
			},
			'current-year': function (show) {
				var _this = this;
				if (!this.yearContainer) {
					this.yearContainer = $('<div class="ui-year-list ui-calendar-flow"/>');
					this.calendarContainer.append(this.yearContainer);
					_this.actionFlow(_this.yearContainer, 'show');
					this.yearContainer.on('click', 'div', function () {
						var index = $(this).data('value');
						_this.year = index;
						_this.changeDate();
						if (!$(this).hasClass('cross')) {
							_this.actionFlow(_this.yearContainer, 'hide');
							if (_this.settings.onlyYM) {
								_this.actionFlow(_this.monthContainer, 'show');
							}
						} else {
							_this.go['current-year'].call(_this, true);
						}
					});
				} else {
					if (!show) {
						_this.actionFlow(_this.yearContainer, 'toggle');
					}
				}
				var yearTen = Math.floor(_this.year / 10);
				this.yearContainer.html('');
				this.yearContainer.append('<div class="cross prevtenyear" data-value="' + ((yearTen - 1).toString() + 9) + '">...</div>');
				for (var i = 0, l = 10; i < l; i++) {
					var y = yearTen.toString() + i;
					var cls = '';
					if (_this.year == y) {
						cls = ' class="current" ';
					}
					this.yearContainer.append('<div ' + cls + ' data-value="' + y + '">' + y + '</div>');
				};
				this.yearContainer.append('<div class="cross nexttenyear" data-value="' + ((yearTen + 1).toString() + 0) + '">...</div>');
				this.settings.goCallback.call(this, 'current-year', this.date);
			},
			'current-month': function () {
				var _this = this;
				if (!this.monthContainer) {
					this.monthContainer = $('<div class="ui-month-list ui-calendar-flow"/>');
					this.calendarContainer.append(this.monthContainer);
					if (!_this.settings.onlyYM) {
						_this.actionFlow(_this.monthContainer, 'show');
					}
					this.monthContainer.on('click', 'div', function () {
						var index = $(this).data('value');
						_this.month = index;
						_this.changeDate();
						if (!_this.settings.onlyYM) {
							_this.monthContainer.hide(300);
						} else {
							$(_this.settings.target).val(_this.year.toString() + _this.separator + (_this.month + 1));
							_this.hide();
							_this.settings.selected && _this.settings.selected.call(_this, _this.date, _this.calendarContainer);
						}
					});
				} else if (!this.settings.onlyYM) {
					_this.actionFlow(_this.monthContainer, 'toggle');
				} else {
					_this.actionFlow(_this.monthContainer, 'show');
				}
				this.monthContainer.html('');
				for (var i = 0, l = this.monthArr.length; i < l; i++) {
					var m = this.monthArr[i];
					var cls = '';
					if (_this.month == i) {
						cls = ' class="current" ';
					}
					this.monthContainer.append('<div ' + cls + ' data-value="' + i + '">' + m + '</div>');
				};
				this.settings.goCallback && this.settings.goCallback.call(this, 'current-month', this.date);
			}
		},
		changeDate: function () {
			this._getDate();
			this.formatDate();
			this.renderHeader();
		},
		renderHeader: function () {
			$('[data-role="current-month"]', this.calendarContainer).html(this.monthArr[this.month])
			$('[data-role="current-year"]', this.calendarContainer).html(this.year);
			var daylist = '';
			for (var i = 0, l = this.dayArr.length; i < l; i++) {
				daylist += '<b>' + this.dayArr[i] + '</b>';
			};
			if (!this.settings.onlyYM) {
				$('.calendar-header', this.calendarContainer).html(daylist);
			}
		},
		_getDate: function () {
			this.date = new Date(this.year, this.month, this.day);
		},
		formatDate: function () {
			var date = this.date || this.defaultDate;
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
			list += this._getDay(1, dayNum, '', date);
			var lastDay = (new Date(this.year, this.month, dayNum)).getDay();
			list += this._getDay(1, 6 - lastDay, "nextday", nextDate);
			list += '</ul>';
			$('#' + this.id).find(".c_days").html(list);
		},
		_toString: function (dateArr) {
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
		_getDay: function (startNum, dayNum, cls, date) {
			var list = '';
			var start = this.range[0],
				startDate,
				end = this.range[1],
				endDate;
			if (start) {
				start = new Date(Date.parse(start));
				startDate = +new Date(start.getFullYear(), start.getMonth(), start.getDate());
			};
			if (end) {
				end = new Date(Date.parse(end));
				endDate = +new Date(end.getFullYear(), end.getMonth(), end.getDate());
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
					if (time == +new Date(this.defaultDate.getFullYear(), this.defaultDate.getMonth(), this.defaultDate.getDate())) {
						className += ' focus';
					}
				if ((startDate && time < startDate) || (endDate && time > endDate)) {
					className += " disabled";
				}
				if (this.settings.filter && !this.settings.filter(time)) {
					className += " disabled";
				}
				list += '<li class="' + className + '" data-value="' + datavalue + '">' + i + '</li>';
			};
			return list;
		},
		_dateInArr: function (date, arr) {
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
		_removeDate: function (date, arr) {
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
		_getTowNum: function (n) {
			return ('0' + n.toString()).substr(-2);
		}
	};
	return Calendar;
});