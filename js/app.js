// Put Current date into Header, below title.
const currentDate = $('#currentDate');
const currentDayjs = dayjs(); 
const day = parseInt(currentDayjs.format('D'));
// Switch statement to get the correct suffix for date
const nthNumber = (I) => {
    if (I > 3 && I < 21) return 'th';
    switch (I % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
};
let dayToday = currentDayjs.format('dddd ')
let dateToday = currentDayjs.format('D') + nthNumber(day);
let monthToday = currentDayjs.format(' MMMM');
let dayString = dayToday + dateToday + monthToday;

currentDate.html(dayString);
//  ======================================================================
