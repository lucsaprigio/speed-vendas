import { userSessionDatabase } from "@/src/databases/users/userSessionDatabase";
import { formatDate } from "@/src/utils/functions/dateFormatted";
import { Feather, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Image, Modal, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";

import Client from "../../../../assets/images/cliente-satisfeito.png";
import Sales from "../../../../assets/images/terminal-pos.png";
import { IconButton } from "@/src/components/menu-button";
import { DeviceDatabase, useDeviceDatabase } from "@/src/databases/devices/useDeviceDatabase";
import { Button } from "@/src/components/button";

export default function Home() {
    const router = useRouter();

    const [day, setDay] = useState(0);
    const [weekDay, setWeekday] = useState('');
    const [month, setMonth] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);
    // const [fleetPending, setFleetPending] = useState<FleetDatabase[]>([]);
    const [deviceData, setDeviceData] = useState<DeviceDatabase[]>([]);

    const deviceDatabase = useDeviceDatabase();
    const sessionDatabase = userSessionDatabase();

    const servicesDefault = [
        {
            description: "Abastecimento",
        },
        {
            description: "Manutenção",
        },
        {
            description: "Revisão",
        },
        {
            description: "Limpeza",
        }
    ];

    async function handleGetDate() {
        const date = formatDate();

        setDay(date.day);
        setWeekday(date.dayOfWeek);
        setMonth(date.month);
    }

    async function getUserInfo() {
        try {
            const response = await sessionDatabase.find();

            setUsername(response[0].username);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleLogout() {
        await sessionDatabase.deleteSession();

        Alert.alert('Logout', 'Deseja mesmo sair?', [
            {
                text: "Sair",
                onPress: () => { router.push('/(auth-routes)/signin') }
            },
            {
                text: "Cancelar",
                style: "cancel"
            }
        ]);
    }

    /*     async function handleGetSalesToSent() {
            try {
                setModalLoading(true);
                const [deviceResponse, fleetResponse] = await Promise.all([
                    deviceDatabase.listDevice(),
                    fleetDatabase.listFleetsNotSent()
                ]);
                setFleetPending(fleetResponse);
                setDeviceData(deviceResponse);
    
            } catch (error) {
                console.log(error);
            } finally {
                setModalLoading(false);
            }
        } */

    /*     async function handleSendSales() {
            try {
                const response = await api.post(`${deviceData[0].ip_api}:8082/api/mobile/send-fleets/${deviceData[0].device}`, fleetPending);
    
                if (response.status === 200) {
                    await fleetDatabase.setSent(response.data);
                }
    
                Alert.alert("Dados enviados com sucesso!", "", [
                    {
                        text: "Fechar",
                        onPress: () => { setShowModal(false) }
                    }
                ]);
            } catch (error) {
                console.log(error.response);
                Alert.alert("Ocorreu um erro", `${error}`)
            } finally {
                setShowModal(false);
            }
        } */

    async function handleShowAlert() {
        setShowModal(true);
    }

    useEffect(() => {
        handleGetDate();
        getUserInfo();

        const disableBackHandler = () => {
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', disableBackHandler);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', disableBackHandler);
        };
    }, []);

    useFocusEffect(useCallback(() => {
        // handleGetSalesToSent();
    }, []));

    return (
        <View className="flex-1">
            <Modal visible={modalLoading} animationType="fade" transparent>
                <View className="flex-1 items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} >
                    <ActivityIndicator color={colors.blue[700]} size={42} />
                    <Text className="text-lg font-subtitle text-white">Cadastrando Serviços...</Text>
                </View>
            </Modal>
            <Modal visible={showModal} animationType="fade" transparent>
                <View className="flex-1 items-center justify-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} >
                    <View className="flex items-center justify-center w-full h-3/6 bg-gray-50 p-3">
                        <Text className="text-xl font-subtitle text-blue-950 text-center">Enviar Dados</Text>
                        <Text className="font-body text-sm text-center">Listamos abaixo algumas frotas que ainda serão enviadas.</Text>
                        <ScrollView className="flex space-y-2 mt-6">
                            {/*                             {
                                fleetPending && fleetPending.map((fleet) => (
                                    <View className="flex flex-row space-x-3 rounded-md bg-gray-200 p-3">
                                        <Text className="font-heading">{fleet.id}</Text>
                                        <Text className="font-body">{fleet.description}</Text>
                                        <Text className="font-body">R$ {fleet.price.toFixed(2)}</Text>
                                    </View>
                                ))
                            } */}
                        </ScrollView>
                        <View className="w-full p-1 space-y-2">
                            <Button onPress={() => { }}>
                                <Button.Text>
                                    <Text>Enviar</Text>
                                </Button.Text>
                            </Button>
                            <TouchableOpacity className="w-full h-12 rounded-lg items-center justify-center flex-row bg-red-400" onPress={() => { setShowModal(false) }}>
                                <Text className="text-lg font-body mr-4">
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <GestureHandlerRootView>
                <SafeAreaView className="relative flex flex-row justify-between bg-gray-200 border-b-[1px] border-gray-300 py-14 px-4">
                    <Pressable className="absolute top-14 left-7" onPress={handleShowAlert}>
                        {/*                         {
                            fleetPending.length > 0 &&
                            < View className="relative">
                                <Feather name="send" size={24} color={colors.blue[950]} />
                                <View className="-z-10 absolute right-0 top-4">
                                    <MaterialCommunityIcons name="circle" color={colors.red[600]} />
                                </View>
                            </View>
                        } */}
                    </Pressable>
                    <View className="flex flex-row items-center justify-center">
                        <TouchableOpacity className="flex items-center p-1 m-3 rounded-full" activeOpacity={0.5}>
                            <FontAwesome name="user-circle" size={52} color={colors.blue[950]} />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-lg font-subtitle">Olá, {username}</Text>
                            <Text className="text-sm font-body">{weekDay}, {day} de {month}</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="flex items-center justify-center" onPress={handleLogout}>
                        <Feather name="log-out" size={28} />
                    </TouchableOpacity>
                </SafeAreaView>
                <View className="flex-1 p-3 bg-gray-200">
                    <Text className="text-lg font-heading p-3">Selecione uma das opções abaixo</Text>
                    <View className="flex flex-row flex-wrap items-center justify-center gap-3 mt-8 bg-gray-200">
                        <IconButton
                            source={<Image className="w-14 h-14" resizeMode="contain" source={Sales} />}
                            title="Pedidos"
                            onPress={() => { router.push("/(signed-routes)/sales") }}
                        />
                        <IconButton
                            source={<Image className="w-14 h-14" resizeMode="contain" source={Client} />}
                            title="Clientes"
                            onPress={() => { router.push("/(signed-routes)/clients") }}
                        />
                    </View>
                </View>
            </GestureHandlerRootView>
        </View>
    )
}