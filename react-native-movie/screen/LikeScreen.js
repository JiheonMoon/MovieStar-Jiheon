import react from "react";
import { View,Text,TouchableOpacity,Image,FlatList} from "react-native";
import { useNavigation,useRoute } from "@react-navigation/native";


const LikeScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { favoriteMovies = [] } = route.params || [];
    
    return(
        <View>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={{fontSize:30}} >←</Text>
            </TouchableOpacity>
            <Text>나의 찜 리스트</Text>
            {favoriteMovies.length === 0? (
                <Text>찜한 영화가 없습니다</Text>
            ):(
                <FlatList
                    data={favoriteMovies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Image
                                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                            />
                            <Text>{item.title}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    )
}

export default LikeScreen;