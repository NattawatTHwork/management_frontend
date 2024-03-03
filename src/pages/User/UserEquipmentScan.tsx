import { useEffect, useState } from 'react'
import {
    Button,
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Flex,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { checkLoginUser } from '../../components/auth/checkLoginUser';
import Layout from '../../components/common/Layout';
import Swal from 'sweetalert2';
import { Scanner } from '@yudiel/react-qr-scanner';

const UserEquipmentScan = () => {
    const [user_id, setUserID] = useState<string | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [showingAlert, setShowingAlert] = useState(false);

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

    const checkStatusEquipment = async (equipment_id: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/borrow/equipment/${equipment_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();
            console.log(result)

            if (result.status == 'success') {
                if (result.message[0]?.return_date != null || result.message.length == 0) {
                    fetchThisEquipment(parseInt(equipment_id)).then(equipment_data => {
                        if (equipment_data[0]?.status == 1) {
                            Swal.fire({
                                title: `Do you want to borrow ${equipment_data[0].equipment}?`,
                                icon: "question",
                                showCancelButton: true,
                                confirmButtonText: "Yes",
                                confirmButtonColor: "#3182CE",
                                cancelButtonText: "No",
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    try {
                                        const token = localStorage.getItem('token');
                                        const response = await fetch(`${process.env.REACT_APP_API_URL}/borrow/borrow`, {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: 'Bearer ' + token,
                                            },
                                            body: JSON.stringify({ user_id: user_id, equipment_id: equipment_id }),
                                        });

                                        const result = await response.json();

                                        if (result.status === 'success') {
                                            await Swal.fire({
                                                icon: 'success',
                                                title: 'Equipment Borrowed Successfully',
                                                text: 'The equipment has been borrowed successfully.',
                                                confirmButtonColor: '#3182CE',
                                            });
                                        } else if (result.status === 'error') {
                                            await Swal.fire({
                                                icon: 'error',
                                                title: 'Failed to Borrow Equipment',
                                                text: 'There was an issue borrowing the equipment.',
                                                confirmButtonColor: '#3182CE',
                                            });
                                        } else {
                                            alert('Failed');
                                        }
                                    } catch (error) {
                                        console.error("Error:", error);
                                    }
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
                        Swal.fire({
                            icon: 'question',
                            title: 'Confirm Return',
                            text: 'Are you sure you want to return this equipment?',
                            showCancelButton: true,
                            confirmButtonColor: '#3182CE',
                            confirmButtonText: 'Yes, return it!'
                        }).then(async (result_confirm) => {
                            if (result_confirm.isConfirmed) {
                                try {
                                    const token = localStorage.getItem('token');
                                    const response = await fetch(`${process.env.REACT_APP_API_URL}/borrow/return/${result.message[0].borrow_id}`, {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: 'Bearer ' + token,
                                        },
                                        body: JSON.stringify({}),
                                    });

                                    const result_return = await response.json();

                                    if (result_return.status === 'success') {
                                        await Swal.fire({
                                            icon: 'success',
                                            title: 'Equipment Returned Successfully',
                                            text: 'The equipment has been successfully returned.',
                                            confirmButtonColor: '#3182CE',
                                        });
                                    } else if (result_return.status === 'error') {
                                        await Swal.fire({
                                            icon: 'error',
                                            title: 'Failed to Return Equipment',
                                            text: 'There was an issue returning the equipment.',
                                            confirmButtonColor: '#3182CE',
                                        });
                                    } else {
                                        alert('Failed')
                                    }

                                } catch (error) {
                                    console.error("Error:", error);
                                }
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Cannot Borrow Equipment',
                            icon: 'error',
                            text: 'Please wait for the person who borrowed the equipment to return it before borrowing again.',
                            confirmButtonColor: '#3182CE',
                        });
                    }
                }
            } else {
                console.log('fetch data borrow failed')
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
            } else {
                console.log('fetch data equipment failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const delayAlert = () => {
        setShowingAlert(true);
        setTimeout(() => {
            setShowingAlert(false);
        }, 2500);
    }

    return (
        <>
            <Layout>
                <Box marginBottom="4">
                    <Scanner
                        onResult={(text, result) => {
                            if (!showingAlert) {
                                delayAlert();
                                checkStatusEquipment(text);
                            }
                        }}
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

export default UserEquipmentScan