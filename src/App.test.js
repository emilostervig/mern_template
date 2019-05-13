import React from 'react';
import {render, fireEvent, cleanup} from 'react-testing-library';
import App from './App.js';

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

it('renders App with header text', () => {
    const {getByText} = render(<App/>);
    expect(getByText(/Latest questions/i)).toBeInTheDocument();
});

