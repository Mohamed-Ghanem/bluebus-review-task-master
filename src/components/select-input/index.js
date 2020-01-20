import React, { Component } from 'react';
import { Select } from 'antd';

class MultipleSelect extends Component {
  state = { selectedItems: [] };

  handleChange = selectedItems => {
    this.setState({ selectedItems });
  };

  render() {
    /** Extracting multiple values from MultipleSelect.props object
     *
     * @param {Array} options
     * @param {String} mode
     * @param {String} placeholder
     * @param {Array} [value]
     * @param {Function} [handleChange]
     * @param {Object} style - Can be empty object
     * @param {Array} selectedCities
     */
    const {
      options,
      mode,
      placeholder,
      value,
      handleChange,
      style,
      selectedCities,
      ...props
    } = this.props;

    const { selectedItems } = this.state;

    let arrayToFilter = selectedCities || selectedItems;

    /** Hide what you Select from the options, if it's multiple select
     * @param {String} mode
     * @method
     * @returns {Array} options of the select input field
     */
    const filteredOptions =
      mode === 'multiple'
        ? options.filter(option => !arrayToFilter.includes(option))
        : options;

    return (
      <Select
        mode={mode}
        placeholder={placeholder}
        value={value || this.state.selectedItems}
        onChange={handleChange || this.handleChange}
        style={style}
        {...props}
      >
        {filteredOptions.map(item => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default MultipleSelect;
