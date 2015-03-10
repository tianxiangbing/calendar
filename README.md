# calendar
js日历控件
例子见[DEMO](../../raw/master/example/index.html)  
#用法
		<input type="text" id="calendar" value="2015-04-15"/>
		<script src="../src/jquery-1.9.1.min.js"></script>
		<script src="../src/calendar.js"></script>
		<script>
		var calendar = new Calendar();
		calendar.init({target :$('#calendar')});
		</script>

#属性和方法
##属性
###date:
		当前日期.
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
