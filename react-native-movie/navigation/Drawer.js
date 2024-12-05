import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screen/HomeScreen";
import MainScreen from "../screen/MainScreen";
import DetailScreen from "../screen/DetailScreen";
import LoginScreen from "../screen/LoginScreen";
import SignupScreen from "../screen/SignupScreen";
import { TouchableOpacity } from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Image,Text,View,StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const StackDetailNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} 
            options={{ headerShown: false,  }}/>
        <Stack.Screen name="Detail" component={DetailScreen} 
            options={{ headerShown: false, }}/>
      </Stack.Navigator>
    );
  };
  const StackLoginNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} 
            options={{ headerShown: false,  }}/>
        <Stack.Screen name="Signup" component={SignupScreen} 
            options={{ headerShown: false,  }}/>
        {/* <Stack.Screen name="FindId" component={FindIdScreen} 
            options={{ headerShown: false,  }}/>
        <Stack.Screen name="FindPwd" component={FindPwdScreen} 
            options={{ headerShown: false,  }}/> */}
      </Stack.Navigator>
    );
  };




const DrawerNavigator = () => {
    const { user, setUser } = useContext(AppContext);
    const navigation = useNavigation();

    // 로그인 버튼 클릭 시
    const navigateToLoginScreen = () => {
        navigation.navigate("Login") // LoginScreen으로 이동
    }
    
    // 로그아웃 버튼 클릭 시
    const handleLogout = () => {
        setUser(null)
        alert("Logout")
    }

    return(
        <Drawer.Navigator
            screenOptions={({navigation})=> ({
                drawerStyle:{backgroundColor: 'black',
                    width:180, 
                },
                drawerLabelStyle:{fontSize:16},
                drawerActiveTintColor:'#4caf50',  
                drawerInactiveTintColor: '#757575', 
                drawerPosition:'right',
                headerLeft: () => (
                    null
                ),
                headerRight: () =>(
                    <View style={styles.container}>
                    <TouchableOpacity onPress={user ? handleLogout : navigateToLoginScreen}>
                        <Text style={styles.loginbutton}>
                            {user ? "Logout" : "Login"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toggle} onPress={()=>navigation.toggleDrawer()}>
                        <MaterialCommunityIcons name="menu" size={28} color="#Fff" />
                    </TouchableOpacity>
                    </View>
                ),
                drawerType:'slide' ,
                
            })}
        >
            <Drawer.Screen name="Main" component={MainScreen} 
                    options={{ headerShown: false,  }}/>

            <Drawer.Screen name="Home" component={StackDetailNavigator}
                    options={{
                        headerTitle:() => {
                            const navigation = useNavigation();
                            return(
                            <TouchableOpacity onPress={()=>navigation.navigate('Home')}>
                                <Image
                                    source={require('../images/logo.png')}
                                    style={styles.logo}
                                />
                            </TouchableOpacity>
                            )
                        },
                        headerTintColor : '#fff',
                        headerStyle:{
                            backgroundColor:'black',
                            height:70,
                        },
                    }} />

            <Drawer.Screen name="Login" component={StackLoginNavigator}
                    options={{
                        headerTitle:() => {
                            const navigation = useNavigation();
                            return(
                            <TouchableOpacity onPress={()=>navigation.navigate('Home')}>
                                <Image
                                    source={require('../images/logo.png')}
                                    style={styles.logo}
                                />
                            </TouchableOpacity>
                            )
                        },
                        headerTintColor : '#fff',
                        headerStyle:{
                            backgroundColor:'black',
                            height:90,
                        },
                        
                    }}/>
            {/* <Drawer.Screen name="Detail" component={DetailScreen}
                options={{title:'MovieDetail', headerShown: false,  }}/> */}
            {/*
            
            <Drawer.Screen name="Main" component={MainScreen} 
                    options={{ headerShown: false,  }}/>

            <Drawer.Screen name="Main" component={MainScreen}
                    options={{title:'SignUp'}}/>

            <Drawer.Screen name="Main" component={MainScreen}
                    options={{title:'찜목록'}}/>

             */}
        </Drawer.Navigator>
    )
}

const styles =StyleSheet.create({
    container:{
        flexDirection:'row',
    },
    loginbutton:{
        color:'white',
        width:60,
        height:20,
        backgroundColor:'red',
        textAlign: 'center',
        fontSize: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:5,
        marginRight:5
        
    },
    toggle:{
        marginRight:15,
    },
    logo:{
        width: 140,
        height:100,
        flex:1,
        padding:20,
        marginTop:2,
    }
})




export default DrawerNavigator;