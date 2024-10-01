import { CardList } from "@/src/components/card-list";
import { SearchInput } from "@/src/components/search-input";
import { ProviderDatabase, useProvidersDatabase } from "@/src/databases/provider-db/useProvidersDatabase";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Providers() {
    const router = useRouter();

    const [providers, setProviders] = useState<ProviderDatabase[]>([]);
    const [search, setSearch] = useState('');

    const providerDatabase = useProvidersDatabase();

    const filteredProviders = search.length > 0
        ? providers.filter(provider => provider.providerName.toLocaleUpperCase().includes(search.toLocaleUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")))
        : [];

    async function handleListProviders() {
        try {
            const response = await providerDatabase.listAll();

            const providersUpperCase = response.map(provider => ({
                ...provider,
                providerName: provider.providerName.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            }))

            setProviders(providersUpperCase);

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
                <Text className="font-heading text-center text-3xl">Prestadores</Text>
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
                    search !== '' && filteredProviders.length > 0 ? (
                        filteredProviders.map((provider) => (
                            <CardList
                                key={provider.id}
                                id={provider.id}
                                description={provider.providerName}
                            >
                                <Feather name="user" size={28} />
                            </CardList>
                        ))
                    ) : search !== '' && filteredProviders.length === 0 ? (
                        <View className="flex items-center justify-center mt-20">
                            <Text className="text-gray-500 font-body text-md">Sem resultados na pesquisa</Text>
                        </View>
                    ) : (
                        providers.slice(0, 10).map((provider) => (  // Mostra apenas os 10 primeiros
                            <CardList
                                key={provider.id}
                                id={provider.id}
                                description={provider.providerName}
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