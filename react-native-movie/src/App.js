import React,{useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import MovieStack from "../navigation/MovieStack";
import DrawerNavigator from "../navigation/Drawer";
import { AppContext } from "../context/AppContext";

const App = () => {
    const [user, setUser] = useState(null)
    return(
        <AppContext.Provider value={{user,setUser}}>
            <NavigationContainer>
                <DrawerNavigator/>
            </NavigationContainer>
        </AppContext.Provider>
    )
}

export default App;