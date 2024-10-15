import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Sales() {
    const router = useRouter()

    return (
        <SafeAreaView className="flex flex-row items-center justify-between bg-gray-200  py-8 px-6">
            <TouchableOpacity onPress={() => { router.back() }} activeOpacity={0.7}>
                <Feather name="arrow-left" size={34} />
            </TouchableOpacity>
            <Text className="font-heading text-center text-3xl">Pedidos</Text>
            <View></View>
        </SafeAreaView>
    )
}