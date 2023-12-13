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
    InputRightElement
} from '@chakra-ui/react';
import { checkLoginUser } from '../../components/auth/checkLoginUser';
import Layout from '../../components/common/Layout';
import { AddIcon, ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';

interface Leave {
    leave_requests_id: number;
    user_id: number;
    leave_type: number;
    description: string;
    start_date: string;
    end_date: string;
    status: number;
}

const UserLeave = () => {
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const { isOpen: isOpenModal1, onOpen: onOpenModal1, onClose: onCloseModal1 } = useDisclosure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(leaves.length / itemsPerPage);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [formCreateData, setFormCreateData] = useState({
        user_id: 0,
        leave_type: 1,
        description: '',
        start_date: '',
        end_date: '',
    });

    console.log(formCreateData)

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const decoded = await checkLoginUser();
            setFormCreateData({
                user_id: decoded.user_id,
                leave_type: 1,
                description: '',
                start_date: '',
                end_date: '',
            });
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/leave/my_leave/${decoded.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setLeaves(result.message);
            } else {
                console.log('fetch data task failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleInputCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormCreateData({
            ...formCreateData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectCreateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormCreateData({
            ...formCreateData,
            [e.target.name]: e.target.value,
        });
    };

    const CreateLeaveSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formCreateData.user_id
            || !formCreateData.leave_type
            || !formCreateData.description
            || !formCreateData.start_date
            || !formCreateData.end_date) {
            onCloseModal1();
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Form',
                text: 'Please fill in all required fields.',
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/leave/create_leave`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(formCreateData),
            });

            const result = await response.json();

            if (result.status === 'success') {
                onCloseModal1();
                await Swal.fire({
                    icon: 'success',
                    title: 'Leave Added Successfully',
                    text: 'The leave has been added to the system.',
                });
                fetchLeaves();
            } else if (result.status == 'error') {
                onCloseModal1();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add Leave',
                    text: 'There was an issue adding the leave to the system.',
                });
                fetchLeaves();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            <Layout>
                <Flex justify="space-between" align="center" mt={4}>
                    <Box>
                        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpenModal1}>
                            Create Leave
                        </Button>
                    </Box>
                    <Box >
                        <InputGroup>
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={() => setSearchTerm('')}>
                                    Clear
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </Box>
                </Flex>
                <TableContainer>
                    <Table variant='striped' colorScheme='teal'>
                        <Thead>
                            <Tr>
                                <Th>Task</Th>
                                <Th>Date Time</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {leaves
                                .filter((leave) => {
                                    const searchTermLower = searchTerm.toLowerCase();
                                    return (leave.leave_type === 1 ? 'Sick Leave' : 'Personal Leave').toLowerCase().includes(searchTermLower)
                                        || leave.description.toLowerCase().includes(searchTermLower)
                                        || leave.start_date.toLowerCase().includes(searchTermLower)
                                        || leave.end_date.toLowerCase().includes(searchTermLower)
                                        || (leave.status === 1 ? 'Approved' : leave.status === 2 ? 'Pending' : 'Denied').toLowerCase().includes(searchTermLower);
                                })
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((leave, index) => (
                                    <Tr key={leave.leave_requests_id}>
                                        <Td>{leave.leave_type === 1 ? 'Sick Leave' : 'Personal Leave'}</Td>
                                        <Td>{new Date(leave.start_date).toLocaleDateString('en-TH')}</Td>
                                        <Td>{new Date(leave.end_date).toLocaleDateString('en-TH')}</Td>
                                        <Td>
                                            <Box as='button' borderRadius='md' bg={leave.status === 1 ? 'green.500' : leave.status === 2 ? 'yellow.500' : 'red.500'} color='white' px={4} h={8}>
                                                {leave.status === 1 ? 'Approved' : leave.status === 2 ? 'Pending' : 'Denied'}
                                            </Box>
                                        </Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>
                                                <MenuList>
                                                    {/* <MenuItem onClick={() => ViewTask(index)}>View Responsible</MenuItem>
                                                    <MenuItem onClick={() => AcceptResponsible(task.responsible_id)}>Accept Responsible</MenuItem> */}
                                                </MenuList>
                                            </Menu>
                                        </Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
                <Drawer
                    isOpen={isOpenModal1}
                    placement='right'
                    onClose={onCloseModal1}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth='1px'>
                            Create Leave
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                {/* <Input
                                    type='hidden'
                                    name='user_id'
                                    value={user_id}
                                    onChange={handleInputCreateChange}
                                    placeholder='Please enter full description'
                                /> */}

                                <Box>
                                    <FormLabel htmlFor='leave_type'>Leave Type</FormLabel>
                                    <Select name='leave_type' onChange={handleSelectCreateChange} defaultValue='1'>
                                        <option value='1'>Sick Leave</option>
                                        <option value='2'>Personal Leave</option>
                                    </Select>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='description'>Description</FormLabel>
                                    <Input
                                        type='textarea'
                                        name='description'
                                        value={formCreateData.description}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter full description'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='start_date'>Start Date</FormLabel>
                                    <Input
                                        type='date'
                                        name='start_date'
                                        value={formCreateData.start_date}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter start date'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='end_date'>End Date</FormLabel>
                                    <Input
                                        type='date'
                                        name='end_date'
                                        value={formCreateData.end_date}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter end date'
                                    />
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal1}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={CreateLeaveSubmit}>Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Layout>
        </>
    )
}

export default UserLeave