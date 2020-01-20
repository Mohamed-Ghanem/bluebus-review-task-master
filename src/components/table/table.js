import React, { Component } from 'react';
import { Table, Divider, Popconfirm } from 'antd';
import PropTypes from 'prop-types';

class ListTable extends Component {
  state = {
    columns: [],
  };
  componentDidMount() {
    this._perpareTableHeaders();
  }

  _perpareTableHeaders() {
    const { handleDeactivate, editLink, viewLink, handleActivate } = this.props;
    const columns = this.props.columns.map(obj => {
      const column = {};
      if (!obj.actions) {
        column.title = obj.title;
        column.dataIndex = obj.dataKey;
        column.key = obj.title;
        if (!(obj.sorting === false)) {
          if (obj.number) {
            column.sorter = (a, b) => a[obj.dataKey] - b[obj.dataKey];
          } else {
            column.sorter = (a, b) =>
              b[obj.dataKey].localeCompare(a[obj.dataKey]);
          }
          column.sortDirections = ['descend', 'ascend'];
        }
      } else {
        column.title = 'Action';
        column.key = 'action';
        if (obj.actions.edit && obj.actions.delete && obj.actions.view) {
          column.render = text => {
            return (
              <>
                <span>
                  <a href={viewLink + '/' + text.id}>View</a>
                  <Divider type="vertical" />
                  <a href={editLink + '/' + text.id}>Edit</a>
                  <Divider type="vertical" />
                  {text.is_active ? (
                    text.is_active === 'Inactive' ? (
                      <>
                        <Popconfirm
                          title="Sure to Activate?"
                          onConfirm={() => handleActivate(Number(text.id))}
                        >
                          <a href="#!">Activate</a>
                        </Popconfirm>
                      </>
                    ) : (
                      <>
                        <Popconfirm
                          title="Sure to Deactivate?"
                          onConfirm={() => handleDeactivate(Number(text.id))}
                        >
                          <a href="#!">Deactivate</a>
                        </Popconfirm>
                      </>
                    )
                  ) : (
                    ''
                  )}
                </span>
              </>
            );
          };
        } else if (obj.actions.edit && obj.actions.delete) {
          column.render = text => {
            return (
              <>
                <span>
                  <a href={editLink + '/' + text.id}>Edit</a>

                  {text.is_active ? (
                    text.is_active === 'Inactive' ? (
                      <>
                        <Divider type="vertical" />
                        <Popconfirm
                          title="Sure to Activate?"
                          onConfirm={() => handleActivate(Number(text.id))}
                        >
                          <a href="#!">Activate</a>
                        </Popconfirm>
                      </>
                    ) : (
                      <>
                        <Divider type="vertical" />
                        <Popconfirm
                          title="Sure to Deactivate?"
                          onConfirm={() => handleDeactivate(Number(text.id))}
                        >
                          <a href="#!">Deactivate</a>
                        </Popconfirm>
                      </>
                    )
                  ) : (
                    ''
                  )}
                </span>
              </>
            );
          };
        } else if (!obj.actions.edit) {
          column.render = text => {
            return (
              <>
                <span>
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => handleDeactivate(Number(text.id))}
                  >
                    <a href="#!">Delete</a>
                  </Popconfirm>
                </span>
              </>
            );
          };
        } else if (!obj.actions.delete) {
          column.render = text => {
            return (
              <>
                <span>
                  <a href={editLink + '/' + text.id}>Edit</a>
                </span>
              </>
            );
          };
        }
      }
      return column;
    });
    this.setState({ columns });
  }
  render() {
    const { columns } = this.state;
    const { data, handleTableChange, pagination, loading } = this.props;
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    );
  }
}

ListTable.propTypes = {
  /**
   * prop data of type array passed from list component
   * prop columns of type array passed from list component
   * prop handleTableChange of type funcation passed from list component
   * prop pagination of type object passed from list component
   * prop loading of type boolen passed from list component
   */
  data: PropTypes.array,
  columns: PropTypes.array,
  handleTableChange: PropTypes.func,
  loading: PropTypes.bool,
};

export default ListTable;

//TODO refactor if contains, it is beast of shit
