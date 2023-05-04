$(function () {
  const amens = {};
  $('input[type=checkbox]').click(function () {
    console.log($(this).is(':checked'));
    console.log($(this).dataset);
    if ($(this).is(':checked')) {
      amens[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amens[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(amens).join(', '));
  });
});
