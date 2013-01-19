var clustre;

$(document).ready(function() {
	$('.clustre').click(function() {
		clustre = $(this).data('clustre');
		$('#pick_clustre').hide();
		$('#pick_numq').show();
		return false;
	});

	$('.numq').click(function() {
		window.location.href = '/quiz?clustre=' + clustre + '&n=' + $(this).text();
		return false;
	});
});
