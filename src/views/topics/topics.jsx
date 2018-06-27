import React from 'react';
import {
    Route,
    Link
} from 'react-router-dom';

const Topics = ({ match }) => (
    <div>
        <h2>Topics</h2>
        <ul>
            <li>
                <Link to={`${match.path}/rendering`}>Rendering with React</Link>
            </li>
            <li>
                <Link to={`${match.path}/components`}>Components</Link>
            </li>
            <li>
                <Link to={`${match.path}/props-v-state`}>Props v. State</Link>
            </li>
        </ul>

        <Route path={`${match.path}/:topicId`} component={Topic}></Route>
        <Route
         exact
         path={match.path}
         render={() => <h3>Please select a topics.</h3>}>
        </Route>
    </div>
);

const Topic = ({ match }) => (
    <div>
        <h3>{match.params.topicId}</h3>
    </div>
);

export default Topics;
