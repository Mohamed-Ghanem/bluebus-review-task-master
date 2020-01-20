import React from 'react';
import { Popconfirm, Divider } from 'antd';
import { Mutation } from 'react-apollo';
import { handleResponse } from '@utilities';

export default function perpareTableHeaders(headerObj) {
  headerObj.columns = headerObj.columns.map(obj => {
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
      column.render = text => {
        let action;
        if (text.is_active && text.is_active === 'Inactive') {
          action = 'Activate';
        } else if (text.is_active !== 'Inactive') {
          action = 'Deactivate';
        }
        return (
          <>
            <span>
              {headerObj.viewLink && (
                <>
                  <a href={headerObj.viewLink + '/' + text.id}>View</a>
                  <Divider type="vertical" />
                </>
              )}
              {headerObj.editLink && (
                <>
                  <a href={headerObj.editLink + '/' + text.id}>Edit</a>
                  <Divider type="vertical" />
                </>
              )}
              {text.is_active && (
                <Mutation
                  mutation={
                    text.is_active === 'Inactive'
                      ? headerObj.activeMutation
                      : headerObj.deactiveMutation
                  }
                  variables={{ id: Number(text.id) }}
                  refetchQueries={() => [
                    {
                      query: headerObj.refetchQuery,
                      variables: headerObj.pagination,
                    },
                  ]}
                  onCompleted={() => {
                    handleResponse('success', action);
                  }}
                >
                  {(mutationFunc, { loading, error }) => {
                    return (
                      <>
                        <Popconfirm
                          title={
                            text.is_active === 'Inactive'
                              ? 'Sure to Activate?'
                              : 'Sure to Deactivate?'
                          }
                          onConfirm={mutationFunc}
                        >
                          <a href="#!">{action}</a>
                        </Popconfirm>

                        {loading && console.log('loading')}
                        {error && handleResponse('error', error)}
                      </>
                    );
                  }}
                </Mutation>
              )}
            </span>
          </>
        );
      };
    }

    return column;
  });

  return headerObj.columns;
}
