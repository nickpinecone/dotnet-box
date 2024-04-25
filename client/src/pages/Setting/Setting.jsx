import SettingComponent from '../../components/settings/Settings'
import Header from '../../components/header/header';

import './Setting.css'


function Setting() {
    return (
      <main class="container">
        <Header/>
        <SettingComponent/>
      </main>
    );
  }

export default Setting;