import React, { useEffect, useState } from 'react'
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
} from '@chakra-ui/react';
import { checkLoginUser } from '../../components/auth/checkLoginUser';
import Layout from '../../components/common/Layout';
import { ChevronDownIcon } from '@chakra-ui/icons';

const UserTimeSheet = () => {
    const [myleaves, setMyLeaves] = useState([]);
    const [mytimeclocks, setMyTimeClocks] = useState([]);
    const [myindex, setMyIndex] = useState<number>(0);
    const { isOpen: isOpenModal1, onOpen: onOpenModal1, onClose: onCloseModal1 } = useDisclosure();
    const [formSelectData, setFormSelectData] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const Day = new Date(formSelectData.year, formSelectData.month, 0).getDate();
    const datas = [];
    for (let i = 1; i <= Day; i++) {
        const dateString = `${i.toString().padStart(2, '0')}/${(formSelectData.month).toString().padStart(2, '0')}/${formSelectData.year}`;
        const matchingTimeclock = mytimeclocks.find(timeclock => {
            const clockInDate = new Date((timeclock as any).clock_in);
            const timeclockDateString = `${clockInDate.getDate().toString().padStart(2, '0')}/${(clockInDate.getMonth() + 1).toString().padStart(2, '0')}/${clockInDate.getFullYear()}`;
            return timeclockDateString === dateString;
        });

        const matchingLeave = myleaves.find(myleave => {
            const LeaveDate = new Date((myleave as any).leave_date);
            const leaveDateString = `${LeaveDate.getDate().toString().padStart(2, '0')}/${(LeaveDate.getMonth() + 1).toString().padStart(2, '0')}/${LeaveDate.getFullYear()}`;
            return leaveDateString === dateString;
        });

        if (matchingTimeclock) {
            datas.push({
                date: dateString,
                clock_in: new Date((matchingTimeclock as any).clock_in).toLocaleTimeString('th-TH'),
                clock_out: ((matchingTimeclock as any).clock_out !== null) ? new Date((matchingTimeclock as any).clock_out).toLocaleTimeString('th-TH') : null,
                description: null
            });
        } else if (matchingLeave) {
            datas.push({
                date: dateString,
                clock_in: (matchingLeave as any).leave_type,
                clock_out: '',
                description: (matchingLeave as any).description
            });
        } else {
            datas.push({
                date: dateString,
                clock_in: null,
                clock_out: null,
                description: null
            });
        }
    }

    const months = [];
    for (let i = 1; i <= 12; i++) {
        months.push({ value: i, label: new Date(2000, i - 1, 1).toLocaleString('th-TH', { month: 'long' }) });
    }

    const years = [];
    for (let year = 2023; year <= 2042; year++) {
        years.push({ value: year, label: (year).toString() });
    }

    useEffect(() => {
        const fetchMyTimeSheets = async () => {
            try {
                const decoded = await checkLoginUser();
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/timesheet/my_timesheet/${decoded.user_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                    body: JSON.stringify(formSelectData),
                });
    
                const result = await response.json();
    
                if (result.status === 'success') {
                    setMyTimeClocks(result.results_timeclock);
                    setMyLeaves(result.results_leave);
                } else {
                    console.log('fetch data task failed')
                }
            } catch (error) {
                console.log(error);
            }
        };
        
        fetchMyTimeSheets();
    }, [formSelectData]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormSelectData({
            ...formSelectData,
            [e.target.name]: e.target.value,
        });
    };

    const ViewLeave = (index: number) => {
        setMyIndex(index);
        onOpenModal1();
    }

    return (
        <>
            <Layout>
                <Flex justify="flex-end" align="center" mt={4}>
                    <Select name='month' onChange={handleSelectChange} defaultValue={formSelectData.month}>
                        {months.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </Select>
                    <Select name='year' onChange={handleSelectChange} defaultValue={formSelectData.year}>
                        {years.map((y) => (
                            <option key={y.value} value={y.value}>
                                {y.value + 543}
                            </option>
                        ))}
                    </Select>
                </Flex>
                <TableContainer>
                    <Table variant='striped' colorScheme='blue'>
                        <Thead>
                            <Tr>
                                <Th>Date</Th>
                                <Th>Clock In</Th>
                                <Th>Clock Out</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {datas
                                .map((data, index) => (
                                    <Tr key={index}>
                                        <Td>{new Date(data.date).toLocaleString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Td>
                                        <Td>{data.clock_in === 1 ? 'Sick Leave' : data.clock_in === 2 ? 'Personal Leave' : data.clock_in}</Td>
                                        <Td>{data.clock_out}</Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} isDisabled={data.clock_in !== 1 && data.clock_in !== 2}>
                                                    Actions
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={() => ViewLeave(index)}>View Description</MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Drawer
                    isOpen={isOpenModal1}
                    placement='right'
                    onClose={onCloseModal1}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth='1px'>
                            View Description
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Box>
                                    <FormLabel htmlFor='leave_type'>Leave Type</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel>{datas[myindex]?.clock_in === 1 ? 'Sick Leave' : 'Personal Leave'}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='description'>Description</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel>{datas[myindex]?.description}</FormLabel>
                                    </Box>
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal1}>
                                Close
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

            </Layout>
        </>
    )
}

export default UserTimeSheet