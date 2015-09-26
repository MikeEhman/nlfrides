function lastSunday(d) {
  var d = d.replace(/(^\d{4})(\d{2})(\d{2}$)/,'$1/$2/$3');

  d = new Date(d);
  d.setDate(d.getDate() - d.getDay());

  year = d.getFullYear()+'';
  month = d.getMonth()+1+'';
  day = d.getDate()+'';
  if ( month.length == 1 ) month = "0" + month; // Add leading zeros to month and date if required
  if ( day.length == 1 ) day = "0" + day;

  return year+month+day;
}

function nextSunday(d) {
  var td = new Date();
  var d = new Date(td.getFullYear(),td.getMonth(),td.getDate()+(7-td.getDay()));
  return d;
}



$(document).ready(function(){
  console.log("index.js loaded!");
  var dp = $("#dp");
  console.log(dp);
  dp.datepicker({format:"mm/dd/yyyy"});
  dp.datepicker('setValue',nextSunday());

});
