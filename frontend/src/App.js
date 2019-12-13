import React from 'react';
import HeaderLayoutPart from './layout-parts/Header.layoutpart';
import MainLayoutPart from './layout-parts/Main.layoutpart';

const App = () => (
  <div>
    <HeaderLayoutPart />
    <div className="container-fluid">
      <MainLayoutPart />
    </div>
  </div>
)

export default App;