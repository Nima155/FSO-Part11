// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent } from '@testing-library/react';

export function simulateClick(buttonText, component, numberOfClicks) {
  // get button
  const button = component.getByText(buttonText);
  // simulate clicks
  for (let i = 0; i < numberOfClicks; i += 1) {
    fireEvent.click(button);
  }
}
export default simulateClick;
