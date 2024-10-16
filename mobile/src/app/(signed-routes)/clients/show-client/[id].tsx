import { Button } from "@/src/components/button";
import { ClientDatabase, useClientDatabase } from "@/src/databases/clients/useClientDatabase";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShowClient() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const clientDatabase = useClientDatabase();

    const [clientData, setClientData] = useState({} as ClientDatabase);

    async function handleSearchClient() {
        try {
            const response = await clientDatabase.findById(Number(id));

            setClientData(response[0])
        } catch (error) {
            Alert.alert("Não foi possível carregar o usuário");
        }
    }

    useFocusEffect(useCallback(() => {
        handleSearchClient()
    }, []));

    return (
        <View>
            <ScrollView className="p-3">
                <SafeAreaView className="flex flex-row items-center justify-between bg-gray-200  py-8 px-6">
                    <TouchableOpacity onPress={() => { router.back() }} activeOpacity={0.7}>
                        <Feather name="arrow-left" size={34} />
                    </TouchableOpacity>
                    <Text className="font-heading text-center text-3xl">Cliente: {id}</Text>
                    <View></View>
                </SafeAreaView>
                <View className="flex-1">
                    <Text>{clientData.id}</Text>
                    <Text>{clientData.client_name}</Text>
                    <Text>{clientData.cpf_cnpj}</Text>
                    <Text>{clientData.phone}</Text>
                </View>
            </ScrollView>
            <View className="fixed bottom-0 space-y-3 p-3">
                <Button>
                    <Button.Text>
                        Novo Pedido
                    </Button.Text>
                </Button>
                <Button>
                    <Button.Text>
                        Visita
                    </Button.Text>
                </Button>
            </View>
        </View>
    )
}