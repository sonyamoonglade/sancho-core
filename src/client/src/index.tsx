import React from "react";
import ReactDOM from "react-dom/client";
import "./variables.scss";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux";
import { BrowserRouter } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
   <DndProvider backend={HTML5Backend}>
      <Provider store={store}>
         <BrowserRouter>
            <App />
         </BrowserRouter>
      </Provider>
   </DndProvider>
);
