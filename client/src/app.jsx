import {BrowserRouter,Routes,Route} from "react-router-dom";

import Login from "./Login";
import Message from "./message";
import Home from "./Home";
import Register from "./Register";
import Forgotpassword from "./forgotpassword";
import  store  from './redux/store' // if export is default then any name can be used to import .otherwise {} ke andar wahi naam do
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from "@react-oauth/google";
function App() {
    return <>
     <Provider store={store}>
     <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
<BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/forgot-password" element={<Forgotpassword/>}></Route>
    </Routes>
</BrowserRouter>
</GoogleOAuthProvider>
</Provider>

</>
    }

export default App;