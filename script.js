var seconds_left = 0;
var now_times = 0;
var isInactive = true;
$('.empty').removeClass('hiddd');

var interval_type = 'work';

var intervalVariable;

function audio_change() {

	var audio = $('#audio_beep');

	$('#audio_beep source[type="audio/ogg"]').attr('src', 'click.ogg');
	$('#audio_beep source[type="audio/mp3"]').attr('src', 'click.mp3');

	audio[0].pause();
	audio[0].load();
}

function timerTick(type, timer_params) {
	seconds_left--;

		if(interval_type == 'work') {

			if(seconds_left >= 0) {

				renderTimerNums(seconds_left);
			}

			else {

				seconds_left = timer_params.time_rest;
				
				renderTimerNums(seconds_left);

				$('#audio_beep')[0].play();

				interval_type = 'rest';

				const body = document.querySelector('body');
				body.style.backgroundColor = '#78DBE2';
				$('.working').addClass('hid');
				$('.resting').removeClass('hidd');
			}
		}

		else if(interval_type == 'rest') {

			if(seconds_left >= 0) {

				renderTimerNums(seconds_left);				
			} 

			else {
				seconds_left = timer_params.time_work;

				renderTimerNums(seconds_left);

				$('#audio_beep')[0].play();

				now_times++;

				if(now_times > timer_params.interval_count) {

					$('.timer_interval_nums.times').text(timer_params.interval_count);

					
					$('#timer_pause').trigger('click');
					seconds_left = 0;
					isInactive = true;

					$('.empty').removeClass('hiddd');
					$('.resting').addClass('hidd');
					$('.working').addClass('hid');

					const body = document.querySelector('body');
					body.style.backgroundColor = '#C07F3F';

				}

				else {

					$('.timer_interval_nums.times').text(now_times);
					const body = document.querySelector('body');
					body.style.backgroundColor = '#C07F3F';
					$('.working').removeClass('hid');
					$('.resting').addClass('hidd');
			
				}

				interval_type = 'work';
			}
		}
		
		$('#html_title').text(seconds_left);

}

function secondsToTime(seconds) {
	var h = parseInt(seconds / 3600 % 24);
	var m = parseInt(seconds /  60 % 60);
	var s = parseInt(seconds % 60);
	return {'hours': leadZero(parseInt(h)), 'minutes': leadZero(parseInt(m)), 'seconds': leadZero(parseInt(s))};
}

function leadZero(num) {
	var s = "" + num;
	if (s.length < 2) {
		s = "0" + s ;
	}
	return s;
}

function renderTimerNums(seconds) {
	var timer_nums = secondsToTime(seconds)
	$('.timer_nums.minutes').text(timer_nums.minutes);
	$('.timer_nums.seconds').text(timer_nums.seconds);
}

var timer_params = {};
$('#timer_run').click(function() {
	audio_change();
	$('#audio_beep')[0].play();
	$("#timer_run").addClass('hide');
	$('#timer_pause').removeClass('hide');

	if (isInactive) {
		var timer_minutes_work = $('.details .WorkTimeInput').text();
		var timer_minutes_rest = $('.details .RestTimeInput').text();
		var sets_count = $('.details .SetsCountInput').text();
		$('.timer_interval_nums all_times').text(sets_count);
		timer_params.time_work = timer_minutes_work*60;
		timer_params.time_rest = timer_minutes_rest*60;
		timer_params.interval_count = sets_count;
		now_times = 1;
	}

	if(interval_type == 'work') {
		const body = document.querySelector('body');
		body.style.backgroundColor = '#C07F3F';
		$('.working').removeClass('hid');
		$('.resting').addClass('hidd');

		
		if (isInactive) seconds_left = timer_params.time_work + 1;
	}
	else if(interval_type == 'rest') {
		const body = document.querySelector('body');
		body.style.backgroundColor = '#78DBE2';
		$('.resting').removeClass('hidd');
		$('.working').addClass('hid');
		
		if (isInactive) seconds_left = timer_params.time_rest + 1;
	}

	if (isInactive) timerTick('interval', timer_params);
	intervalVariable = setInterval(timerTick, 1000, 'interval', timer_params);
	
	isInactive = false;

	$('.empty').addClass('hiddd');
	return false;
});

$('#timer_pause').click(function(event, params) {

	if(params !== undefined) {

		if(params.audio === undefined) {

			params.audio = 1;
		}
	} 

	else {
		params = {audio: 1};
	}

	$(this).addClass('hide');

	$('#timer_run').removeClass('hide');

	clearInterval(intervalVariable);

	if(params.audio) {

		$('#audio_beep')[0].play();
	}

	return false;
});

$('#timer_clear').click(function() {

	$('#timer_pause').trigger('click', {audio: 0});

	interval_type = 'work';

	$('.resting').addClass('hidd');
	$('.working').addClass('hid');
	seconds_left = $('.details .WorkTimeInput').text() * 60;
	renderTimerNums(seconds_left);

	now_seconds = 0;
	now_times = 0;

	$('.timer_interval_work .minutes').text('25');
	$('.timer_interval_work .seconds').text('00');
	$('.timer_interval_rest .minutes').text('05');
	$('.timer_interval_rest .seconds').text('00');
	$('.timer_interval_count .times').text('1');
	$('.timer_interval_count .all_times').text('5');
	
	isInactive = true;

	$('.empty').removeClass('hiddd');

	return false;
});
$('#settings').click(function() {
	$('.details').removeClass('hidden');
});

$('.close').click(function() {
	$('.details').addClass('hidden');
});

$('.save').click(function() {
	var timer_minutes_work = $('.details .WorkTimeInput').text();
	var timer_minutes_rest = $('.details .RestTimeInput').text();
	var sets_count = $('.details .SetsCountInput').text();

	timer_params.time_work = timer_minutes_work*60;
	timer_params.time_rest = timer_minutes_rest*60;

	renderTimerNums(timer_params.time_work);

	$('.details').addClass('hidden');

	$('.timer_interval_nums.all_times').text(sets_count);
});

