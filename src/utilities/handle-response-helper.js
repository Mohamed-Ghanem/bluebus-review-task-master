import { notification } from 'antd';

export default function handleResponse(type, response, message) {
  console.log(type);
  if (type === 'error') {
    if (response.graphQLErrors && response.graphQLErrors.length) {
      let gqlErrorValidationMessage = response.graphQLErrors.map(
        ({ category, extensions, message }, i) => {
          return category === 'validation' &&
            extensions.validation[Object.keys(extensions.validation)]
            ? extensions.validation[
                Object.keys(extensions.validation)
              ].toString()
            : message;
        }
      );
      notification[type]({
        message: 'Validation Error',
        description: message || gqlErrorValidationMessage,
      });
    }
  } else if (type === 'success') {
    notification[type]({
      message: message,
      description: response,
    });
  }
}
