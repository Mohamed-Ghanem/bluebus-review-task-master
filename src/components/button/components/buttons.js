import styled from '@emotion/styled/macro';
import { colors } from '../../../utilities/theme';

/**
 * Base style for button component which change padding based on size prop(largeButton, mediumButton, smallButton)
 */

const Button = styled.a`
  min-width: 250px;
  border-radius: 0;
  font-size: 16px;
  padding: 0 30px;
  line-height: 1;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  color: #fff;
  &:focus {
    outline: none;
  }
`;

/**
 * Styled component which inherit style of Button and change its background color to the secondary color
 */

const PrimaryButton = styled(Button)`
  min-width: 170px;
  background-color: ${colors.primaryColor};
  border-color: ${colors.primaryColor};
  border-radius: 0;
  padding: 15px 50px;
  max-height: 50px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

/**
 * Styled component which inherit style of Button and change its text and border color to the pirmary color
 */

const SecondaryButton = styled(Button)`
  min-width: 100px;
  background-color: ${colors.gary};
  border-color: ${colors.gary};
  padding: 15px 35px;
`;

export { PrimaryButton, SecondaryButton };

// TODO: Add hover, active, focus and disabled state for the buttons.
