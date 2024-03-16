import './App.css';

import MainPage from './MainPage';
import * as style from './style';

const App = () => {
  document.title = "homete";
  return (
    <>
      <header className={style.header}>homete</header>
      <MainPage />
    </>
  );
};

export default App;
