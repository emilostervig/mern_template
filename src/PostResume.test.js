import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {render, fireEvent, cleanup} from 'react-testing-library';
import PostResume from './PostResume.js';

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

it('render component PostResume', () => {
    const comp = <Router>
        <PostResume post={testPostResume} formatDate={jest.fn()}/>
    </Router>;

    const {getByText} = render(comp);

    expect(getByText(/Read more/i)).toBeInTheDocument();
});