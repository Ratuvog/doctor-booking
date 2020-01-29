import json
from datetime import datetime

from django.http import HttpResponse
from django.views.generic import TemplateView
from marshmallow import fields
from social_django.models import UserSocialAuth
from webargs.djangoparser import use_kwargs, use_args

from awesome_doctor.endpoints import DoctorEndpoint, AppointmentEndpoint, PatientEndpoint, OfficeEndpoint
from awesome_doctor.schemas import AppointmentCreateSchema


def get_token():
    oauth_provider = UserSocialAuth.objects.get(provider='drchrono')
    access_token = oauth_provider.extra_data['access_token']
    return access_token


class LoginView(TemplateView):
    template_name = 'login.html'


class DoctorMain(TemplateView):
    template_name = 'doctor.html'

    def get_context_data(self, **kwargs):
        kwargs = super(DoctorMain, self).get_context_data(**kwargs)
        kwargs['doctor'] = next(DoctorEndpoint(get_token()).list())
        return kwargs


class PatientAppointment(TemplateView):
    template_name = 'appointment.html'


@use_kwargs({'date': fields.Date(required=True)})
def get_appointments(request, date):
    appointments = list(AppointmentEndpoint(get_token()).list(date=date.strftime('%Y-%m-%d')))
    return HttpResponse(json.dumps(appointments))


@use_args({'data': fields.Nested(AppointmentCreateSchema)})
def create_appointment(request, body):
    oauth_provider = UserSocialAuth.objects.get(provider='drchrono')
    doctor_id = oauth_provider.extra_data['doctor']

    office = next(OfficeEndpoint(get_token()).list())
    exam_room = office.get('exam_rooms', [{'index': 1}])[0].get('index') or 1
    args = body.get('data', {})
    patient_params = {
        'first_name': args.get('first_name'),
        'last_name': args.get('last_name'),
        'gender': args.get('gender', 'Other'),
        'date_of_birth': args.get('date_of_birth'),
        'email': args.get('email'),
        'cell_phone': args.get('phone'),
        'doctor': doctor_id
    }
    patient = PatientEndpoint(get_token()).create(data=patient_params)
    appointment_params = {
        'doctor': doctor_id,
        'patient': patient.get('id'),
        'duration': 30,
        'exam_room': exam_room,
        'office': office.get('id'),
        'scheduled_time': args.get('date').strftime('%Y-%m-%d') + 'T' + args.get('time').strftime('%H:%M')
    }

    appointment = AppointmentEndpoint(get_token()).create(data=appointment_params)
    return HttpResponse(json.dumps(appointment))


