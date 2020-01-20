import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '@images/logo.svg';
import ATypicalMenuItem from './menu-item';
import routes from './routes';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

class AppLayout extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    const { children } = this.props;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{ background: '#F2F2F2', paddingTop: 10, paddingLeft: 10 }}
        >
          <Link to="/">
            <Logo />
          </Link>
        </Header>
        <Layout>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['0']} mode="inline">
              {routes.map((route, routeIndex) => {
                if (typeof route.to === 'string') {
                  return (
                    <ATypicalMenuItem
                      key={routeIndex}
                      index={routeIndex}
                      routeName={route.name}
                      routeDestination={route.to}
                    />
                  );
                }
                return (
                  <SubMenu key={routeIndex} title={<span>{route.name}</span>}>
                    {route.to.map((subRoute, subRouteIndex) => {
                      const subRouteKey = routeIndex ** (subRouteIndex + 1);
                      return (
                        <ATypicalMenuItem
                          key={subRouteKey}
                          index={subRouteKey}
                          routeName={subRoute.name}
                          routeDestination={subRoute.to}
                        />
                      );
                    })}
                  </SubMenu>
                );
              })}
            </Menu>
          </Sider>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default AppLayout;
