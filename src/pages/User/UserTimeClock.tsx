import { useEffect, useState } from 'react'
import { Button, Box, SimpleGrid, Card, FormLabel, Heading, CardBody } from '@chakra-ui/react';
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
    const [offices, setOffices] = useState<Office[]>([]);
    const [user_id, setUserId] = useState<number>(0);
    const [isInRange, setIsInRange] = useState(false);

    useEffect(() => {
        const startWatchingPosition = async (setIsInRangeCallback: (value: boolean) => void) => {
            try {
                const officesData = await fetchOffices();
        
                if (officesData) {
                    const watchId = Geolocation.watchPosition(
                        position => {
                            const userLocation = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            };
        
                            const targetLocation = {
                                latitude: officesData[0].latitude,
                                longitude: officesData[0].longitude,
                            };
        
                            const distance = DistanceCalculator(userLocation, targetLocation);
                            const isInRange = distance <= 50;
        
                            setIsInRangeCallback(isInRange);
                        },
                        error => console.error(error),
                        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                    );
        
                    return watchId;
                } else {
                    console.log('Failed to fetch offices data');
                    return null;
                }
            } catch (error) {
                console.log('Error fetching offices data:', error);
                return null;
            }
        };
    
        const startWatching = async () => {
            const watchId = await startWatchingPosition(setIsInRange);
            if (watchId) {
                return () => {
                    Geolocation.clearWatch(watchId);
                };
            }
        };
    
        fetchTimeClocks();
        startWatching();
    }, []);
    
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

            if (result.status === 'success') {
                setTimeClocks(result.message);
            } else {
                console.log('fetch data task failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchOffices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_API_URL + '/office', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status === 'success') {
                setOffices(result.message);
                return result.message;
            } else {
                console.log('fetch data rank failed');
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const boxbutton = [];
    if (timeclocks.length === 0) {
        boxbutton.push(
            <Button key="clock-in" colorScheme="blue" size="lg" onClick={() => ClockIn()}>
                CLOCK IN
            </Button>
        )
    } else {
        if (!timeclocks[0].clock_out) {
            boxbutton.push(
                <Button key="clock-out" colorScheme="blue" size="lg" onClick={() => ClockOut()}>
                    CLOCK OUT
                </Button>
            );
        } else {
            boxbutton.push(
                <Button key="complete" colorScheme="blue" size="lg">
                    COMPLETE
                </Button>
            );
        }
    }

    const ClockIn = async () => {
        const confirmClockIn = await Swal.fire({
            icon: 'question',
            title: 'Confirm Clock In',
            text: 'Are you sure you want to clock in?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Clock In',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3182CE',
        });
        if (confirmClockIn.isConfirmed) {
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
                            confirmButtonColor: '#3182CE',
                        });
                        fetchTimeClocks();
                    } else if (result.status === 'error') {
                        await Swal.fire({
                            icon: 'error',
                            title: 'Failed to Clock In',
                            text: 'There was an issue clocking in.',
                            confirmButtonColor: '#3182CE',
                        });
                        fetchTimeClocks();
                    } else if (result.status === 'leave') {
                        await Swal.fire({
                            icon: 'warning',
                            title: 'Today you are on leave',
                            text: 'There was an issue clocking in.',
                            confirmButtonColor: '#3182CE',
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
                    confirmButtonColor: '#3182CE',
                });
            }
        }
    }

    const ClockOut = async () => {
        const confirmClockOut = await Swal.fire({
            icon: 'question',
            title: 'Confirm Clock Out',
            text: 'Are you sure you want to clock out?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Clock Out',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3182CE',
        });
        if (confirmClockOut.isConfirmed) {
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
                            confirmButtonColor: '#3182CE',
                        });
                        fetchTimeClocks();
                    } else if (result.status === 'error') {
                        await Swal.fire({
                            icon: 'error',
                            title: 'Failed to Clock Out',
                            text: 'There was an issue clocking out.',
                            confirmButtonColor: '#3182CE',
                        });
                        fetchTimeClocks();
                    } else if (result.status === 'wait') {
                        await Swal.fire({
                            icon: 'warning',
                            title: 'Cannot Clock Out Yet',
                            text: 'You cannot clock out yet. Please wait until the specified time.',
                            confirmButtonColor: '#3182CE',
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
                    confirmButtonColor: '#3182CE',
                });
            }
        }
    }

    return (
        <>
            <Layout>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    height="100vh"
                >
                    {boxbutton}
                    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' marginTop={4}>
                        <Card>
                            <CardBody>
                                <Heading size='lg'>Clock in : {timeclocks[0]?.clock_in && new Date(timeclocks[0].clock_in).toLocaleTimeString([], { hour12: false })}</Heading>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <Heading size='lg'>Clock out : {timeclocks[0]?.clock_out && new Date(timeclocks[0].clock_out).toLocaleTimeString([], { hour12: false })}</Heading>
                            </CardBody>
                        </Card>
                    </SimpleGrid>
                    <FormLabel>Today Normal Clock in : {offices[0]?.start} and Clock out : {offices[0]?.end}</FormLabel>
                </Box>
            </Layout>
        </>
    )
}

export default UserTimeClock