import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

const { Item: MenuItem } = Menu;

const ATypicalMenuItem = ({ key, routeName, routeDestination, ...props }) => (
  <MenuItem key={key} {...props}>
    <Link
      style={{
        color: 'rgba(255, 255, 255, 0.65)',
      }}
      to={routeDestination}
    >
      <span>{routeName}</span>
    </Link>
  </MenuItem>
);

export default ATypicalMenuItem;
