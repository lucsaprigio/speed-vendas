import { CardList } from "@/src/components/card-list";
import { SearchInput } from "@/src/components/search-input";
import { ClientDatabase, useClientDatabase } from "@/src/databases/clients/useClientDatabase";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Clients() {
    const router = useRouter();

    const [clients, setClients] = useState<ClientDatabase[]>([]);
    const [search, setSearch] = useState('');

    const clientDatabase = useClientDatabase();

    const filteredClients = search.length > 0
        ? clients.filter(client => client.client_name.toLocaleUpperCase().includes(search.toLocaleUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")))
        : [];

    async function handleListProviders() {
        try {
            const response = await clientDatabase.list();

            const clientUpperCase = response.map(provider => ({
                ...provider,
                providerName: provider.client_name.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            }))

            setClients(clientUpperCase);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleShowClient(id: number) {
        try {
            router.push(`/(signed-routes)/clients/show-client/${id}`);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleListProviders();
    }, [])

    return (
        <View className="flex-1 bg-gray-200">
            <SafeAreaView className="flex flex-row items-center justify-between bg-gray-200  py-8 px-6">
                <TouchableOpacity onPress={() => { router.back() }} activeOpacity={0.7}>
                    <Feather name="arrow-left" size={34} />
                </TouchableOpacity>
                <Text className="font-heading text-center text-3xl">Clientes</Text>
                <View></View>
            </SafeAreaView>
            <View className="border-b-[1px] border-gray-300 py-3">
                <SearchInput
                    value={search}
                    onChangeText={setSearch}
                    actionButton={() => { setSearch('') }}
                    isFilled={!!search}
                    placeholder="Pesquisar"
                />
            </View>
            <ScrollView>
                {
                    search !== '' && filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                            <CardList
                                key={client.id}
                                id={client.id}
                                onPress={() => { handleShowClient(client.id) }}
                                description={client.client_name}
                            >
                                <Feather name="user" size={28} />
                            </CardList>
                        ))
                    ) : search !== '' && filteredClients.length === 0 ? (
                        <View className="flex items-center justify-center mt-20">
                            <Text className="text-gray-500 font-body text-md">Sem resultados na pesquisa</Text>
                        </View>
                    ) : (
                        clients.slice(0, 10).map((client) => (  // Mostra apenas os 10 primeiros
                            <CardList
                                onPress={() => { handleShowClient(client.id) }}
                                key={client.id}
                                id={client.id}
                                description={client.client_name}
                            >
                                <Feather name="user" size={28} />
                            </CardList>
                        ))
                    )
                }
            </ScrollView>
        </View>
    )
}