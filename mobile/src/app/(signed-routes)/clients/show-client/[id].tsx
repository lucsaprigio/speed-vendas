import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShowClient() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    console.log(id);

    return (
        <View>
            <SafeAreaView className="flex flex-row items-center justify-between bg-gray-200  py-8 px-6">
                <TouchableOpacity onPress={() => { router.back() }} activeOpacity={0.7}>
                    <Feather name="arrow-left" size={34} />
                </TouchableOpacity>
                <Text className="font-heading text-center text-3xl">Clientes</Text>
                <View></View>
            </SafeAreaView>
        </View>
    )
}