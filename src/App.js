import { Component } from "react";
import { NotificationContainer } from 'react-notifications';

import { LoadingContextProvider } from "./Context/LoadingContext";
import { ButtonContextProvider } from "./Context/ButtonContext";

import Cars from "./Pages/Cars/";

import 'react-notifications/lib/notifications.css';


class App extends Component {
  render() {
    return (
      <LoadingContextProvider>
        <ButtonContextProvider>
          <div className="row m-2">
            <div className="col-md-12">
              <Cars />
            </div>
          </div>
          <NotificationContainer />
        </ButtonContextProvider>
      </LoadingContextProvider>
    )
  }
}

export default App
