$(() => {
  const amenityDict = {};
  $("input[type='checkbox']").change(event => {
    const id = event.target.dataset.id;
    if (event.target.checked) {
      amenityDict[id] = event.target.dataset.name;
    } else {
      delete amenityDict[id];
    }
    $('.amenities h4').text(Object.values(amenityDict).join(', '));
  });
});
