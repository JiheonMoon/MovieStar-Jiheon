import React, { useContext }from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screen/HomeScreen";
import MainScreen from "../screen/MainScreen";
import DetailScreen from "../screen/DetailScreen";
import LoginScreen from "../screen/LoginScreen";
import SignupScreen from "../screen/SignupScreen";
import FindIdScreen from "../component/FindId";
import FindPwdScreen from "../component/FindPwd";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Image,Text,View,StyleSheet,TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const StackDetailNavigator = () => {
    return (
      <Stack.Navigator >
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
            options={{ headerShown: false}} />
        <Stack.Screen name="Signup" component={SignupScreen} 
            options={{ headerShown: false}} />
        <Stack.Screen name="FindId" component={FindIdScreen} 
            options={{ headerShown: false}} />
        <Stack.Screen name="FindPassword" component={FindPwdScreen} 
            options={{ headerShown: false}}/>
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
        
    }

    //라벨 로그아웃 버튼 클릭 시
    const labelHandleLogout = () => {
        setUser(null)
        navigation.navigate('Login')
        
    }

    return(
        <Drawer.Navigator
            screenOptions={({navigation})=> ({
                drawerStyle:{backgroundColor: 'black',
                    width:180, 
                },
                drawerLabelStyle:{fontSize:16,color:'white'},
                drawerActiveTintColor:'#4caf50',  
                drawerInactiveTintColor: '#757575', 
                drawerPosition:'right',
                drawerType:'slide' ,
                headerLeft: () => (
                    null
                ),
                headerRight: () =>(
                    <View style={styles.container}>
                    <TouchableOpacity onPress={user ? handleLogout : navigateToLoginScreen}>
                        <Text style={styles.loginbutton}>
                            {user ? "로그아웃" : "로그인"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toggle} onPress={()=>navigation.toggleDrawer()}>
                        <MaterialCommunityIcons name="menu" size={28} color="#Fff" />
                    </TouchableOpacity>
                    </View>
                ),               
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
                options={({navigation})=> ({
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
                    headerRight:()=>(
                        <TouchableOpacity style={styles.toggle} onPress={()=>navigation.toggleDrawer()}>
                            <MaterialCommunityIcons name="menu" size={28} color="#Fff" />
                        </TouchableOpacity>
                    ),
                    headerTintColor : '#fff',
                    headerStyle:{
                        backgroundColor:'black',
                        height:90,
                    },
                    drawerLabel: ()=>{
                        return(
                        <TouchableOpacity onPress={user ? labelHandleLogout : navigateToLoginScreen}>
                            <Text style={{fontSize:16,color:'white'}}>
                                {user ? "Logout" : "Login"}
                            </Text>
                        </TouchableOpacity>
                        )
                    }                       
                })}/>
            {/* <Drawer.Screen name="Detail" component={DetailScreen}
                options={{title:'MovieDetail', headerShown: false,  }}/> */}
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