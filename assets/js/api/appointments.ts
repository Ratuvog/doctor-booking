import moment from 'moment';
import http from "./http";

export default {
  getByDate: (date: moment.Moment) => {
    return http.get(`/appointments/`, { params: { date: date.format('YYYY-MM-DD') }});
  },

  add: (data: string) => {
    return http.post(`/appointments_create/`, { data });
  },
};
