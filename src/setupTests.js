// react-testing-library renders your components to document.body,
// this will ensure they're removed after each test.

import 'react-testing-library/cleanup-after-each';

// this adds jest-dom's custom matchers
import 'jest-dom/extend-expect';


// some global test data for all your tests

global.questionsTestData = [];

global.testPostResume = {
    "date": "2019-04-29T20:41:24.580Z",
    "_id": "5cc7617915a4f30017e92894",
    "author": "Emil",
    "title": "Will this form work?",
    "body": "I hope it will",
    "upvotes": 10,
    "downvotes": 1,
    "comments": {},
    "__v": 0
};

