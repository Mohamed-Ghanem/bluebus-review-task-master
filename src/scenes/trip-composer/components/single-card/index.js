import React, { Component } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Checkbox } from 'antd';
import { applyDrag, generateItems } from '../utils';
import './single-card.css';

class SingleCard extends Component {
  state = {
    column: {},
    selectedLocations: [],
  };

  getCardPayload = index => {
    return this.state.column.children[index];
  };

  /** Visually differ the stations from the stop points
   * [TODO] Add colors according to type (Stop/ Station) -> [Inhancement]
   * [TODO] this effect thr background property in the updateCardData method
   * @param {number} arrayIndex [TODO] I need to get the id of the location to get it's type
   * @returns {String} cardColors[isStop] - Color from cardColors
   */
  // const cardColors = ['bisque', 'burlywood'];
  // pickColor = arrayIndex => {
  //   let isStop = this.props.allLocations[arrayIndex].type === 'Stop' ? 0 : 1;
  //   return cardColors[isStop];
  // };

  /** Handle onDrop Locations, Update the state with the new order of the locations after swapping.
   *
   * @param {object} dropResult - The onDrop event.
   * @method
   * @returns {undefined}
   */
  onCardDrop = dropResult => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      const { column } = this.state;
      const newColumn = { ...column };
      newColumn.children = applyDrag(newColumn.children, dropResult);
      let selectedLocations = this.getUpdatedSelectedLocationArrange(newColumn);
      this.setState({
        column: newColumn,
        selectedLocations,
      });
    }
  };

  /** Update the state of selected locations array, send the updated locations and its city to the Trip composer.
   *
   * @param {String} data - Checked Location Name
   * @param {object} e - The onCheck event
   * @method
   * @returns {undefined}
   */
  onChangeCheckbox = (data, e) => {
    const { children } = this.state.column;
    let newChilderin = children.map(child => {
      /**Handle Check and uncheck */
      if (child.data === data && !child.checked) {
        child.checked = true;
      } else if (child.data === data && child.checked) {
        child.checked = false;
      }
      return child;
    });
    /**Get Selected locations from updated locations object */
    let selected = newChilderin.filter(ch => ch.checked);
    let selectedLocations = selected.map(i => i.data);
    this.setState({ selectedLocations });
    this.props.getLocations(selectedLocations, this.props.city);
  };

  /** Handle rendring locaions according to the city
   *
   * @param {String} city
   * @method
   * @returns {Array} locations
   */
  getCityLocations(city) {
    let locations = [];
    const { activeLocations } = this.props;
    locations = activeLocations
      .filter(locationsObj => locationsObj.city.name_en === city)
      .map(locationObj => locationObj.name_en);
    return locations;
  }

  /** Search in array of objects by city name
   *
   * @method
   * @param {Array} arrayofObjs - Array ob objects [{city, locations}]
   * @param {String} City
   * @param {*} elseReturn - return of else statement
   * @returns {Array} locations - on if statement
   * @returns {*} elseReturn - on else statement
   */
  findLocationsObjByCity(arrayofObjs, city, elseReturn) {
    let cityExist = arrayofObjs.find(cityObj => cityObj.city === city);
    return cityExist ? cityExist.locations : elseReturn;
  }

  /**Generate the object that will Drow the city card and save it in the state.
   *
   * @param {Object} data - props
   * @returns {undefined}
   */
  updateCardData = data => {
    let savedArrangedLocations = this.findLocationsObjByCity(
      data.lastLocationsArrange,
      data.city,
      undefined
    );
    let locations = savedArrangedLocations || this.getCityLocations(data.city);
    this.setState({
      column: {
        /** Generate general card properties */
        id: `column${data.city}`,
        type: 'container',
        name: data.city || null,
        props: {
          orientation: 'vertical',
          className: 'card-container',
          lockAxis: 'y',
        },
        /** Generate Locations objects */
        children: generateItems(locations.length, j => ({
          type: 'draggable',
          id: `${data.city}_${locations[j]}`,
          /**Set checked true or false according to selectedLocations of the props
           *
           * @function
           * @param {Array} data.selectedLocations - Selected locations of the props
           * @param {String} data.city - City of the Props
           * @param {Boolean} - if not exist return false
           * @returns {Boolean}
           */
          checked: this.findLocationsObjByCity(
            data.selectedLocations,
            data.city,
            false
          )
            ? this.findLocationsObjByCity(
                data.selectedLocations,
                data.city,
                false
              ).includes(locations[j])
            : false,
          props: {
            className: 'card',
            style: { backgroundColor: 'bisque' },
          },
          data: locations[j],
        })),
      },
      /** Get Selected locations from the props if it exist, if not set it with empty array
       *
       * @function
       * @param {Array} data.selectedLocations - Selected location from the props
       * @param {String} data.city - City of the props
       * @returns {Array} locations| [] - Locations of the city | []
       */
      selectedLocations: data.selectedLocations.find(
        cityObj => cityObj.city === data.city
      )
        ? data.selectedLocations.find(cityObj => cityObj.city === data.city)
            .locations
        : [],
    });
  };

  /**Send arranged locations to the parent.
   *
   * @method
   * @param {Object} column - locations object
   * @returns {undefined}
   */
  getAllArrangedLocations(column) {
    const { children, name } = column;
    let arrangedLocations = children.map(locObj => locObj.data);
    this.props.getLastLocationsArrange(arrangedLocations, name);
  }

  /** Call getAllArrangedLocations and send [TODO] continue docs here
   * @method
   * @param {Object} column - Locations Object
   */
  getUpdatedSelectedLocationArrange = column => {
    this.getAllArrangedLocations(column);
    // Selected locations Read from the column objct not the selected location array
    let locations = column.children;
    let selectedLocations = locations
      .filter(loc => loc.checked)
      .map(locObj => locObj.data);
    this.props.getLocations(selectedLocations, column.name);
    return selectedLocations;
  };

  componentWillReceiveProps = nextProps => {
    this.updateCardData(nextProps);
  };

  componentDidMount() {
    this.updateCardData(this.props);
  }

  render() {
    const { column } = this.state;
    return column.children ? (
      <Draggable>
        <div className={column.props.className}>
          <div className="card-column-header">
            <span className="column-drag-handle">&#x2630;</span>
            {column.name}
          </div>
          <Container
            {...column.props}
            groupName="col"
            onDrop={e => this.onCardDrop(e)}
            getChildPayload={index => this.getCardPayload(index)}
            dragClass="card-ghost"
            dropClass="card-ghost-drop"
          >
            {column.children.map(card => {
              return (
                <Draggable key={card.id}>
                  <div {...card.props}>
                    <Checkbox
                      onChange={e => {
                        this.onChangeCheckbox(card.data, e);
                      }}
                    >
                      {card.data}
                    </Checkbox>
                  </div>
                </Draggable>
              );
            })}
          </Container>
        </div>
      </Draggable>
    ) : null;
  }
}

export default SingleCard;
