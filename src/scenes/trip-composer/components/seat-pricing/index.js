import React, { Component } from 'react';
import { Form, Card, InputNumber, Button, Col, Row } from 'antd';

class SeatPricing extends Component {
  handleSeatPricing = values => {
    let validSeatPricing = true;
    const finalValues = {
      create: [],
    };
    Object.keys(values).forEach(trip => {
      const tmp = trip.split(',');
      const tripX = {
        from_city_id: tmp[0],
        to_city_id: tmp[1],
        prices: { create: [] },
      };
      Object.keys(values[trip]).forEach(busSalon => {
        Object.keys(values[trip][busSalon]).forEach(seatType => {
          if (!values[trip][busSalon][seatType]) {
            validSeatPricing = false;
          }
          tripX.prices.create.push({
            seat_type_id: seatType,
            bus_salon_id: busSalon,
            price: values[trip][busSalon][seatType],
          });
        });
      });
      finalValues.create.push(tripX);
    });
    return validSeatPricing && finalValues.create.length ? finalValues : false;
  };
  render() {
    const { selectedCities, busTypes, getSeatPricing, form } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const values = getFieldsValue();
    const validSeatPricing = this.handleSeatPricing(values);
    getSeatPricing(validSeatPricing);

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    //TODO: Replace with chosen cities and busSalons from backend.
    let cities = selectedCities || [
      {
        name: 'Cairo',
        id: '1',
      },
      {
        name: 'Alex',
        id: '2',
      },
      // {
      //   name: 'Assiut',
      //   id: 3,
      // },
    ];

    let busSalons = busTypes || [
      {
        id: '1',
        name: 'First Bus Salon',
        seat_types: [
          {
            id: '1',
            name_en: 'Normal Chair',
          },
          {
            id: '2',
            name_en: 'Abnormal Chair',
          },
        ],
      },
      {
        id: '2',
        name: 'Second Bus Salon',
        seat_types: [
          {
            id: '1',
            name_en: 'Normal Chair',
          },
        ],
      },
    ];
    let citiesCombination = [];

    for (let i = 0; i < cities.length - 1; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        const fromCity = cities[i];
        const toCity = cities[j];
        citiesCombination.push({
          name: `From ${fromCity.name} to ${toCity.name}`,
          id: `${fromCity.id},${toCity.id}`,
        });
      }
    }

    return (
      <Form layout="horizontal">
        <Row gutter={16}>
          {citiesCombination.map(trip => (
            <Col key={trip.id} span={8}>
              <Card title={trip.name} style={{ width: 400 }}>
                {busSalons.map(busSalon => (
                  <React.Fragment key={busSalon.id}>
                    <p>{busSalon.name}</p>
                    {busSalon.seat_types.map(seatType => {
                      return (
                        <Form.Item
                          key={`${trip.id}-${busSalon.id}-${seatType.id}`}
                          label={seatType.name_en}
                          {...formItemLayout}
                        >
                          {getFieldDecorator(
                            `${trip.id}[${busSalon.id}][${seatType.id}]`,
                            {
                              validateTrigger: ['onChange', 'onBlur'],
                              rules: [
                                {
                                  required: true,
                                  message: 'Please enter the seat pricing!',
                                },
                              ],
                            }
                          )(
                            <InputNumber
                              min={0}
                              max={1200}
                              onChange={value => {}}
                            />
                          )}
                        </Form.Item>
                      );
                    })}
                  </React.Fragment>
                ))}
              </Card>
            </Col>
          ))}
        </Row>
      </Form>
    );
  }
}

// export default SeatPricing;
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(
  SeatPricing
);
export default WrappedNormalLoginForm;
