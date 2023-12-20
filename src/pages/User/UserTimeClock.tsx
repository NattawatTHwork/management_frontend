import React, { useEffect, useState, FormEvent } from 'react'
import { Button, Box } from '@chakra-ui/react';
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

interface Office {
    office_id: number;
    company: string;
    start: string;
    end: string;
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

    const startWatchingPosition = (setIsInRangeCallback: (value: boolean) => void) => {
        return Geolocation.watchPosition(
            position => {
                const userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                const targetLocation = {
                    latitude: 18.77469718878088, // chiang mai home
                    longitude: 98.97099932558713,
                    // latitude: 18.77362222797399, // chiang mai office
                    // longitude: 98.96630371824182,
                    // latitude: 18.801104198434086, // land
                    // longitude: 99.0774146616516,
                    // latitude: 19.449025487832827, // home
                    // longitude: 100.35006777807445,

                };

                const distance = DistanceCalculator(userLocation, targetLocation);
                const isInRange = distance <= 50;

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
        if (!timeclocks[0].clock_out) {
            boxbutton.push(
                <Button key="clock-out" colorScheme="teal" size="lg" onClick={() => ClockOut()}>
                    CLOCK OUT
                </Button>
            );
        } else {
            boxbutton.push(
                <Button key="complete" colorScheme="teal" size="lg">
                    COMPLETE
                </Button>
            );
        }
    }

    const ClockIn = async () => {
        if (isInRange) {
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
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Cannot Clock In',
                text: 'You are not within the allowed range to clock in.',
            });
        }
    }

    const ClockOut = async () => {
        if (isInRange) {
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
                } else if (result.status == 'wait') {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Cannot Clock Out Yet',
                        text: 'You cannot clock out yet. Please wait until the specified time.',
                    });
                    fetchTimeClocks();
                } else {
                    alert('Failed')
                }
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Cannot Clock Out',
                text: 'You are not within the allowed range to clock out.',
            });
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