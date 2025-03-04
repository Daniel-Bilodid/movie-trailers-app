import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Nav from "./components/nav/Nav";

import { AuthProvider } from "./components/context/AuthContext";

import { Provider } from "react-redux";
import store from "./redux/store";

import AnimatedRoute from "./components/animatedRoute/AnimatedRoute";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Nav />
            <AnimatedRoute />
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
