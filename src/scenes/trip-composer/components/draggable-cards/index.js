import React, { Component } from 'react';
import { Container } from 'react-smooth-dnd';
import SingleCard from '../single-card';
import { applyDrag, generateItems } from '../utils';

class Cards extends Component {
  state = {
    scene: {
      type: 'container',
      props: {
        orientation: 'horizontal',
      },
      children: [],
    },
  };

  lastLocationsArrange = [];

  //Helper methods
  onColumnDrop = dropResult => {
    //No State Change but the props values changed
    const { scene } = this.state;
    scene.children = applyDrag(scene.children, dropResult);
    let arrangedCities = scene.children.map(child => child.name);
    this.props.getCities(arrangedCities);
  };

  updateCards(selectedCities) {
    let arrangedCities = selectedCities;
    this.setState({
      scene: {
        ...this.state.scene,
        // Draw cards
        children: generateItems(arrangedCities.length, i => ({
          id: arrangedCities[i],
          name: arrangedCities[i] || null,
        })),
      },
    });
  }

  /** Add or Update locations of specific city
   *
   * @method
   * @param {String} city
   * @param {Array} citiesList - Array of objects, ex: [{city: 'Cairo', locations: ['Maadi', 'Naser City']}]
   * @param {Array} locations
   * @returns {Array} citiesList - Updated cities list
   */
  updateLocationsArray(city, citiesList, locations) {
    let isCityExist = citiesList.find(cityObj => cityObj.city === city);
    isCityExist
      ? (isCityExist.locations = locations)
      : (citiesList = [...citiesList, { city, locations }]);
    return citiesList;
  }

  getLastLocationsArrange = (allLocations, city) => {
    this.lastLocationsArrange = this.updateLocationsArray(
      city,
      this.lastLocationsArrange,
      allLocations
    );
  };

  componentWillReceiveProps = nextProps => {
    //if selectedCities is the same length do not update card
    if (nextProps.selectedCities.length !== this.props.selectedCities.length) {
      this.updateCards(nextProps.selectedCities);
    }
  };

  componentDidMount() {
    this.updateCards(this.props.selectedCities);
  }

  render() {
    const { scene } = this.state;
    const { getLocations, selectedLocations, activeLocations } = this.props;
    return (
      <div>
        <div className="card-scene">
          <Container
            orientation="horizontal"
            onDrop={this.onColumnDrop}
            dragHandleSelector=".column-drag-handle"
          >
            {scene.children.map(column => {
              return (
                <SingleCard
                  city={column.name}
                  key={column.id}
                  getLocations={getLocations}
                  selectedLocations={selectedLocations}
                  getLastLocationsArrange={this.getLastLocationsArrange}
                  lastLocationsArrange={this.lastLocationsArrange}
                  activeLocations={activeLocations}
                />
              );
            })}
          </Container>
        </div>
      </div>
    );
  }
}

export default Cards;
