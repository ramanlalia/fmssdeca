var answer_chosen = false;
var last_question = false;
var correct_answers = 0;
var questions_answered = 0;

$(document).ready(function() {

	$('.choice').click(function() {
		if(answer_chosen == false) {
			questions_answered++;
			answer_chosen = true;
			var choice = $(this);
			var correct_choice = choice.parent().data('correct-choice');

			choice.parent().children().removeClass('hoverable');
			choice.parent().children().eq(correct_choice).addClass('correct_choice');

			if(choice.index() == correct_choice) {
				choice.parent().siblings('.correct').show();
				correct_answers++;
			}
			else {
				choice.addClass('incorrect_choice');
				choice.parent().siblings('.incorrect').show();
			}

			choice.parent().siblings('.explanation').show();
			if(!last_question) $('#next_question').show();
			else {
			 	$('#next_button').show();
				$('#stop_quiz').hide();
			}
		}

		return false;
	});

	$('#next_question').click(function() {
		$('.choices').children().addClass('hoverable').removeClass('correct_choice incorrect_choice');
		$('.explanation').hide();
		$('.incorrect').hide();
		$('.correct').hide();
		$('#next_question').hide();
		$('.question').hide();
		$('#loading').show();
		current_question++;
		answer_chosen = false;

		if((current_question + 1) == n) last_question = true;

		$.get('/api/question', {"clustre": clustre, "qid": question_ids[current_question]}, function(data) {
			$('#loading').hide();
			$('.question').show();
			$('#question_box').html(data.question);
			$('.choices').data('correct-choice', data.correct_answer_index);
			$('.explanation').html(data.explanation);
			$('.count_box').html((current_question + 1) + ' / ' + n);
			for(var i = 0; i < 4; i++) {
				$('.choices').children().eq(i).children().eq(1).html(data.answers[i]);
			}
		}).error(function(jqXHR, error) {
			console.log('error: ' + error);
			console.log(jqXHR.responseText);
		});
		
		return false;
	});

	$('#stop_quiz').click(function() {
		if(questions_answered == 0) window.location.href = '/';
		else finishQuiz();
		return false;
	});

	$('#next_button').click(finishQuiz);

	$('#retry_quiz').click(function() {
		window.location.reload(true);
		return false;
	});

	$('#another_quiz').click(function() {
		window.location.href = '/';
		return false;
	});

});

function finishQuiz() {
	// Hide the unnecessary elements
	$('.question').hide();
	$('#next_button').hide();
	$('#next_question').hide();
	$('#stop_quiz').hide();

	// Show the results
	$('#results').show();

	// Update the results
	$('#results h1').html('You answered ' + correct_answers + ' out of ' + questions_answered + ' questions correctly. <br /> Your percentage score was ' + correct_answers/questions_answered*100 + '%.');

	// Centre the page heading for visual appeal
	$('#page_header').css('text-align', 'center');

	return false; // prevent needless navigation to #
}
