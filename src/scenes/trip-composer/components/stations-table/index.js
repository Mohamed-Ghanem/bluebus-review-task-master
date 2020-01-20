import React, { Component } from 'react';
import { Table, Button, Popconfirm, TimePicker, Checkbox, Divider } from 'antd';
import moment from 'moment';
import { SelectInput } from '@components';
import { generateItems } from '../utils';
import './stations-table.css';

// [TODO] query bus types and days
const days = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];
const format = 'HH:mm';

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.getInitalState(this.props, true);
  }

  getInitalState = (props, firstRender) => {
    console.log('getInitalState');
    const { allBusSalons } = this.props.allBusesQuery;
    this.locations_name = props.locations_name;
    this.selectedLocationObj = props.selectedLocationObj;
    this.title = ['key', 'Bus Salon', 'Day', ...this.locations_name, 'Actions'];
    let dataIndex = this.title;
    const actionWidth = 120;

    let isFixedColumns = j => {
      return (
        this.title[j] === 'key' ||
        this.title[j] === 'Bus Salon' ||
        this.title[j] === 'Day'
      );
    };

    this.columns = generateItems(this.title.length, j => ({
      title: this.title[j],
      dataIndex: dataIndex[j],
      key: this.title[j],
      /**Add fixed to columns else locations*/
      fixed: isFixedColumns(j) ? 'left' : false,
      // width: isFixedColumns(j) ? 100 : null,
    }));
    /**Add the render method to Actions column*/
    this.columns.find(column => column.title === 'Actions').render = (
      text,
      record
    ) => {
      return (
        <div style={{ width: actionWidth }}>
          {/* <a onClick={() => this.repeateRow(record.key)}>Repeat</a>
          <Divider type="horizontal" /> */}
          {record.key != 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a>Delete</a>
            </Popconfirm>
          ) : null}
        </div>
      );
    };

    firstRender
      ? (this.state = {
          dataSource: allBusSalons
            ? [this.generateDataSourceObject('1')]
            : null,
          count: 1,
          /**timeLines is the trip instances */
          timeLines: [
            {
              key: 1,
              day: null,
              bus_salon_id: null,
              timeLineSlots: generateItems(
                this.selectedLocationObj.length,
                i => ({
                  day: null,
                  time: null,
                  location_id: this.selectedLocationObj[i].id,
                  next: false,
                })
              ),
            },
          ],
        })
      : this.setState({
          dataSource: allBusSalons
            ? [this.generateDataSourceObject('1')]
            : null,
          count: 1,
          /**timeLines is the trip instances */
          timeLines: [
            {
              key: 1,
              day: null,
              bus_salon_id: null,
              timeLineSlots: generateItems(
                this.selectedLocationObj.length,
                i => ({
                  day: null,
                  time: null,
                  location_id: this.selectedLocationObj[i].id,
                  next: false,
                })
              ),
            },
          ],
        });
  };

  busTypes = [
    ...new Set(
      this.props.allBusesQuery.allBusSalons.map(busObj => busObj.name)
    ),
  ] || ['A', 'B', 'C'];

  generateDataSourceObject = key => {
    let dataObj = {};
    this.title.map((titleName, index) => {
      dataObj[titleName] =
        titleName === 'key' ? (
          key
        ) : titleName === 'Day' ? (
          [
            <SelectInput
              options={days}
              mode="defult"
              placeholder="Select day"
              style={{ width: '120px' }}
              handleChange={value => this.handleSelectDay(value, key)}
            />,
            <Divider type="horizontal" />,
            <Checkbox onChange={e => this.onCheckTwoDays(e, key)}>
              In Two Days
            </Checkbox>,
          ]
        ) : titleName === 'Bus Salon' ? (
          <SelectInput
            options={this.busTypes}
            mode="defult"
            placeholder="Select Bus Salon"
            style={{ width: '120px' }}
            handleChange={value => this.handleSelectSalon(value, key)}
          />
        ) : (
          [this.timePicker(key, titleName)]
        );
    });
    return dataObj;
  };

  timePicker = (rowNumber, columnName, value) => (
    <TimePicker
      // defaultValue={moment('00:00', format)}
      format={format}
      onChange={(time, timeString) =>
        this.onChangeTime(time, timeString, rowNumber, columnName)
      }
      value={value}
    />
  );

  /**I just need to know the row number
   * update the day multiSelect input with the value
   */
  handleSelectDay = (day, key) => {
    const { timeLines, dataSource } = this.state;
    let tripInstance = timeLines.find(timeLine => timeLine.key == key);
    const rowIndex = timeLines.indexOf(tripInstance);
    let nextDayIndex =
      days.indexOf(day) + 1 > 6 ? days.indexOf(day) - 6 : days.indexOf(day) + 1;
    let nextDay = days[nextDayIndex];
    tripInstance.day = day;
    /**Update value of the selcet day input */
    dataSource.find(row => row.key == key).Day = [
      <SelectInput
        options={days}
        mode="defult"
        placeholder="Select day"
        style={{ width: '120px' }}
        handleChange={value => this.handleSelectDay(value, key)}
        value={day}
      />,
      <Divider type="horizontal" />,
      <Checkbox onChange={e => this.onCheckTwoDays(e, key)}>
        In Two Days
      </Checkbox>,
    ];
    timeLines.splice(rowIndex, 1, {
      ...timeLines[rowIndex],
      day,
    });
    tripInstance.timeLineSlots.map(timeLineObject => {
      timeLineObject.day = day;
      if (timeLineObject.next) {
        timeLineObject.day = nextDay;
      }
    });
    this.updateTimeLinesParent(timeLines);
    this.setState({
      timeLines,
    });
  };

  handleSelectSalon = (bus_salon_type, key) => {
    const { timeLines, dataSource } = this.state;
    const { allBusSalons } = this.props.allBusesQuery;
    let tripInstance = timeLines.find(trip => trip.key == key);
    const rowIndex = timeLines.indexOf(tripInstance);
    /**Update value of the selcet day input */
    dataSource[rowIndex]['Bus Salon'] = (
      <SelectInput
        options={this.busTypes}
        mode="defult"
        placeholder="Select Bus Salon"
        style={{ width: '120px' }}
        handleChange={value => this.handleSelectSalon(value, key)}
        value={bus_salon_type}
      />
    );
    let selectedBus = allBusSalons.find(
      busObj => busObj.name === bus_salon_type
    );
    timeLines.splice(rowIndex, 1, {
      ...timeLines[rowIndex],
      bus_salon_id: selectedBus.id,
    });
    /**Send the unique bus types to the trip composer */
    this.props.getBuses(this.getUniqueBusTypes());
    this.updateTimeLinesParent(timeLines);
    this.setState({
      timeLines,
    });
  };

  getUniqueBusTypes = () => {
    const { allBusSalons } = this.props.allBusesQuery;
    const { timeLines } = this.state;
    let allBusTypesId = timeLines.map(row => row.bus_salon_id);
    let uniqueBusTypesId = [...new Set(allBusTypesId)].filter(
      bus => bus !== null
    );
    return allBusSalons.filter(busObj => uniqueBusTypesId.includes(busObj.id));
  };

  onCheckTwoDays = (e, key) => {
    const { dataSource, timeLines } = this.state;
    // const rowIndex = parseInt(key) - 1;
    // let orignalRow = { ...dataSource[rowIndex] };
    let orignalRow = dataSource.find(row => row.key == key);
    let rowIndex = dataSource.indexOf(dataSource.find(row => row.key == key));
    let removeNextDayCheckbox = {};
    let addNextDayCheckbox = {};

    /**Copy orignalRow object in addNextDayCheckbox by value even for the array insisde the object*/
    let getAddNextDayCheckbox = () => {
      Object.keys(orignalRow).forEach(objKey => {
        if (this.locations_name.includes(objKey)) {
          addNextDayCheckbox[objKey] = [
            ...orignalRow[objKey],
            <Divider type="horizontal" />,
            <Checkbox onChange={e => this.onCheckNextDay(e, key, objKey)}>
              Next Day?
            </Checkbox>,
          ];
        } else {
          addNextDayCheckbox[objKey] = orignalRow[objKey];
        }
      });
      addNextDayCheckbox.Day.pop();
      addNextDayCheckbox.Day = [
        ...addNextDayCheckbox.Day,
        <Checkbox onChange={e => this.onCheckTwoDays(e, key)} checked={true}>
          In Two Days
        </Checkbox>,
      ];

      return addNextDayCheckbox;
    };

    let getRemoveNextDayCheckbox = () => {
      Object.keys(orignalRow).forEach(key => {
        if (this.locations_name.includes(key)) {
          removeNextDayCheckbox[key] = [...orignalRow[key]];
          removeNextDayCheckbox[key].pop();
          removeNextDayCheckbox[key].pop();
        } else {
          removeNextDayCheckbox[key] = orignalRow[key];
        }
      });
      removeNextDayCheckbox.Day.pop();
      removeNextDayCheckbox.Day = [
        ...removeNextDayCheckbox.Day,
        <Checkbox onChange={e => this.onCheckTwoDays(e, key)} checked={false}>
          In Two Days
        </Checkbox>,
      ];
      return removeNextDayCheckbox;
    };

    let newDataSource = [...dataSource];
    /** Replace checked item of the newDataSource with the new one */
    e.target.checked
      ? newDataSource.splice(rowIndex, 1, getAddNextDayCheckbox())
      : newDataSource.splice(rowIndex, 1, getRemoveNextDayCheckbox());
    this.setState({
      dataSource: [...newDataSource],
    });
  };

  // [TODO] inhance on check one => check all after this one
  onCheckNextDay = (e, key, columnName) => {
    const { timeLines, dataSource } = this.state;
    const rowIndex = dataSource.indexOf(dataSource.find(row => row.key == key));
    let targetSlotIndex = this.locations_name.indexOf(columnName);
    let targetSlot = timeLines[rowIndex].timeLineSlots[targetSlotIndex];
    let thisDay = days[days.indexOf(timeLines[rowIndex].day)] || null;
    let nextDayIndex =
      days.indexOf(thisDay) + 1 > 6
        ? days.indexOf(thisDay) - 6
        : days.indexOf(thisDay) + 1;
    let nextDay = thisDay ? days[nextDayIndex] : null;
    if (e.target.checked) {
      targetSlot.day = nextDay;
      targetSlot.next = true;
    } else {
      targetSlot.day = thisDay;
      targetSlot.next = false;
    }
    this.updateTimeLinesParent(timeLines);
    this.setState({ timeLines });
  };

  /**Generate timeline object for new rows */
  createNewTimelineObj = (timeLinesLength, count, key, timeLinesArray) => {
    while (timeLinesLength !== count) {
      timeLinesArray.push({
        key: key,
        day: null,
        bus_salon_id: null,
        timeLineSlots: generateItems(this.selectedLocationObj.length, i => ({
          day: null,
          time: null,
          location_id: this.selectedLocationObj[i].id,
          next: false,
        })),
      });
      timeLinesLength++;
    }
    return timeLinesArray;
  };

  /**Update timeLineSlots on time change in the state
   * [TODO] location_id is id not string
   * @method
   * @param {object} time
   * @param {string} timeString
   * @param {string} key - Row number
   * @param {string} columnName - column title [TODO] should be columnID
   * @returns {undefined}
   */
  onChangeTime = (time, timeString, key, columnName) => {
    const { timeLines, dataSource } = this.state;
    let tripInstance = timeLines.find(trip => trip.key == key);
    let targetSlotIndex = this.locations_name.indexOf(columnName);
    let targetSlot = tripInstance.timeLineSlots[targetSlotIndex];
    let newSlot = { ...targetSlot, time: timeString.concat(':00') };
    let newTimePicker = this.timePicker(key, columnName, time);

    tripInstance.timeLineSlots.splice(targetSlotIndex, 1, newSlot);
    dataSource[parseInt(key) - 1][columnName].splice(0, 1, newTimePicker);

    this.updateTimeLinesParent(timeLines);
    this.setState({ timeLines, dataSource });
  };

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    const timeLines = [...this.state.timeLines];
    this.setState(
      {
        dataSource: dataSource.filter(item => item.key !== key),
        timeLines: timeLines.filter(item => item.key != key),
        count: this.state.count - 1,
      },
      () => {
        this.props.getBuses(this.getUniqueBusTypes());
        this.updateTimeLinesParent(timeLines);
      }
    );
  };

  /**Copy specific row data and Add row to the end of the table by updating state of EditableTable component with new dataSource.
   * [TODO] Handle repeat after delete errors
   * [TODO] Handle repeat key on callback methods
   *
   * @method
   * @returns {undefined}
   */
  repeateRow = key => {
    const { count, dataSource } = this.state;
    // const repeatedData = {
    //   ...dataSource[parseInt(key) - 1],
    //   key: (parseInt(dataSource[count - 1].key) + 1).toString(),
    // };
    console.log('repeat key:', key);
    const repeatedData = this.generateDataSourceObject(
      (parseInt(key) + 1).toString()
    );
    console.log('repeatedData:', repeatedData);
    // this.setState({
    //   dataSource: [...dataSource, repeatedData],
    //   count: count + 1,
    // });
  };

  //[TODO] if any data equal null don't send it to the parent
  updateTimeLinesParent = timeLines => {
    let readyTimeLinesSlots = {
      create: generateItems(timeLines.length, i => ({
        bus_salon_id: timeLines[i].bus_salon_id,
        timeLineSlots: {
          create: generateItems(timeLines[i].timeLineSlots.length, j => ({
            day: timeLines[i].timeLineSlots[j].day,
            time: timeLines[i].timeLineSlots[j].time,
            location_id: timeLines[i].timeLineSlots[j].location_id,
          })),
        },
      })),
    };
    this.props.getTimeLines(readyTimeLinesSlots);
  };

  handleAdd = () => {
    const { count, dataSource, timeLines } = this.state;
    let rowKeysArray = dataSource.map(row => parseInt(row.key));
    /**In case deleting instance key will not be incremental on count or key
     * it will be addition to the max key exist
     */
    const keyNumeric = Math.max(...rowKeysArray) + 1;
    const key = keyNumeric.toString();
    const newData = this.generateDataSourceObject(key);
    this.createNewTimelineObj(
      timeLines.length,
      count + 1,
      keyNumeric,
      timeLines
    );
    this.updateTimeLinesParent(timeLines);
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
      timeLines,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = arr1.length; i--; ) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  componentWillReceiveProps(nextProps) {
    let arraysEqual = this.arraysEqual(
      this.props.locations_name,
      nextProps.locations_name
    );
    if (
      nextProps.locations_name.length !== this.props.locations_name.length ||
      !arraysEqual
    ) {
      this.getInitalState(nextProps, false);
    }
  }

  render() {
    console.log('render EditableTable');
    const { dataSource } = this.state;
    const { allBusSalons, error, loading } = this.props.allBusesQuery;
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return loading ? (
      <div>Loading...</div>
    ) : error ? (
      <div>
        {error.graphQLErrors.map(({ message }, i) => (
          <span key={i}>{message}</span>
        ))}
      </div>
    ) : (
      <div>
        <Table
          // components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ x: true }}
        />
        <div style={{ textAlign: 'right', padding: '20px 0' }}>
          <Button
            onClick={this.handleAdd}
            type="primary"
            style={{ marginBottom: 16 }}
          >
            Add a row
          </Button>
          <p>The Number of Trips Instance: {this.state.count}</p>
        </div>
      </div>
    );
  }
}

export default EditableTable;
