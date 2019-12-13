import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from '../pages/Home.page';
import OrderbooksPage from '../pages/Orderbooks.page';
import OpportunitiesPage from '../pages/Opportunities.page';

const MainLayoutPart = () => (
  <main>
    <Switch>
      <Route exact path='/' component={HomePage} />
      <Route exact path='/orderbooks' component={OrderbooksPage} />
      <Route exact path='/opportunities' component={OpportunitiesPage} />
    </Switch>
  </main>
)

export default MainLayoutPart;