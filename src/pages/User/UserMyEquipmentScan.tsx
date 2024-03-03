import { useEffect, useState } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Input,
    Stack,
    Box,
    FormLabel,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Flex,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { checkLoginUser } from '../../components/auth/checkLoginUser';
import Layout from '../../components/common/Layout';
import Swal from 'sweetalert2';
import { Scanner } from '@yudiel/react-qr-scanner';

const UserMyEquipmentScan = () => {
    const [user_id, setUserID] = useState<string | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        const decoded = await checkLoginUser();
        setUserID(decoded.user_id);
        try {
            const deviceList = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setSelectedDeviceId(videoDevices[0].deviceId);
            }
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    const handleDeviceChange = (deviceId: string) => {
        setSelectedDeviceId(deviceId);
    };

    const checkStatusEquipment = async (text: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/borrow/equipment/${text}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();
            console.log(result)

            if (result.status == 'success') {
                if (result.message.length == 0 || result.message[0].status == 0) {
                    fetchThisEquipment(parseInt(text)).then(equipment_data => {
                        if (equipment_data[0]?.status == 1 && equipment_data[0]?.deleted == 1) {
                            Swal.fire({
                                title: `Do you want to borrow ${equipment_data[0].equipment}?`,
                                icon: "question",
                                showCancelButton: true,
                                confirmButtonText: "Yes",
                                confirmButtonColor: "#3182CE",
                                cancelButtonText: "No",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    console.log('confirm')
                                    // fetch ข้อมูลลง database borrow
                                }
                            });
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: "This equipment cannot be borrowed or has been deleted",
                                icon: "error",
                                confirmButtonColor: '#3182CE',
                            });
                        }
                    })
                } else {
                    if (result.message[0].user_id == user_id) {
                        // คุณต้องการคืนอุปกรณ์
                        console.log('return')
                    } else {
                        // ให้คืนก่อน
                        console.log('return before')
                    }
                }
            } else {
                console.log('fetch data task failed')
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchThisEquipment = async (equipment_id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/equipment/${equipment_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                return result.message;
                // setFormUpdateData(result.message[0]);
                // onOpenModal2();
            } else {
                console.log('fetch data equipment failed')
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <Layout>
                <Box marginBottom="4">
                    <Scanner
                        onResult={(text, result) => checkStatusEquipment(text)}
                        onError={(error) => console.log(error?.message)}
                        options={{ deviceId: selectedDeviceId || undefined }}
                    />
                </Box>
                <Flex justifyContent="center" alignItems="center" flexDirection="column">
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            Select Camera
                        </MenuButton>
                        <MenuList>
                            {devices.map((device) => (
                                <MenuItem key={device.deviceId} onClick={() => handleDeviceChange(device.deviceId)}>
                                    {device.label}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </Flex>
            </Layout>
        </>
    )
}

export default UserMyEquipmentScan