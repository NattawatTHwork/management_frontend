import React, { useEffect, useState, FormEvent } from 'react'
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
    Select,
    Flex,
    InputGroup,
    InputRightElement,
    Textarea
} from '@chakra-ui/react';
import { checkLoginUser } from '../../components/auth/checkLoginUser';
import Layout from '../../components/common/Layout';
import Swal from 'sweetalert2';
import Geolocation from '@react-native-community/geolocation';
import DistanceCalculator from '../../components/DistanceCalculator';

interface TimeClock {
    timeclock_id: number;
    user_id: number;
    clock_in: string;
    clock_out: string;
}

const UserTimeClock = () => {
    const [timeclocks, setTimeClocks] = useState<TimeClock[]>([]);
    const [user_id, setUserId] = useState<number>(0);
    const [isInRange, setIsInRange] = useState(false);


    useEffect(() => {
        fetchTimeClocks();

        const watchId = startWatchingPosition(setIsInRange);
        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);

    console.log(isInRange)

    const startWatchingPosition = (setIsInRangeCallback: (value: boolean) => void) => {
        return Geolocation.watchPosition(
            position => {
                const userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                const targetLocation = {
                    latitude: 18.773604102368942,
                    longitude: 98.773604102368942,
                    // 18.77470470638687, 98.97101352036422 home
                    // 18.773604102368942, 98.773604102368942 office
                };

                const distance = DistanceCalculator(userLocation, targetLocation);
                const isInRange = distance <= 10;

                setIsInRangeCallback(isInRange);
            },
            error => console.error(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    const fetchTimeClocks = async () => {
        try {
            const decoded = await checkLoginUser();
            setUserId(decoded.user_id);
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/timeclock/check_clock_in/${decoded.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setTimeClocks(result.message);
            } else {
                console.log('fetch data task failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const boxbutton = [];
    if (timeclocks.length === 0) {
        boxbutton.push(
            <Button key="clock-in" colorScheme="teal" size="lg" onClick={() => ClockIn()}>
                CLOCK IN
            </Button>
        )
    } else {
        boxbutton.push(
            <Button key="clock-out" colorScheme="teal" size="lg" onClick={() => ClockOut()}>
                CLOCK OUT
            </Button>
        )
    }

    const ClockIn = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/timeclock/clock_in`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify({ user_id: user_id }),
            });

            const result = await response.json();

            if (result.status === 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Clock In Successful',
                    text: 'You have successfully clocked in.',
                });
                fetchTimeClocks();
            } else if (result.status == 'error') {
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Clock In',
                    text: 'There was an issue clocking in.',
                });
                fetchTimeClocks();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const ClockOut = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/timeclock/clock_out`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify({ timeclock_id: timeclocks[0]?.timeclock_id }),
            });

            const result = await response.json();

            if (result.status === 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Clock Out Successful',
                    text: 'You have successfully clocked out.',
                });
                fetchTimeClocks();
            } else if (result.status == 'error') {
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Clock Out',
                    text: 'There was an issue clocking out.',
                });
                fetchTimeClocks();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <>
            <Layout>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="100vh"
                >
                    {boxbutton}
                </Box>
            </Layout>
        </>
    )
}

export default UserTimeClock