import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';
import Form, { FormComponentProps } from 'antd/lib/form/Form';
import moment from 'moment';
import { DatePicker, TimePicker, Button, Input, Select } from 'antd';
import { appointments } from '../../../api';
import {notification} from "antd";
import 'antd/es/date-picker/style/css';
import 'antd/es/time-picker/style/css';
import 'antd/es/form/style/css';
import 'antd/es/button/style/css';
import 'antd/es/input/style/css';
import 'antd/es/select/style/css';
import 'antd/es/notification/style/css';
import {Appointment} from "../../../types";
import { useHistory } from "react-router-dom";

interface FormProps {
    form: any,
}

const AppointmentForm: React.FC<FormProps> = forwardRef<FormComponentProps, FormProps>(({ form }, ref) => {
    useImperativeHandle(ref, () => ({ form }));

    const { getFieldDecorator } = form;
    const timeFormat = 'HH:mm';
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    const [busyHoursDict, setBusyHoursDict] = useState({} as {[key: string]: any});

    const updateAvailableTime = useCallback(() => {
        const date = form.getFieldValue('date');
        if (!date) {
            return;
        }
        appointments.getByDate(date).then((response) => {
            const busyAppts = response.data || [] as Appointment[];
            const hoursDict = busyAppts.reduce((acc: any, appt: any) => {
                const time = moment(appt.scheduled_time);
                const hour = time.hour();
                if (acc[hour] === undefined) {
                    acc[hour] = new Set([])
                }
                acc[hour].add(time.minute());
                return acc;
            }, {});
            setBusyHoursDict(hoursDict);
        }, () => {
            notification.error({message: 'Fetching appointments error'})
        });
    }, []);

    const isDisabledDate = (currentDate: moment.Moment|null): boolean => {
        return !currentDate || moment().isAfter(currentDate, 'day');
    };

    const isDisabledHours = useCallback((): number[] => {
        const defaults = [0, 1, 2, 3, 4, 5, 6, 7, 8, 21, 22, 23];
        const busyTime = Object.keys(busyHoursDict)
            .filter((hour: string) => busyHoursDict[hour].size > 1)
            .map((hour) => parseInt(hour));
        return [...busyTime, ...defaults];
    }, [busyHoursDict]);

    const isDisabledMinutes = useCallback((selectedHour: number): number[] => {
        if (busyHoursDict[selectedHour]) {
            return Array.from(busyHoursDict[selectedHour]);
        }
        return [];
    }, [busyHoursDict]);


    const history = useHistory();
    const handleSubmit = useCallback((e: any) => {
        e.preventDefault();

        form.validateFields((err: any, fieldsValue: any) => {
            if (err) {
                return;
            }

            const values = {
                ...fieldsValue,
                'date_of_birth': fieldsValue['date_of_birth'].format('YYYY-MM-DD'),
                'date': fieldsValue['date'].format('YYYY-MM-DD'),
                'time': fieldsValue['time'].format('HH:mm'),
            };

            appointments.add(values).then((response) => {
                history.push('/public/appointment/success');
            }, () => {
                notification.error({message: 'Appointment creating error'})
            });
        });
    }, [history]);

    const config = {
        rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };

    return (
        <Form {...formItemLayout} onSubmit={handleSubmit} >
            <Form.Item label="First name">
                {getFieldDecorator('first_name', {
                    rules: [{ required: true, message: 'Please input your name!', whitespace: true }],
                })(<Input />)}
            </Form.Item>
            <Form.Item label="Last name">
                {getFieldDecorator('last_name', {
                    rules: [{ required: true, message: 'Please input your name!', whitespace: true }],
                })(<Input />)}
            </Form.Item>
            <Form.Item label="Gender">
                {getFieldDecorator('gender', { initialValue: 'Other' })(<Select style={{ width: '100%' }}>
                        <Select.Option value="Male">Male</Select.Option>
                        <Select.Option value="Female">Female</Select.Option>
                        <Select.Option value="Other">Other</Select.Option>
                    </Select>
                )}
            </Form.Item>
            <Form.Item label="Date of birth">
                {getFieldDecorator('date_of_birth', {
                    rules: [{ type: 'object', required: true, message: 'Please input your date of birth!', whitespace: true }],
                })(<DatePicker style={{ width: '100%' }}/>)}
            </Form.Item>
            <Form.Item label="E-mail">
                {getFieldDecorator('email', {
                    rules: [
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ],
                })(<Input />)}
            </Form.Item>
            <Form.Item label="Phone Number">
                {getFieldDecorator('phone', {
                    rules: [{ required: true, message: 'Please input your phone number!' }],
                })(<Input style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="Appointment date">
                {getFieldDecorator('date', config)(
                    <DatePicker disabledDate={isDisabledDate}
                                style={{ width: '100%' }}
                                onBlur={updateAvailableTime}
                    />
                )}
            </Form.Item>
            <Form.Item label="Appointment time">
                {getFieldDecorator('time', config)(
                    <TimePicker format={timeFormat}
                                minuteStep={30}
                                disabledHours={isDisabledHours}
                                disabledMinutes={isDisabledMinutes}
                                style={{ width: '100%' }}
                    />
                )}
            </Form.Item>
            <Form.Item wrapperCol={{xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 }}}>
                <Button type="primary" htmlType="submit">Schedule</Button>
            </Form.Item>
        </Form>
    );
});

export default Form.create<FormProps>()(AppointmentForm);
