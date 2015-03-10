# calendar
js日历控件
#用法
		<input type="text" id="calendar" value="2015-04-15"/>

		<script src="../src/jquery-1.9.1.min.js"></script>
		<script src="../src/calendar.js"></script>
		<script>
		var calendar = new Calendar();
		calendar.init({target :$('#calendar')});
		</script>

#属性和方法
focusDate:
	当前选中日期{{2015-01-02}}
target:
	触发日历的事件结点，可以是input或其他标签，如果是input会默认取value作为focusDate,否则取target的前一个input的value值，或取当前时间.
selected:function(a,b)
	选中后的回调事件，参数为(a)时间对象 ,(b)日历容器
