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
                <View className="flex-1 py-10 space-y-6 items-start justify-center">
                    <View className="w-full flex flex-row border-b-[1px] border-gray-400">
                        <Text className="font-heading text-lg">
                            Código -
                        </Text>
                        <Text className="font-body">{clientData.id}</Text>
                    </View>
                    <View className="w-full flex border-b-[1px] border-gray-400">
                        <Text className="font-heading text-lg">
                            Razão social
                        </Text>
                        <Text className="font-body">{clientData.client_name}</Text>
                    </View>
                    <View className="w-full flex border-b-[1px] border-gray-400">
                        <Text className="font-heading text-lg">
                            CPF/CNPJ
                        </Text>
                        <Text className="font-body">{clientData.cpf_cnpj}</Text>
                    </View>
                    <View className="w-full flex border-b-[1px] border-gray-400">
                        <Text className="font-heading text-lg">
                            Endereço
                        </Text>
                        <Text className="font-body">{clientData.address}</Text>
                    </View>
                    <View className="w-full flex border-b-[1px] border-gray-400">
                        <Text className="font-heading text-lg">
                            Telefone
                        </Text>
                        <Text className="font-body">{clientData.phone}</Text>
                    </View>
                </View>
            </ScrollView>
            <View className="fixed bottom-0 space-y-3 p-3">
                <Button>
                    <Button.Text>
                        Novo Pedido
                    </Button.Text>
                </Button>
            </View>
        </View>
    )
}