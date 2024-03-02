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

    return (
        <>
            <Layout>
                <Box marginBottom="4">
                    <Scanner
                        onResult={(text, result) => console.log(text, result)}
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