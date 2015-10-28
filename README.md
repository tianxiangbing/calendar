# calendar
js日历控件
例子见[DEMO](http://www.lovewebgames.com/jsmodule/calendar.html)  
#用法
	<input type="text" id="calendar" value="2015-04-15"/>
	<script src="../src/jquery-1.9.1.min.js"></script>
	<script src="../src/calendar.js"></script>
	<script>
		var calendar = new Calendar();
		calendar.init({
			target: $('#calendar'),
			range: ['2015-3-5', '2015-3-25'],
			multiple: true,
			maxdays: 5,
			overdays: function(a) {
				alert('添加已达上限 ' + a + ' 天');
			}
		});
	</script>
#或者
	<input type="text" class="calendar" value="2015-03-14"/>
	<input type="text" class="calendar2" value="2015-03-18"/>

	<script src="../dist/jquery-1.9.1.min.js"></script>
	<script src="../dist/calendar-jquery.min.js"></script>
	<script>
		$(".calendar").Calendar({toolbar:true});
		$(".calendar2").Calendar();
	</script>
#属性和方法
##属性
###date:
	当前日期.
###toolbar:bool
	是否显示下方操作栏
###separator:
	日期分隔符，默认"-".
###id:
	日历容器ID
###calendarContainer:
	日历容器对象
###dayArr:
	['日', '一', '二', '三', '四', '五', '六']
###monthArr:
	["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
###isShow:是否显示中		
###maxdays:多选时最大天数
###time:bool  
	可选时分秒,此值为true时，toolbar也为true,默认当前时间
###mutilSeparator:  
	多选日期时的分隔符，默认逗号分隔
###zIndex:
	设置zIndex
###onlyYM:bool  `false`
	只选年月
###onlyHm	bool `false`
	只选时分
##方法
###setRange:function(range)
	设置日期可选范围的方法
###init:function(settings)
###settings参数
####focusDate:
	当前选中日期{{2015-01-02}}
####target:
	触发日历的事件结点，可以是input或其他标签，如果是input会默认取value作为focusDate,
	否则取target的前一个input的value值，或取当前时间.
####selected:function(a,b)
	选中后的回调事件，参数为(a)时间对象 ,(b)日历容器
####beforeSelect:function(a,b)
	选择前触发方法，参数为(a)时间对象 ,(b)日历容器
####afterSelected:function(o,a,b)
	选择赋值后触发方法，参数为(o)为target, (a)时间对象 ,(b)日历容器
###overdays:function(daysnum)
	超出限定天数时的回调（多选时）
###filter:function(time)
	根据返回bool来过滤是否该日期可以选择，time为时间戳
***
# Release History
1.2015-04-30   v1.0.4  添加filter属性回调，过滤不可选择日期，添加年份和月份的快速选择
2. 2015-03-15  v1.0.1  添加jquery插件式写法
3. 2015-03-12  v1.0.0  
---
Task submitted by [田想兵](http://www.lovewebgames.com)

