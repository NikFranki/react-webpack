import React from 'react';
import { Provider } from 'mobx-react';
import * as stores from '../store';
import routes from '../routes';

const AppContainer = () => <Provider store={stores}>{routes}</Provider>;

export default AppContainer;
