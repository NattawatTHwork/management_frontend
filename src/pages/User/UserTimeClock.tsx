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
import { AddIcon, ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';
import Geolocation from '@react-native-community/geolocation';

interface TimeClock {
    timeclock_id: number;
    user_id: number;
    clock_in: string;
    clock_out: string;
}

const UserTimeClock = () => {
    const [timeclocks, setTimeClocks] = useState<TimeClock[]>([]);
    const { isOpen: isOpenModal1, onOpen: onOpenModal1, onClose: onCloseModal1 } = useDisclosure();
    const { isOpen: isOpenModal2, onOpen: onOpenModal2, onClose: onCloseModal2 } = useDisclosure();
    const { isOpen: isOpenModal3, onOpen: onOpenModal3, onClose: onCloseModal3 } = useDisclosure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(timeclocks.length / itemsPerPage);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isInRange, setIsInRange] = useState(false);
    const [formCreateData, setFormCreateData] = useState({
        user_id: 0,
        clock_in: '',
    });
    const [formUpdateData, setFormUpdateData] = useState({
        timeclock_id: 0,
        clock_out: '',

    });


    useEffect(() => {
        fetchTimeClocks();

        const watchId = Geolocation.watchPosition(
            position => {
                // ตำแหน่งปัจจุบันของผู้ใช้
                const userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                // ตำแหน่งที่ต้องการให้ Check-in (ตั้งตำแหน่งที่ต้องการตรวจสอบ)
                const targetLocation = {
                    latitude: 18.77470470638687,
                    longitude: 98.97101352036422,
                    // 18.77470470638687, 98.97101352036422 home
                    // 18.773604102368942, 98.9662712305405 office
                };

                // คำนวณระยะทางระหว่างตำแหน่งผู้ใช้กับตำแหน่งที่ต้องการให้ Check-in
                const distance = calculateDistance(userLocation, targetLocation);

                // ตรวจสอบว่าผู้ใช้อยู่ในระยะที่กำหนดหรือไม่
                const isInRange = distance <= 50;

                setIsInRange(isInRange);
            },
            error => console.error(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

        // ยกเลิกการตรวจสอบตำแหน่งเมื่อ Component ถูก Unmount
        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);

    const fetchTimeClocks = async () => {
        try {
            const decoded = await checkLoginUser();
            setFormCreateData({
                user_id: decoded.user_id,
                clock_in: '',
            });
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

    const ClockIn = () => {

    }

    const ClockOut = () => {

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

const calculateDistance = (locationA: Location, locationB: Location) => {
    const earthRadius = 6371; // รัศมีของโลก (หน่วย: กิโลเมตร)

    const latA = toRadians(locationA.latitude);
    const lonA = toRadians(locationA.longitude);
    const latB = toRadians(locationB.latitude);
    const lonB = toRadians(locationB.longitude);

    const dLon = lonB - lonA;
    const dLat = latB - latA;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(latA) * Math.cos(latB) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
};

// ฟังก์ชั่นแปลงองศาเป็นเรเดียน
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

// ชนิดข้อมูลตำแหน่ง
interface Location {
    latitude: number;
    longitude: number;
};