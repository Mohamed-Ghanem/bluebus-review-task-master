import React, { Component } from 'react';
import styled from '@emotion/styled/macro';
import PropTypes from 'prop-types';

import { PrimaryButton, PrimaryTitle } from '@components';
import { colors } from '@utilities';

const ListHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  border-bottom: 1px solid ${colors.gray};
  padding: 0 20px;
  h1 {
    margin: 15px 0;
  }
`;

class ListHeader extends Component {
  render() {
    const { listDetails, linkTo } = this.props;
    return (
      <ListHeaderContainer>
        <PrimaryTitle>{listDetails.title}</PrimaryTitle>
        <PrimaryButton href={linkTo}>{listDetails.button}</PrimaryButton>
      </ListHeaderContainer>
    );
  }
}

ListHeader.propTypes = {
  /**
   * prop pagination of type object passed from list component
   */
  listDetails: PropTypes.object,
};

export default ListHeader;
