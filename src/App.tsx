import React from 'react';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from "./pages/Home";
import Update from "./pages/Update";


function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/"  element={<Home/>}/>
                    <Route path="/update" element={<Update/>}/>
                </Routes>
            </Router>
        </>
    );

}

export default App;
