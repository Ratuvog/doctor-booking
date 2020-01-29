from marshmallow import Schema, fields, validate


class AppointmentCreateSchema(Schema):
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    gender = fields.String(required=False, validate=validate.OneOf(('Male', 'Female', 'Other')))
    date_of_birth = fields.Date(required=True)
    email = fields.Email(required=True)
    phone = fields.String(required=True)
    date = fields.Date(required=True)
    time = fields.Time(required=True, format='HH:mm')
