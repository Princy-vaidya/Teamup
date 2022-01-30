import moment from 'moment';
import React from 'react';

export const Commondate = () => {
    var now = moment();
      var WeekStartDate = now.startOf('isoWeek');
      WeekStartDate = new Date(WeekStartDate.format('YYYY-MM-DD'))
      WeekStartDate.setHours(0,0,0,0)
      var WeekEndDate = new Date(WeekStartDate);
      WeekEndDate.setDate(WeekStartDate.getDate()+6);
      WeekEndDate.setHours(23,59,59,999)
      const alldate = {"start": WeekStartDate, "end": WeekEndDate}
      return WeekStartDate
}
